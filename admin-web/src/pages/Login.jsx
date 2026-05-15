import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UNIVERSITIES = [
  { id: 'UNIV-OUAGA', name: 'Université Joseph Ki-Zerbo', location: 'Ouagadougou', icon: 'school' },
  { id: 'UNIV-BOBO', name: 'Université Nazi Boni', location: 'Bobo-Dioulasso', icon: 'account_balance' },
  { id: 'UNIV-KOUD', name: 'Université Norbert Zongo', location: 'Koudougou', icon: 'history_edu' },
  { id: 'IAM-OUAGA', name: 'Institut Africain de Management', location: 'Ouaga 2000', icon: 'business' },
  { id: 'ISGE-BF', name: 'ISGE-BF', location: 'Ouagadougou', icon: 'bolt' },
];

export default function Login() {
  const [universities, setUniversities] = useState([]);
  const [selectedUniv, setSelectedUniv] = useState(null);
  const [password, setPassword] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Charger les universités dynamiques
  useEffect(() => {
    const saved = localStorage.getItem('diplo_universities');
    if (saved) {
      setUniversities(JSON.parse(saved));
    } else {
      // Liste par défaut si vide
      const defaults = [
        { id: 'UNIV-OUAGA', name: 'Université Joseph Ki-Zerbo', location: 'Ouagadougou', icon: 'school', password: 'admin' },
        { id: 'UNIV-BOBO', name: 'Université Nazi Boni', location: 'Bobo-Dioulasso', icon: 'account_balance', password: 'admin' },
      ];
      setUniversities(defaults);
      localStorage.setItem('diplo_universities', JSON.stringify(defaults));
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!selectedUniv) {
      alert("Veuillez sélectionner un établissement");
      return;
    }
    
    // Vérification du mot de passe (si défini dans la "base de données")
    if (selectedUniv.password && password !== selectedUniv.password) {
      alert("Mot de passe incorrect pour cette institution.");
      return;
    }
    
    // Sauvegarder l'université en session
    localStorage.setItem('connected_univ', JSON.stringify(selectedUniv));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0e1a] px-4">
      
      {/* Ornements de fond */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="bg-white/5 backdrop-blur-2xl p-8 md:p-12 rounded-[40px] w-full max-w-[500px] relative z-10 border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20 border border-white/20">
            <span className="material-symbols-outlined text-white text-4xl">verified_user</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Accès Institutionnel</h1>
          <p className="text-slate-400 text-sm font-medium">Portail de certification DiploChain</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* SÉLECTEUR PERSONNALISÉ */}
          <div className="relative">
            <label className="block text-xs font-black text-blue-500 uppercase tracking-widest mb-3 ml-1">Établissement</label>
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-blue-400">
                  {selectedUniv ? selectedUniv.icon : 'account_balance'}
                </span>
                <span className={selectedUniv ? 'text-white font-bold' : 'text-slate-500 font-medium'}>
                  {selectedUniv ? selectedUniv.name : 'Choisir votre université...'}
                </span>
              </div>
              <span className={`material-symbols-outlined transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </div>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-[#151b2d] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[300px] overflow-y-auto">
                {universities.map((univ) => (
                  <div 
                    key={univ.id}
                    onClick={() => {
                      setSelectedUniv(univ);
                      setIsDropdownOpen(false);
                    }}
                    className="p-4 flex items-center gap-4 hover:bg-blue-600/20 cursor-pointer border-b border-white/5 last:border-0 transition-colors"
                  >
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-blue-400 text-xl">{univ.icon}</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{univ.name}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">{univ.location}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-black text-blue-500 uppercase tracking-widest mb-3 ml-1">Clé d'Accès</label>
            <div className="relative">
              <input 
                type="password" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-bold tracking-widest"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">lock</span>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-2xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3 mt-8 active:scale-95"
          >
            Se Connecter
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </form>

        <div className="mt-10 text-center">
          <button 
            onClick={() => navigate('/')} 
            className="text-slate-500 text-xs font-black uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <span className="material-symbols-outlined text-sm">west</span>
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}
