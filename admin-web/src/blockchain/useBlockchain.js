import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { DIPLO_CHAIN_ADDRESS, DIPLO_CHAIN_ABI } from './contracts';

export const useBlockchain = () => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Connexion au portefeuille Metamask
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError("Veuillez installer Metamask pour continuer.");
      return null;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      setLoading(false);
      return accounts[0];
    } catch (err) {
      setError("Erreur lors de la connexion au portefeuille.");
      setLoading(false);
      return null;
    }
  }, []);

  // Fonction pour émettre un diplôme (Nouveau : prend le studentID)
  const issueDiploma = async (hash, studentID, name, degree, year) => {
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(DIPLO_CHAIN_ADDRESS, DIPLO_CHAIN_ABI, signer);

      const formattedHash = hash.startsWith('0x') ? hash : `0x${hash}`;
      
      const tx = await contract.issueDiploma(formattedHash, studentID, name, degree, year);
      await tx.wait();
      
      setLoading(false);
      return true;
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'émission du diplôme.");
      setLoading(false);
      return false;
    }
  };

  // Fonction pour vérifier un diplôme via son hash
  const verifyDiploma = async (hash) => {
    try {
      setLoading(true);
      // Utilisation d'un provider public pour la vérification (pas besoin de MetaMask)
      const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology");
      const contract = new ethers.Contract(DIPLO_CHAIN_ADDRESS, DIPLO_CHAIN_ABI, provider);

      const formattedHash = hash.startsWith('0x') ? hash : `0x${hash}`;
      
      const result = await contract.verifyDiploma(formattedHash);
      setLoading(false);
      return {
        studentID: result[0],
        name: result[1],
        degree: result[2],
        year: Number(result[3]),
        date: new Date(Number(result[4]) * 1000).toLocaleDateString(),
        valid: result[5]
      };
    } catch (err) {
      console.error(err);
      setError("Diplôme non trouvé ou hash invalide.");
      setLoading(false);
      return null;
    }
  };

  // Nouvelle fonction : Récupérer tous les diplômes d'un étudiant via son matricule
  const getStudentDiplomas = async (studentID) => {
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(DIPLO_CHAIN_ADDRESS, DIPLO_CHAIN_ABI, provider);

      // 1. Récupérer la liste des hashes
      const hashes = await contract.getStudentDiplomas(studentID);
      
      // 2. Récupérer les détails de chaque diplôme en parallèle
      const detailsPromises = hashes.map(h => verifyDiploma(h));
      const details = await Promise.all(detailsPromises);
      
      setLoading(false);
      return details.filter(d => d !== null);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la récupération des diplômes de l'étudiant.");
      setLoading(false);
      return [];
    }
  };

  return {
    account,
    loading,
    error,
    connectWallet,
    issueDiploma,
    verifyDiploma,
    getStudentDiplomas
  };
};
