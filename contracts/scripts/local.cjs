const fs = require("node:fs/promises");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const deploymentPath = path.join(root, "deployments/localhost.json");

async function requireLocal(hre) {
  const chain = await hre.ethers.provider.getNetwork();
  if (hre.network.name !== "localhost" || chain.chainId !== 31337n) {
    throw new Error("Este comando exige localhost, chainId 31337 e um no Hardhat local.");
  }
  const client = await hre.ethers.provider.send("web3_clientVersion", []);
  if (!client.startsWith("HardhatNetwork/")) throw new Error("O RPC local nao e um no Hardhat.");
}

async function writeJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(value, null, 2) + "\n");
}

async function exportFrontend(hre, deployment) {
  const artifact = await hre.artifacts.readArtifact("DocumentRegistry");
  await writeJson(path.join(root, "../frontend/generated/DocumentRegistry.json"), {
    address: deployment.address,
    chainId: deployment.chainId,
    deploymentBlock: deployment.deploymentBlock,
    abi: artifact.abi,
  });
  const envPath = path.join(root, "../frontend/.env.local");
  let current = await fs.readFile(envPath, "utf8").catch((error) => {
    if (error.code === "ENOENT") return "";
    throw error;
  });
  const values = {
    VITE_CHAIN_ID: "31337",
    VITE_RPC_URL: "http://127.0.0.1:8545",
    VITE_CONTRACT_ADDRESS: deployment.address,
    VITE_DEPLOY_BLOCK: String(deployment.deploymentBlock),
  };
  for (const [name, value] of Object.entries(values)) {
    const pattern = new RegExp(`^(?:export\\s+)?${name}=.*$`, "gm");
    if (pattern.test(current)) current = current.replace(pattern, `${name}=${value}`);
    else current += `${current.endsWith("\n") || current === "" ? "" : "\n"}${name}=${value}\n`;
  }
  await fs.writeFile(envPath, current);
}

async function loadDeployment(hre) {
  await requireLocal(hre);
  let deployment;
  try {
    deployment = JSON.parse(await fs.readFile(deploymentPath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") throw new Error("Execute npm run deploy:local antes do seed.");
    throw error;
  }
  const block = await hre.ethers.provider.getBlock(deployment.deploymentBlock);
  const code = await hre.ethers.provider.getCode(deployment.address);
  if (deployment.chainId !== 31337 || !block || block.hash !== deployment.deploymentBlockHash || code === "0x") {
    throw new Error("Deploy local desatualizado. Execute npm run deploy:local novamente.");
  }
  return deployment;
}

module.exports = { root, deploymentPath, requireLocal, writeJson, exportFrontend, loadDeployment };
