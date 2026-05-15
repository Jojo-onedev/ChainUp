// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DiploChain {
    address public owner;

    struct Diploma {
        string studentID;    // Nouveau : Matricule de l'etudiant
        string studentName;
        string degreeType;
        uint256 graduationYear;
        uint256 issueDate;
        bool isValid;
    }

    // Recherche par Hash (Verification publique)
    mapping(bytes32 => Diploma) public diplomas;
    
    // Recherche par Matricule (Espace Diplome)
    mapping(string => bytes32[]) private studentDiplomas;

    event DiplomaIssued(bytes32 indexed diplomaHash, string studentID, string studentName, string degreeType);
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
     */
    function issueDiploma(
        bytes32 _hash,
        string memory _studentID,
        string memory _name,
        string memory _degree,
        uint256 _year
    ) public onlyOwner {
        require(!diplomas[_hash].isValid, "This diploma hash is already registered");

        diplomas[_hash] = Diploma({
            studentID: _studentID,
            studentName: _name,
            degreeType: _degree,
            graduationYear: _year,
            issueDate: block.timestamp,
            isValid: true
        });

        // Lier le diplome au matricule pour l'espace diplome
        studentDiplomas[_studentID].push(_hash);

        emit DiplomaIssued(_hash, _studentID, _name, _degree);
    }

    /**
     * @dev Verifie l'authenticite d'un diplome via son hash.
     */
    function verifyDiploma(bytes32 _hash) public view returns (
        string memory studentID,
        string memory name,
        string memory degree,
        uint256 year,
        uint256 date,
        bool valid
    ) {
        Diploma memory d = diplomas[_hash];
        require(d.isValid, "Diploma not found or invalid");
        
        return (d.studentID, d.studentName, d.degreeType, d.graduationYear, d.issueDate, d.isValid);
    }

    /**
     * @dev Recupere tous les hashes de diplomes lies a un matricule.
     * Utile pour l'interface "Espace Diplome".
     */
    function getStudentDiplomas(string memory _studentID) public view returns (bytes32[] memory) {
        return studentDiplomas[_studentID];
    }

    /**
     * @dev Permet de transferer la propriete de l'administration.
     */
    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "New owner cannot be the zero address");
        owner = _newOwner;
    }
}
