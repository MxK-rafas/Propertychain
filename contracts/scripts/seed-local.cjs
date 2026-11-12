const hre = require("hardhat");
const fs = require("node:fs/promises");
const path = require("node:path");
const { root, loadDeployment, writeJson } = require("./local.cjs");

async function main() {
  const deployment = await loadDeployment(hre);
  const { ethers } = hre;
  const validator = await ethers.getSigner(deployment.accounts.validator);
  const owner = await ethers.getSigner(deployment.accounts.owner);
  const registry = await ethers.getContractAt("DocumentRegistry", deployment.address);
  const propertyRef = ethers.id("propertychain:local:imovel-inteiramente-ficticio");
  const files = [
    { file: "escritura-a.txt", docType: 1, status: 2 },
    { file: "escritura-b.txt", docType: 1, status: 2 },
    { file: "pendente.txt", docType: 3, status: 1 },
    { file: "rejeitado.txt", docType: 5, status: 3 },
    { file: "revogado.txt", docType: 3, status: 4 },
  ];
  for (const item of files) {
    item.hash = ethers.sha256(await fs.readFile(path.join(root, "fixtures", item.file)));
    let document = await registry.verifyDocument(item.hash);
    if (document.status === 0n) {
      await (await registry.connect(owner).submitDocument(item.hash, item.docType, propertyRef, "")).wait();
      document = await registry.verifyDocument(item.hash);
    }
    if (document.propertyRef !== propertyRef || document.submitter !== owner.address) {
      throw new Error(`Documento ${item.file} nao pertence ao seed. Reinicie o no e faca novo deploy.`);
    }
    if (document.status === 1n && item.status === 3) {
      await (await registry.connect(validator).rejectDocument(item.hash, 1)).wait();
    } else if (document.status === 1n && item.status >= 2) {
      await (await registry.connect(validator).validateDocument(item.hash)).wait();
    }
    document = await registry.verifyDocument(item.hash);
    if (item.status === 4 && document.status === 2n) {
      await (await registry.connect(validator).revokeDocument(item.hash, 4)).wait();
    }
    if ((await registry.verifyDocument(item.hash)).status !== BigInt(item.status)) {
      throw new Error(`Estado de ${item.file} diverge do seed. Reinicie o no e faca novo deploy.`);
    }
  }
  let history = await registry.getHolderHistory(propertyRef);
  const expected = [deployment.accounts.owner, deployment.accounts.buyer];
  for (let i = 0; i < expected.length; i++) {
    if (i < history.length) {
      if (history[i].holder !== expected[i] || history[i].basisDocHash !== files[i].hash) {
        throw new Error("Historico alterado manualmente. Reinicie o no e faca novo deploy para restaurar o seed.");
      }
    } else {
      await (await registry.connect(validator).attestHolder(propertyRef, expected[i], files[i].hash)).wait();
    }
  }
  history = await registry.getHolderHistory(propertyRef);
  if (history.length !== 2) throw new Error("Historico tem atestacoes adicionais; o seed nao as remove.");
  await writeJson(path.join(root, "deployments/seed-local.json"), {
    address: deployment.address, propertyRef, documents: files,
    latestAttestedHolder: await registry.latestAttestedHolder(propertyRef),
  });
  console.log(`Seed pronto: ${files.length} documentos e 2 atestacoes. propertyRef: ${propertyRef}`);
  console.log("Reexecutar o seed preserva os mesmos registros, sem duplicar o historico.");
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
