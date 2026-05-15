import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useBlockchain } from '../blockchain/useBlockchain';

export default function Dashboard() {
  const { account, connectWallet, issueDiploma: blockchainIssue, loading: bcLoading } = useBlockchain();
  const [isEmitting, setIsEmitting] = useState(false);
  const [studentID, setStudentID] = useState(''); // Nouveau : Matricule
  const [studentName, setStudentName] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [degreeType, setDegreeType] = useState('Licence Professionnelle');
  const [emissionStep, setEmissionStep] = useState(0);
  const [generatedData, setGeneratedData] = useState(null);

  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.from('.dash-header', { y: -20, opacity: 0, duration: 0.6, ease: 'power3.out' });
    gsap.from('.stat-card', { y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.2 });
    gsap.from('.main-panel', { y: 40, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out', delay: 0.4 });
  }, { scope: containerRef });

  const handleEmit = async (e) => {
    e.preventDefault();
    if (!studentName || !graduationYear || !studentID) return alert("Veuillez remplir tous les champs");

    setIsEmitting(true);

    // Étape 1 : Génération du hash (simulation visuelle)
    setEmissionStep(1);
    const rawData = `${studentID}-${studentName}-${graduationYear}-${degreeType}-UnivOuaga-${Date.now()}`;
    // Génération d'un faux hash pour la démo si Metamask n'est pas utilisé, 
    // sinon le hook utilisera le vrai hash.
    const hashArray = Array.from(rawData).map(c => c.charCodeAt(0).toString(16)).join('');
    const finalHash = `0x${hashArray.substring(0, 64).padEnd(64, '0')}`;

    await new Promise(r => setTimeout(r, 1800));

    // Étape 2 : Envoi Blockchain (Réel si wallet connecté, sinon Simulation)
    setEmissionStep(2);
    
    let success = false;
    if (account) {
      // APPEL RÉEL À LA BLOCKCHAIN
      success = await blockchainIssue(finalHash, studentID, studentName, degreeType, parseInt(graduationYear));
    } else {
      // SIMULATION POUR DÉMO
      await new Promise(r => setTimeout(r, 2500));
      success = true;
    }

    if (success) {
      setGeneratedData({
        id: studentID,
        hash: finalHash,
        name: studentName,
        type: degreeType
      });
      setEmissionStep(3);
    } else {
      alert("L'émission a échoué. Vérifiez votre connexion blockchain.");
      setIsEmitting(false);
    }
  };

  const closeEmissionModal = () => {
    setIsEmitting(false);
    setEmissionStep(0);
    setGeneratedData(null);
    setStudentID('');
    setStudentName('');
    setGraduationYear('');
  };

  return (
    <div ref={containerRef} className="flex-1 flex flex-col h-full w-full">
      {/* MODAL D'ÉMISSION */}
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
                  <p className="text-slate-500 text-sm">Inscription sur le réseau Polygon Amoy...</p>
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
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Matricule</span>
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
                  <button onClick={closeEmissionModal} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all">
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
          <button 
            onClick={connectWallet}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              account ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            {account ? `${account.substring(0, 6)}...${account.substring(38)}` : "Connect Wallet"}
          </button>
        </div>
      </header>

      <div className="p-8 max-w-7xl mx-auto space-y-8 w-full">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* FORMULAIRE D'ÉMISSION */}
          <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xl font-extrabold text-slate-800 mb-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">add_card</span>
                Nouvelle Certification
              </h3>
            </div>
            
            <form onSubmit={handleEmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Numéro de Matricule</label>
                  <input 
                    required type="text" placeholder="Ex: UJKZ-2024-001" 
                    value={studentID} onChange={(e) => setStudentID(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nom & Prénoms</label>
                  <input 
                    required type="text" placeholder="Ex: Compaoré Alice" 
                    value={studentName} onChange={(e) => setStudentName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Année d'obtention</label>
                  <input 
                    required type="number" placeholder="2024" 
                    value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Type de diplôme</label>
                  <select 
                    value={degreeType} onChange={(e) => setDegreeType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:border-blue-500 transition-all font-medium"
                  >
                    <option>Licence Professionnelle</option>
                    <option>Master M1</option>
                    <option>Master M2</option>
                    <option>Doctorat</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">send</span>
                  Générer et Inscrire
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
