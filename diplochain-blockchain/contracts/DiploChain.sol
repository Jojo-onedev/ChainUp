// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DiploChain {

    struct Diplome {
        string uuid;
        string nomDiplome;
        string etablissement;
        string specialite;
        uint256 annee;
        string hashDiplome;
        uint256 dateEmission;
        bool estValide;
        bool existe;
    }

    address public proprietaire;
    mapping(string => Diplome) private diplomes;
    mapping(address => bool) public etablissementsAccredites;
    mapping(address => string) public nomsEtablissements;

    event DiplomeEmis(string uuid, string nomDiplome, string etablissement, uint256 annee, uint256 dateEmission);
    event DiplomeRevoque(string uuid, uint256 date);
    event EtablissementAccredite(address adresse, string nom);

    modifier seulementProprietaire() {
        require(msg.sender == proprietaire, "Non autorise");
        _;
    }

    modifier seulementAccredite() {
        require(etablissementsAccredites[msg.sender], "Etablissement non accredite");
        _;
    }

    constructor() {
        proprietaire = msg.sender;
    }

    function accrediterEtablissement(address adresseEtablissement, string memory nomEtablissement) public seulementProprietaire {
        etablissementsAccredites[adresseEtablissement] = true;
        nomsEtablissements[adresseEtablissement] = nomEtablissement;
        emit EtablissementAccredite(adresseEtablissement, nomEtablissement);
    }

    function emettrediplome(string memory uuid, string memory nomDiplome, string memory specialite, uint256 annee, string memory hashDiplome) public seulementAccredite {
        require(!diplomes[uuid].existe, "Diplome deja enregistre");
        string memory nomEtab = nomsEtablissements[msg.sender];
        diplomes[uuid] = Diplome(uuid, nomDiplome, nomEtab, specialite, annee, hashDiplome, block.timestamp, true, true);
        emit DiplomeEmis(uuid, nomDiplome, nomEtab, annee, block.timestamp);
    }

    function verifierDiplome(string memory uuid) public view returns (bool existe, bool estValide, string memory nomDiplome, string memory etablissement, string memory specialite, uint256 annee, string memory hashDiplome, uint256 dateEmission) {
        Diplome memory d = diplomes[uuid];
        return (d.existe, d.estValide, d.nomDiplome, d.etablissement, d.specialite, d.annee, d.hashDiplome, d.dateEmission);
    }

    function revoquerDiplome(string memory uuid) public seulementAccredite {
        require(diplomes[uuid].existe, "Diplome inexistant");
        require(diplomes[uuid].estValide, "Deja revoque");
        diplomes[uuid].estValide = false;
        emit DiplomeRevoque(uuid, block.timestamp);
    }

    function estAccredite(address adresse) public view returns (bool, string memory) {
        return (etablissementsAccredites[adresse], nomsEtablissements[adresse]);
    }
}