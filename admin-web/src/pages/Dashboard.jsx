import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import CryptoJS from 'crypto-js';
import { useBlockchain } from '../blockchain/useBlockchain';

export default function Dashboard() {
  const { account, connectWallet, issueDiploma: blockchainIssue, loading: bcLoading } = useBlockchain();
  const [isEmitting, setIsEmitting] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [degreeType, setDegreeType] = useState('Licence Professionnelle');
  const [emissionStep, setEmissionStep] = useState(0);
  const [generatedData, setGeneratedData] = useState(null);

  const containerRef = useRef(null);

  useGSAP(() => {
    // Top bar animation
    gsap.from('.dash-header', {
      y: -20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    });

    // Stats cards staggered animation
    gsap.from('.stat-card', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      delay: 0.2
    });

    // Main panels animation
    gsap.from('.main-panel', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
      delay: 0.4
    });
  }, { scope: containerRef });


  // ── SIMULATION D'ÉMISSION (démo sans Metamask) ──
  const handleEmit = async (e) => {
    e.preventDefault();
    if (!studentName || !graduationYear) return alert("Veuillez remplir tous les champs");

    setIsEmitting(true);

    // Étape 1 : Génération du hash
    setEmissionStep(1);
    const rawData = `${studentName}-${graduationYear}-${degreeType}-UnivOuaga-${Date.now()}`;
    const hashArray = Array.from(rawData).map(c => c.charCodeAt(0).toString(16)).join('');
    const finalHash = `0x${hashArray.substring(0, 64).padEnd(64, '0')}`;

    await new Promise(r => setTimeout(r, 1800)); // Animation hash

    // Étape 2 : Signature & envoi Blockchain (simulation)
    setEmissionStep(2);
    await new Promise(r => setTimeout(r, 2500)); // Animation blockchain

    // Étape 3 : Confirmation & QR Code
    setGeneratedData({
      id: `DIP-${graduationYear}-${Math.floor(Math.random() * 90000) + 10000}`,
      hash: finalHash,
      name: studentName,
      type: degreeType
    });
    setEmissionStep(3);
  };

  const closeEmissionModal = () => {
    setIsEmitting(false);
    setEmissionStep(0);
    setGeneratedData(null);
    setStudentName('');
    setGraduationYear('');
  };

  return (
    <div ref={containerRef} className="flex-1 flex flex-col h-full w-full">
      {/* --- MODAL D'MISSION (SIMULATION BLOCKCHAIN) --- */}
      {isEmitting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center">
              {emissionStep === 1 && (
                <div className="py-10">
                  <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <span className="material-symbols-outlined text-4xl">fingerprint</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">Génération du Hash</h3>
                  <p className="text-slate-500">Calcul de l'empreinte numérique unique...</p>
                </div>
              )}

              {emissionStep === 2 && (
                <div className="py-10">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">Enregistrement Blockchain</h3>
                  <p className="text-slate-500 text-sm">Diffusion de la transaction sur le réseau Polygon Amoy...</p>
                  <div className="mt-6 space-y-2 text-left bg-slate-50 rounded-2xl p-4">
                    <p className="text-xs font-mono text-emerald-600">✓ Connexion aux nœuds Polygon...</p>
                    <p className="text-xs font-mono text-emerald-600">✓ Signature cryptographique validée...</p>
                    <p className="text-xs font-mono text-slate-400 animate-pulse">⟳ En attente de confirmation du bloc...</p>
                  </div>
                </div>
              )}

              {emissionStep === 3 && generatedData && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <span className="material-symbols-outlined text-5xl">verified</span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 mb-2">Succès !</h3>
                  <p className="text-slate-500 mb-8">Le diplôme a été certifié sur la blockchain.</p>
                  
                  <div className="bg-slate-50 rounded-3xl p-6 mb-8 border border-slate-100 text-left">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ID Certificat</span>
                      <span className="text-sm font-mono font-bold text-blue-600">{generatedData.id}</span>
                    </div>
                    <div className="flex flex-col gap-1 mb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hash Blockchain</span>
                      <span className="text-xs font-mono bg-white p-2 rounded-lg border border-slate-200 break-all">{generatedData.hash}</span>
                    </div>
                    <div className="flex justify-center">
                      <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <QRCodeSVG value={generatedData.hash} size={120} />
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={closeEmissionModal}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-slate-900/20"
                  >
                    Fermer le portail
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TOP BAR */}
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-8 flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-slate-800">Espace d'Émission</h2>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-emerald-700">Polygon Network : Opérationnel</span>
          </div>
          
          <button 
            onClick={connectWallet}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              account 
                ? 'bg-slate-100 text-slate-700 border border-slate-200' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md active:scale-95'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            {account ? `${account.substring(0, 6)}...${account.substring(38)}` : "Connect Wallet"}
          </button>

          <div className="w-px h-8 bg-slate-200"></div>
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="text-right hidden md:block">
              <div className="text-sm font-bold text-slate-800">Admin Scolarité</div>
              <div className="text-xs text-slate-500">Ouagadougou</div>
            </div>
            <img alt="Profile" src="https://ui-avatars.com/api/?name=Admin+Scolarite&background=0f172a&color=fff" className="w-10 h-10 rounded-full border-2 border-slate-200" />
          </div>
        </div>
      </header>

      <div className="p-8 max-w-7xl mx-auto space-y-8 w-full">
        
        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">school</span>
            </div>
            <div>
              <div className="text-sm text-slate-500 font-bold mb-1">Diplômes Émis</div>
              <div className="text-3xl font-black text-slate-800">1,248</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>
            <div>
              <div className="text-sm text-slate-500 font-bold mb-1">Authentifiés</div>
              <div className="text-3xl font-black text-slate-800">892</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">token</span>
            </div>
            <div>
              <div className="text-sm text-slate-500 font-bold mb-1">Frais Réseau (MATIC)</div>
              <div className="text-3xl font-black text-slate-800">0.045</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* FORMULAIRE D'ÉMISSION (Takes up 2 columns on large screens) */}
          <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xl font-extrabold text-slate-800 mb-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">add_card</span>
                Nouvelle Certification
              </h3>
              <p className="text-sm text-slate-500">Saisissez les informations de l'étudiant pour générer un diplôme infalsifiable.</p>
            </div>
            
            <form onSubmit={handleEmit} className="p-8 flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nom & Prénoms</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Ex: Compaoré Alice" 
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Année d'obtention</label>
                    <input 
                      required
                      type="number" 
                      min="2000"
                      max="2030"
                      placeholder="2024" 
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Type de diplôme</label>
                  <div className="relative">
                    <select 
                      value={degreeType}
                      onChange={(e) => setDegreeType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium cursor-pointer"
                    >
                      <option>Licence Professionnelle</option>
                      <option>Master M1</option>
                      <option>Master M2</option>
                      <option>Doctorat</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                  Signature cryptographique
                </div>
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-500/30 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                  Générer et Inscrire
                </button>
              </div>
            </form>
          </div>

          {/* RECENT RECORDS */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-lg font-extrabold text-slate-800">Derniers Ajouts</h3>
              <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors">
                <span className="material-symbols-outlined">refresh</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              {[
                { name: "Traoré Kévin", date: "Il y a 5 min", hash: "0x8F2...4C1", valid: true },
                { name: "Ouédraogo Aminata", date: "Il y a 22 min", hash: "0x1A9...9B2", valid: true },
                { name: "Zongo Fabrice", date: "Il y a 1h", hash: "0x3C4...7D5", valid: true },
                { name: "Kaboré Léa", date: "Aujourd'hui", hash: "0x9E2...1F6", valid: true },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border-b border-transparent hover:border-slate-100 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      <span className="material-symbols-outlined text-[20px]">person</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{item.name}</div>
                      <div className="text-xs text-slate-400">{item.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-md mb-1 border border-emerald-100">
                      <span className="material-symbols-outlined text-[10px]">check_circle</span> Validé
                    </div>
                    <div className="text-xs font-mono text-slate-400">{item.hash}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100 text-center">
              <Link to="/admin/certifications" className="text-sm font-bold text-blue-600 hover:text-blue-700">Voir le registre complet →</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
