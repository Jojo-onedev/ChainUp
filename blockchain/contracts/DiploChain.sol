// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DiploChain {
    address public owner;

    struct Diploma {
        string studentName;
        string degreeType;
        uint256 graduationYear;
        uint256 issueDate;
        bool isValid;
    }

    mapping(bytes32 => Diploma) public diplomas;

    event DiplomaIssued(bytes32 indexed diplomaHash, string studentName, string degreeType);
    event DiplomaRevoked(bytes32 indexed diplomaHash);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the university admin can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Enregistre un nouveau diplome sur la blockchain.
     * @param _hash Le hash unique (SHA-256) genere par le frontend.
     * @param _name Nom complet de l'etudiant.
     * @param _degree Type de diplome (Licence, Master, etc.).
     * @param _year Annee d'obtention.
     */
    function issueDiploma(
        bytes32 _hash,
        string memory _name,
        string memory _degree,
        uint256 _year
    ) public onlyOwner {
        require(!diplomas[_hash].isValid, "This diploma hash is already registered");

        diplomas[_hash] = Diploma({
            studentName: _name,
            degreeType: _degree,
            graduationYear: _year,
            issueDate: block.timestamp,
            isValid: true
        });

        emit DiplomaIssued(_hash, _name, _degree);
    }

    /**
     * @dev Verifie l'authenticite d'un diplome.
     * @param _hash Le hash du diplome a verifier.
     */
    function verifyDiploma(bytes32 _hash) public view returns (
        string memory name,
        string memory degree,
        uint256 year,
        uint256 date,
        bool valid
    ) {
        Diploma memory d = diplomas[_hash];
        require(d.isValid, "Diploma not found or invalid");
        
        return (d.studentName, d.degreeType, d.graduationYear, d.issueDate, d.isValid);
    }

    /**
     * @dev Permet de transferer la propriete de l'administration.
     */
    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "New owner cannot be the zero address");
        owner = _newOwner;
    }
}
