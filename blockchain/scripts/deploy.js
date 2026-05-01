const hre = require("hardhat");

async function main() {
  console.log("Dbut du dploiement du contrat DiploChain...");

  // Rcupration du contrat
  const DiploChain = await hre.ethers.getContractFactory("DiploChain");
  
  // Dploiement
  const diploChain = await DiploChain.deploy();

  await diploChain.waitForDeployment();

  const address = await diploChain.getAddress();

  console.log("-----------------------------------------------");
  console.log(`Contrat DiploChain dploy avec succs !`);
  console.log(`Adresse du contrat : ${address}`);
  console.log("-----------------------------------------------");
  console.log("Gardez cette adresse prcieusement, nous en aurons besoin pour le frontend.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
