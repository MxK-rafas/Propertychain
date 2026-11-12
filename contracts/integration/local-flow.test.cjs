const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { once } = require("node:events");
const { JsonRpcProvider, Contract, sha256 } = require("ethers");

const root = path.resolve(__dirname, "..");
const cli = require.resolve("hardhat/internal/cli/cli");
const deploymentFile = path.join(root, "deployments/localhost.json");
const seedFile = path.join(root, "deployments/seed-local.json");
const frontendEnv = path.join(root, "../frontend/.env.local");
const frontendAbi = path.join(root, "../frontend/generated/DocumentRegistry.json");

function run(...args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cli, ...args], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout.on("data", (data) => { output += data; });
    child.stderr.on("data", (data) => { output += data; });
    child.on("error", reject);
    child.on("close", (code) => resolve({ code, output }));
  });
}

test("no local: deploy, permissoes, seed repetivel e consultas sem carteira", { timeout: 90000 }, async () => {
  // Não reutilizar nem encerrar um nó de desenvolvimento que já esteja em uso.
  const probe = await fetch("http://127.0.0.1:8545", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_chainId", params: [] }),
    signal: AbortSignal.timeout(1000),
  }).catch(() => null);
  assert.equal(probe, null, "A porta 8545 precisa estar livre para o teste isolado.");

  const saved = new Map();
  for (const file of [deploymentFile, seedFile, frontendEnv, frontendAbi]) {
    saved.set(file, await fs.readFile(file).catch((error) => {
      if (error.code === "ENOENT") return null;
      throw error;
    }));
  }
  const node = spawn(process.execPath, [cli, "node", "--hostname", "127.0.0.1"], {
    cwd: root, stdio: "ignore",
  });
  const provider = new JsonRpcProvider("http://127.0.0.1:8545", 31337, { staticNetwork: true });
  try {
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      if (node.exitCode !== null) throw new Error("O no Hardhat encerrou durante a inicializacao.");
      try { await provider.send("eth_chainId", []); ready = true; break; }
      catch { await new Promise((resolve) => setTimeout(resolve, 100)); }
    }
    assert.ok(ready, "O no local nao iniciou em 10 segundos.");
    await fs.rm(deploymentFile, { force: true });
    const missing = await run("run", "scripts/seed-local.cjs", "--network", "localhost");
    assert.notEqual(missing.code, 0);
    assert.match(missing.output, /Execute npm run deploy:local/);

    const unsafe = await run("run", "scripts/deploy-local.cjs", "--network", "hardhat");
    assert.notEqual(unsafe.code, 0);
    assert.match(unsafe.output, /exige localhost/);

    await fs.writeFile(frontendEnv, "# Configuracao do app\nVITE_OUTRA_CONFIG=preservada\nVITE_CHAIN_ID=1\n");
    const deployed = await run("run", "scripts/deploy-local.cjs", "--network", "localhost");
    assert.equal(deployed.code, 0, deployed.output);
    const deployment = JSON.parse(await fs.readFile(deploymentFile));
    const exported = JSON.parse(await fs.readFile(frontendAbi));
    assert.equal(exported.address, deployment.address);
    const env = await fs.readFile(frontendEnv, "utf8");
    assert.match(env, /VITE_OUTRA_CONFIG=preservada/);
    assert.match(env, /^VITE_CHAIN_ID=31337$/m);
    assert.equal(env.match(/VITE_CHAIN_ID=/g).length, 1);
    const registry = new Contract(deployment.address, exported.abi, provider);
    assert.ok(await registry.hasRole(await registry.DEFAULT_ADMIN_ROLE(), deployment.accounts.admin));
    assert.ok(await registry.hasRole(await registry.VALIDATOR_ROLE(), deployment.accounts.validator));
    assert.equal(await registry.hasRole(await registry.VALIDATOR_ROLE(), deployment.accounts.owner), false);

    const seeded = await run("run", "scripts/seed-local.cjs", "--network", "localhost");
    assert.equal(seeded.code, 0, seeded.output);
    const seed = JSON.parse(await fs.readFile(seedFile));
    assert.equal((await registry.getDocumentsByProperty(seed.propertyRef)).length, 5);
    for (const item of seed.documents) {
      assert.equal(item.hash, sha256(await fs.readFile(path.join(root, "fixtures", item.file))));
      assert.equal((await registry.verifyDocument(item.hash)).status, BigInt(item.status));
    }
    assert.equal((await registry.getHolderHistory(seed.propertyRef)).length, 2);
    assert.equal(await registry.latestAttestedHolder(seed.propertyRef), deployment.accounts.buyer);
    const beforeRepeat = await provider.send("eth_blockNumber", []);
    const repeated = await run("run", "scripts/seed-local.cjs", "--network", "localhost");
    assert.equal(repeated.code, 0, repeated.output);
    assert.equal(await provider.send("eth_blockNumber", []), beforeRepeat, "Repetir seed nao deve criar transacoes.");

    await provider.send("hardhat_reset", []);
    const stale = await run("run", "scripts/seed-local.cjs", "--network", "localhost");
    assert.notEqual(stale.code, 0);
    assert.match(stale.output, /Deploy local desatualizado/);
  } finally {
    provider.destroy();
    if (node.exitCode === null) { node.kill("SIGTERM"); await once(node, "exit"); }
    for (const [file, content] of saved) {
      if (content === null) await fs.rm(file, { force: true });
      else { await fs.mkdir(path.dirname(file), { recursive: true }); await fs.writeFile(file, content); }
    }
  }
});
