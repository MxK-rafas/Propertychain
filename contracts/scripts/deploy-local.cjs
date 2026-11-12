const hre = require("hardhat");
const { deploymentPath, requireLocal, writeJson, exportFrontend } = require("./local.cjs");

async function main() {
  await requireLocal(hre);
  const [admin, validator, owner, buyer] = await hre.ethers.getSigners();
  const registry = await hre.ethers.deployContract("DocumentRegistry", [admin.address]);
  const receipt = await registry.deploymentTransaction().wait();
  await (await registry.grantRole(await registry.VALIDATOR_ROLE(), validator.address)).wait();
  const deployment = {
    chainId: 31337,
    address: await registry.getAddress(),
    deploymentBlock: receipt.blockNumber,
    deploymentBlockHash: receipt.blockHash,
    accounts: { admin: admin.address, validator: validator.address, owner: owner.address, buyer: buyer.address },
  };
  await writeJson(deploymentPath, deployment);
  await exportFrontend(hre, deployment);
  console.log(`DocumentRegistry local: ${deployment.address}; validador: ${validator.address}`);
  console.log("ABI e configuracao local exportadas para frontend/. Dados exclusivos de demonstracao.");
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
