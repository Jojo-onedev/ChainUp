import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Building2, Trash2, Lock, Key, Copy, Check, ShieldAlert } from 'lucide-react';

const INITIAL_UNIVS = [
  { id: 'UNIV-OUAGA', name: 'Université Joseph Ki-Zerbo', location: 'Ouagadougou', status: 'Actif', wallet: '0x123...abc', password: 'admin' },
  { id: 'UNIV-BOBO', name: 'Université Nazi Boni', location: 'Bobo-Dioulasso', status: 'Actif', wallet: '0x456...def', password: 'admin' },
];

export default function MinisterPortal() {
  const [isLocked, setIsLocked] = useState(true);
  const [masterPassInput, setMasterPassInput] = useState('');
  const [masterPassword, setMasterPassword] = useState('burkina2026'); // Mot de passe par défaut
  
  const [univs, setUnivs] = useState([]);
  const [activeTab, setActiveTab] = useState('accréditations');
  const [showAdd, setShowAdd] = useState(false);
  
  // Champs formulaire
  const [newName, setNewName] = useState('');
  const [newWallet, setNewWallet] = useState('');
  const [newPass, setNewPass] = useState('');
  const [copied, setCopied] = useState(false);

  // Pour le changement de mot de passe Maitre
  const [showChangeMaster, setShowChangeMaster] = useState(false);
  const [newMasterPassInput, setNewMasterPassInput] = useState('');

  // Charger depuis LocalStorage au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('diplo_universities');
    const savedMaster = localStorage.getItem('diplo_master_pass');
    
    if (saved) setUnivs(JSON.parse(saved));
    else {
      setUnivs(INITIAL_UNIVS);
      localStorage.setItem('diplo_universities', JSON.stringify(INITIAL_UNIVS));
    }

    if (savedMaster) setMasterPassword(savedMaster);
    else localStorage.setItem('diplo_master_pass', 'burkina2026');
  }, []);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (masterPassInput === masterPassword) {
      setIsLocked(false);
    } else {
      alert("Accès refusé : Clé de souveraineté invalide.");
    }
  };

  const handleUpdateMasterPass = () => {
    if (newMasterPassInput.length < 8) return alert("Le mot de passe doit faire au moins 8 caractères.");
    setMasterPassword(newMasterPassInput);
    localStorage.setItem('diplo_master_pass', newMasterPassInput);
    setShowChangeMaster(false);
    setNewMasterPassInput('');
    alert("Mot de passe maître mis à jour avec succès !");
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPass(pass);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(newPass);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddUniv = () => {
    if (!newName || !newWallet || !newPass) return alert("Remplissez tous les champs");
    
    const newEntry = {
      id: `UNIV-${Date.now()}`,
      name: newName,
      location: 'Burkina Faso',
      status: 'Actif',
      wallet: newWallet,
      password: newPass
    };

    const updated = [...univs, newEntry];
    setUnivs(updated);
    localStorage.setItem('diplo_universities', JSON.stringify(updated));
    setShowAdd(false);
    setNewName(''); setNewWallet(''); setNewPass('');
    alert("Université enrôlée avec succès !");
  };

  const deleteUniv = (id) => {
    if (window.confirm("Voulez-vous révoquer l'accès ?")) {
      const updated = univs.filter(u => u.id !== id);
      setUnivs(updated);
      localStorage.setItem('diplo_universities', JSON.stringify(updated));
    }
  };

  if (isLocked) {
    return (
      <div className="min-h-screen bg-[#004d25] flex items-center justify-center p-6 font-sans relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
        <div className="absolute top-2 left-0 w-full h-2 bg-yellow-400"></div>
        <div className="absolute top-4 left-0 w-full h-2 bg-emerald-600"></div>

        <div className="bg-white rounded-[40px] p-10 w-full max-w-md shadow-2xl text-center relative z-10 border-t-8 border-[#006a32]">
           <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Coat_of_arms_of_Burkina_Faso.svg/1200px-Coat_of_arms_of_Burkina_Faso.svg.png" className="h-24 mx-auto mb-6" alt="Armoiries" />
           <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Accès Souverain</h1>
           <p className="text-slate-500 text-sm font-medium mb-8">Identification requise pour le personnel ministériel autorisé.</p>
           
           <form onSubmit={handleUnlock} className="space-y-4">
              <div className="relative">
                <input 
                  type="password" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 font-bold focus:border-emerald-500 outline-none transition-all pr-12"
                  placeholder="Clé de Souveraineté"
                  value={masterPassInput}
                  onChange={(e) => setMasterPassInput(e.target.value)}
                />
                <Lock size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
              </div>
              <button className="w-full bg-[#006a32] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-emerald-900/20 active:scale-95 transition-all">
                Deverrouiller le Portail
              </button>
           </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      <nav className="bg-[#006a32] text-white p-4 shadow-lg flex justify-between items-center px-10 border-b-4 border-yellow-400">
        <div className="flex items-center gap-2">
          <div className="rounded-full shadow-inner">
            <img src="./burkinaflag.png" alt="République du Burkina Faso" className="h-20 w-20 object-contain" />
          </div>
          <div>
            <h1 className="text-white text-xl font-black leading-tight uppercase tracking-tighter">Ministère de l'Enseignement Supérieur</h1>
            <p className="text-[10px] uppercase font-black text-yellow-400 tracking-widest">République du Burkina Faso - Portail de Souveraineté</p>
          </div>
        </div>
        <div className="flex gap-4">
            <div className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'accréditations' ? 'bg-white text-emerald-800' : 'hover:bg-white/10'}`} onClick={() => setActiveTab('accréditations')}>
                Accréditations
            </div>
            <div className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'sécurité' ? 'bg-white text-emerald-800' : 'hover:bg-white/10'}`} onClick={() => setActiveTab('sécurité')}>
                Sécurité & Logs
            </div>
        </div>
      </nav>

      <div className="p-10 max-w-6xl mx-auto">
        {activeTab === 'accréditations' ? (
          <>
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Registre des Institutions</h2>
                <p className="text-slate-500 font-medium">Contrôle centralisé du réseau DiploChain</p>
              </div>
              <button 
                onClick={() => setShowAdd(true)}
                className="bg-[#006a32] text-white px-8 py-4 rounded-[20px] font-black flex items-center gap-3 hover:bg-emerald-600 transition-all shadow-2xl shadow-emerald-900/20 active:scale-95"
              >
                <Plus size={24} /> Enrôler une Institution
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {univs.map((univ) => (
                <div key={univ.id} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex items-center justify-between group hover:border-emerald-500 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                      <Building2 size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">{univ.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{univ.location}</span>
                        <code className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-mono">Wallet: {univ.wallet}</code>
                        <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                          <ShieldCheck size={12} /> {univ.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button onClick={() => deleteUniv(univ.id)} className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
                      <Trash2 size={20} />
                    </button>
                    <button className="bg-slate-50 text-slate-700 px-6 py-3 rounded-2xl font-black text-xs hover:bg-slate-100 transition-all uppercase tracking-widest">
                      Audit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-[40px] p-12 border border-slate-200 shadow-sm text-center max-w-2xl mx-auto">
             <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <ShieldAlert size={40} />
             </div>
             <h2 className="text-2xl font-black text-slate-900 mb-4">Paramètres de Sécurité Maître</h2>
             <p className="text-slate-500 mb-8 font-medium">Ici, vous pouvez changer la clé de souveraineté qui protège l'accès au registre national.</p>
             <div className="space-y-4">
                <div className="bg-slate-50 p-6 rounded-3xl text-left border border-slate-100">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Clé Root Actuelle (Hachée)</label>
                    <code className="text-sm font-mono break-all text-emerald-600 font-bold">●●●●●●●●●●●●●●●●●●●●</code>
                </div>
                <button 
                  onClick={() => setShowChangeMaster(true)}
                  className="w-full bg-[#006a32] text-white py-4 rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-emerald-900/10"
                >
                  Changer le Mot de Passe Maître
                </button>
             </div>
          </div>
        )}

        {showChangeMaster && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in zoom-in-95 duration-300">
            <div className="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl border-t-8 border-rose-500">
              <h3 className="text-2xl font-black text-slate-900 mb-2">Sécurité Maître</h3>
              <p className="text-slate-500 mb-8 text-sm">Définissez une nouvelle clé de souveraineté pour l'accès au portail national.</p>
              
              <div className="space-y-4">
                <input 
                  type="password"
                  value={newMasterPassInput}
                  onChange={(e) => setNewMasterPassInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold outline-none focus:border-rose-500 transition-all"
                  placeholder="Nouveau mot de passe maître"
                />
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button onClick={() => setShowChangeMaster(false)} className="py-4 font-black text-slate-400">Annuler</button>
                  <button 
                    onClick={handleUpdateMasterPass}
                    className="bg-rose-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-rose-500/20 active:scale-95 transition-all"
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAdd && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-[50px] w-full max-w-xl p-12 shadow-2xl relative">
              <h3 className="text-3xl font-black text-slate-900 mb-2">Enrôler une Institution</h3>
              <p className="text-slate-500 mb-8 font-medium">L'institution sera ajoutée à la blockchain Amoy.</p>
              
              <div className="space-y-6">
                <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Nom Officiel</label>
                    <input 
                      value={newName} onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold focus:border-emerald-500 transition-all outline-none" 
                      placeholder="Ex: Université de Bobo" 
                    />
                </div>

                <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Adresse Wallet (Polygon Amoy)</label>
                    <input 
                      value={newWallet} onChange={(e) => setNewWallet(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-sm focus:border-emerald-500 transition-all outline-none" 
                      placeholder="0x..." 
                    />
                </div>

                <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Clé d'Accès (Générée)</label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <input 
                              value={newPass} readOnly
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono font-bold text-emerald-600 outline-none" 
                              placeholder="Cliquez sur générer" 
                            />
                            <Key size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        </div>
                        <button 
                          onClick={generatePassword}
                          className="bg-slate-100 p-4 rounded-2xl text-slate-600 hover:bg-slate-200 transition-all"
                          title="Générer un mot de passe"
                        >
                            <Plus size={24} />
                        </button>
                        {newPass && (
                            <button 
                                onClick={copyToClipboard}
                                className="bg-emerald-50 p-4 rounded-2xl text-emerald-600 hover:bg-emerald-100 transition-all"
                                title="Copier"
                            >
                                {copied ? <Check size={24} /> : <Copy size={24} />}
                            </button>
                        )}
                    </div>
                </div>

                <div className="pt-6 grid grid-cols-2 gap-4">
                    <button onClick={() => setShowAdd(false)} className="py-4 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all">Annuler</button>
                    <button 
                       onClick={handleAddUniv}
                       className="bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95"
                    >
                      Enrôler Institution
                    </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
