const hre = require("hardhat");

async function main() {
  console.log("Déploiement de DiploChain en cours...");

  const DiploChain = await hre.ethers.getContractFactory("DiploChain");
  const contrat = await DiploChain.deploy();

  await contrat.waitForDeployment();

  const adresse = await contrat.getAddress();

  console.log("✅ DiploChain déployé à l'adresse :", adresse);
  console.log("Copie cette adresse pour Jonathan !");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});