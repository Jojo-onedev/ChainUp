import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { DIPLO_CHAIN_ADDRESS, DIPLO_CHAIN_ABI } from './contracts';

// RPC Polygon Amoy pour lecture (vérification publique sans Metamask)
const AMOY_RPC = "https://rpc-amoy.polygon.technology";

export const useBlockchainMobile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const verifyDiploma = useCallback(async (hash) => {
    try {
      setLoading(true);
      setError(null);

      const provider = new ethers.JsonRpcProvider(AMOY_RPC);
      const contract = new ethers.Contract(DIPLO_CHAIN_ADDRESS, DIPLO_CHAIN_ABI, provider);

      const formattedHash = hash.startsWith('0x') ? hash : `0x${hash}`;
      const result = await contract.verifyDiploma(formattedHash);

      setLoading(false);
      return {
        studentID: result.studentID || result[0],
        name: result.name || result[1],
        degree: result.degree || result[2],
        year: Number(result.year || result[3]),
        date: new Date(Number(result.date || result[4]) * 1000).toLocaleDateString('fr-FR'),
        valid: result.valid !== undefined ? result.valid : result[5]
      };
    } catch (err) {
      setError("Diplôme non trouvé ou hash invalide.");
      setLoading(false);
      return null;
    }
  }, []);

  return { loading, error, verifyDiploma };
};
