import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [university, setUniversity] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!university) {
      alert("Veuillez sélectionner une université");
      return;
    }
    // Simulation de connexion
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0e1a] px-4 font-body-md">
      
      {/* Background Ornaments (Fintech / Blockchain vibe) */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="glass-panel p-10 md:p-14 rounded-3xl w-full max-w-[480px] relative z-10 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 w-1/2 -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
            <span className="material-symbols-outlined text-white text-4xl">account_balance</span>
          </div>
          <h1 className="text-3xl font-headline-xl font-extrabold text-white mb-3 tracking-tight">Espace Établissement</h1>
          <p className="text-slate-400 text-sm font-medium">Authentification sécurisée au réseau DiploChain</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Université / Établissement</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 text-xl">school</span>
              </div>
              <select 
                required
                className="w-full bg-[#05070A]/80 border border-white/10 rounded-xl pl-12 pr-10 py-4 text-white appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-sm cursor-pointer hover:bg-[#0a0e1a]"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
              >
                <option value="" disabled className="text-slate-500">Sélectionnez votre établissement...</option>
                <option value="UNIV-OUAGA" className="bg-[#0a0e1a] text-white py-2">Université Joseph Ki-Zerbo (Ouagadougou)</option>
                <option value="UNIV-BOBO" className="bg-[#0a0e1a] text-white py-2">Université Nazi Boni (Bobo-Dioulasso)</option>
                <option value="UNIV-KOUD" className="bg-[#0a0e1a] text-white py-2">Université Norbert Zongo (Koudougou)</option>
                <option value="IAM-OUAGA" className="bg-[#0a0e1a] text-white py-2">Institut Africain de Management (IAM)</option>
                <option value="ISGE-BF" className="bg-[#0a0e1a] text-white py-2">ISGE-BF</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-500 text-xl">expand_more</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Clé cryptographique (Mot de passe)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 text-xl">key</span>
              </div>
              <input 
                type="password" 
                required
                className="w-full bg-[#05070A]/80 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-sm hover:bg-[#0a0e1a]"
                placeholder="••••••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm mt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input type="checkbox" className="peer sr-only" />
                <div className="w-5 h-5 bg-white/5 border border-white/20 rounded peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all flex items-center justify-center">
                  <span className="material-symbols-outlined text-[14px] text-white opacity-0 peer-checked:opacity-100 transition-opacity">check</span>
                </div>
              </div>
              <span className="text-slate-400 group-hover:text-white transition-colors">Se souvenir de moi</span>
            </label>
            <a href="#" className="text-blue-500 hover:text-blue-400 font-semibold transition-colors">Clé perdue ?</a>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/25 active:scale-95 transition-all flex items-center justify-center gap-3 mt-6 text-base border border-blue-400/20"
          >
            <span className="material-symbols-outlined">login</span>
            Accéder au portail
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/10 text-center flex flex-col gap-4">
          <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 font-mono bg-emerald-500/10 py-3 px-4 rounded-xl border border-emerald-500/20">
            <span className="material-symbols-outlined text-[16px]">shield_lock</span>
            Authentification chiffrée de bout en bout
          </div>
          <button 
            onClick={() => navigate('/')} 
            className="text-slate-500 text-sm hover:text-white transition-colors font-medium flex items-center justify-center gap-1 mx-auto"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Retour à la présentation
          </button>
        </div>
      </div>
    </div>
  );
}
