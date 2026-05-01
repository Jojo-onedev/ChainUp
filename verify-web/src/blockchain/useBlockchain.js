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

  // Fonction pour mettre un diplme
  const issueDiploma = async (hash, name, degree, year) => {
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(DIPLO_CHAIN_ADDRESS, DIPLO_CHAIN_ABI, signer);

      // Le hash doit tre au format bytes32 (0x...)
      const formattedHash = hash.startsWith('0x') ? hash : `0x${hash}`;
      
      const tx = await contract.issueDiploma(formattedHash, name, degree, year);
      await tx.wait(); // Attendre la confirmation de la blockchain
      
      setLoading(false);
      return true;
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'mission du diplme.");
      setLoading(false);
      return false;
    }
  };

  // Fonction pour vrifier un diplme (Public)
  const verifyDiploma = async (hash) => {
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(DIPLO_CHAIN_ADDRESS, DIPLO_CHAIN_ABI, provider);

      const formattedHash = hash.startsWith('0x') ? hash : `0x${hash}`;
      
      const result = await contract.verifyDiploma(formattedHash);
      setLoading(false);
      return {
        name: result[0],
        degree: result[1],
        year: Number(result[2]),
        date: new Date(Number(result[3]) * 1000).toLocaleDateString(),
        valid: result[4]
      };
    } catch (err) {
      console.error(err);
      setError("Diplme non trouv ou hash invalide.");
      setLoading(false);
      return null;
    }
  };

  return {
    account,
    loading,
    error,
    connectWallet,
    issueDiploma,
    verifyDiploma
  };
};
