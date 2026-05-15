import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { DIPLO_CHAIN_ADDRESS, DIPLO_CHAIN_ABI } from '../blockchain/contracts';

export default function BlockchainTester() {
  const [status, setStatus] = useState({
    metamask: 'Checking...',
    network: 'Checking...',
    contract: 'Checking...',
    owner: 'Checking...'
  });

  const runDiagnostics = async () => {
    const newStatus = { ...status };

    // 1. Verifier Metamask
    if (window.ethereum) {
      newStatus.metamask = '✅ Detecté';
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        // 2. Verifier le Réseau
        const network = await provider.getNetwork();
        newStatus.network = `✅ Connecté à ID: ${network.chainId} (Amoy est 80002)`;
        
        // 3. Verifier le Contrat
        const contract = new ethers.Contract(DIPLO_CHAIN_ADDRESS, DIPLO_CHAIN_ABI, provider);
        newStatus.contract = `✅ Trouvé à ${DIPLO_CHAIN_ADDRESS.substring(0, 10)}...`;

        // 4. Tester un appel (Lecture du propriétaire)
        const owner = await contract.owner();
        newStatus.owner = `✅ Réponse reçue! Owner: ${owner.substring(0, 10)}...`;

      } catch (err) {
        console.error(err);
        newStatus.contract = '❌ Erreur de lecture du contrat';
        newStatus.owner = '❌ Impossible de lire le contrat';
      }
    } else {
      newStatus.metamask = '❌ Metamask non trouvé';
    }

    setStatus(newStatus);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <div className="p-10 max-w-2xl mx-auto bg-white rounded-3xl shadow-xl mt-10 border border-slate-200">
      <h1 className="text-2xl font-black mb-8 text-slate-800">Diagnostic DiploChain 🚀</h1>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
          <span className="font-bold text-slate-600">Statut Metamask</span>
          <span className="font-mono text-sm">{status.metamask}</span>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
          <span className="font-bold text-slate-600">Réseau Détecté</span>
          <span className="font-mono text-sm">{status.network}</span>
        </div>

        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
          <span className="font-bold text-slate-600">Connexion Contrat</span>
          <span className="font-mono text-sm text-blue-600">{status.contract}</span>
        </div>

        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
          <span className="font-bold text-slate-600">Réponse Blockchain</span>
          <span className="font-mono text-sm text-emerald-600">{status.owner}</span>
        </div>
      </div>

      <button 
        onClick={runDiagnostics}
        className="w-full mt-10 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 transition-all"
      >
        Relancer le test
      </button>

      <div className="mt-6 text-center">
        <a href="/" className="text-sm font-bold text-slate-400 hover:text-slate-600">Retour à l'accueil</a>
      </div>
    </div>
  );
}
