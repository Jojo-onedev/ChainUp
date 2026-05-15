const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DiploChain", function () {

  let contrat;
  let proprietaire;
  let universite;

  beforeEach(async function () {
    [proprietaire, universite] = await ethers.getSigners();
    const DiploChain = await ethers.getContractFactory("DiploChain");
    contrat = await DiploChain.deploy();
  });

  it("Doit accrediter un etablissement", async function () {
    await contrat.accrediterEtablissement(
      universite.address,
      "Universite de Ouagadougou"
    );
    const estAccredite = await contrat.etablissementsAccredites(universite.address);
    expect(estAccredite).to.equal(true);
    console.log("Universite accreditee !");
  });

  it("Doit emettre un diplome", async function () {
    await contrat.accrediterEtablissement(
      universite.address,
      "Universite de Ouagadougou"
    );
    await contrat.connect(universite).emettrediplome(
      "DC-2024-UO-00247",
      "Master en Informatique",
      "Genie Logiciel",
      2024,
      "4f2a9b1c3d5e6f7a8b9c"
    );
    const result = await contrat.verifierDiplome("DC-2024-UO-00247");
    expect(result.existe).to.equal(true);
    expect(result.estValide).to.equal(true);
    console.log("Diplome emis et verifie !");
  });

  it("Doit rejeter un faux diplome", async function () {
    const result = await contrat.verifierDiplome("FAUX-CODE-999");
    expect(result.existe).to.equal(false);
    console.log("Faux diplome rejete !");
  });

  it("Doit revoquer un diplome", async function () {
    await contrat.accrediterEtablissement(
      universite.address,
      "Universite de Ouagadougou"
    );
    await contrat.connect(universite).emettrediplome(
      "DC-2024-UO-00248",
      "Licence en Droit",
      "Droit Public",
      2024,
      "7c1d4e2f8a3b9c5d"
    );
    await contrat.connect(universite).revoquerDiplome("DC-2024-UO-00248");
    const result = await contrat.verifierDiplome("DC-2024-UO-00248");
    expect(result.estValide).to.equal(false);
    console.log("Diplome revoque !");
  });
});