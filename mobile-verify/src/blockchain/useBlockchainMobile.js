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
        name: result[0],
        degree: result[1],
        year: Number(result[2]),
        date: new Date(Number(result[3]) * 1000).toLocaleDateString('fr-FR'),
        valid: result[4]
      };
    } catch (err) {
      setError("Diplôme non trouvé ou hash invalide.");
      setLoading(false);
      return null;
    }
  }, []);

  return { loading, error, verifyDiploma };
};
