import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useBlockchain } from '../blockchain/useBlockchain';

export default function Dashboard() {
  const { account, connectWallet, issueDiploma: blockchainIssue } = useBlockchain();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [isEmitting, setIsEmitting] = useState(false);
  const [emissionStep, setEmissionStep] = useState(0); 
  const [issueStatus, setIssueStatus] = useState('idle');
  const [generatedData, setGeneratedData] = useState(null);

  // Sécurité
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // Formulaire
  const [studentID, setStudentID] = useState('');
  const [studentName, setStudentName] = useState('');
  const [graduationYear, setGraduationYear] = useState('2024');
  const [degreeType, setDegreeType] = useState('Licence Professionnelle');

  // Récupérer les infos de l'université connectée
  const connectedUniv = JSON.parse(localStorage.getItem('connected_univ') || '{"name": "Espace d\'Émission", "icon": "account_balance"}');

  useGSAP(() => {
    gsap.from('.dash-header', { y: -20, opacity: 0, duration: 0.6, ease: 'power3.out' });
    gsap.from('.stat-card', { y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.2 });
    gsap.from('.main-panel', { y: 40, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out', delay: 0.4 });
  }, { scope: containerRef });

  const handleEmit = async (e) => {
    e.preventDefault();
    if (!studentName || !graduationYear || !studentID) return alert("Veuillez remplir tous les champs");

    setIsEmitting(true);
    setIssueStatus('processing');

    // Étape 1 : Simulation Hash
    setEmissionStep(1);
    await new Promise(r => setTimeout(r, 1500));

    // Étape 2 : Blockchain
    setEmissionStep(2);
    const mockHash = `0x${Math.random().toString(16).slice(2)}...${Math.random().toString(16).slice(2)}`;
    
    try {
      let success = false;
      let finalHash = mockHash;

      if (account) {
        // Envoi réel si wallet connecté
        const txHash = `0x${studentID.toLowerCase().replace(/[^a-f0-9]/g, '0').padEnd(64, '0')}`;
        success = await blockchainIssue(txHash, studentID, studentName, degreeType, parseInt(graduationYear));
        finalHash = txHash;
      } else {
        // Simulation pour démo sans wallet
        await new Promise(r => setTimeout(r, 2000));
        success = true;
      }

      if (success) {
        // Génération du contenu hors-ligne (Verifiable Credential)
        const offlineData = {
          id: studentID,
          n: studentName,
          d: degreeType,
          y: graduationYear,
          i: connectedUniv.name,
          h: finalHash
        };
        
        // Pour la démo, on crée une signature factice mais structurée 
        // En prod, on utiliserait signer.signMessage(JSON.stringify(offlineData))
        const signature = `SIG_${btoa(studentID + finalHash).substring(0, 32)}`;
        
        const qrContent = JSON.stringify({
          ...offlineData,
          s: signature
        });

        setGeneratedData({
          id: studentID,
          hash: finalHash,
          name: studentName,
          type: degreeType,
          qrValue: qrContent // On utilise ce contenu riche pour le QR Code
        });
        setIssueStatus('success');
        setEmissionStep(3);
      } else {
        setIssueStatus('error');
        setIsEmitting(false);
      }
    } catch (err) {
      console.error(err);
      setIssueStatus('error');
      setIsEmitting(false);
    }
  };

  const resetForm = () => {
    setIssueStatus('idle');
    setIsEmitting(false);
    setEmissionStep(0);
    setStudentID('');
    setStudentName('');
    setGraduationYear('2024');
    setGeneratedData(null);
  };

  const handlePasswordChange = () => {
    if (!newPassword.trim() || newPassword.length < 4) {
      alert("Le mot de passe doit contenir au moins 4 caractères.");
      return;
    }

    const allUnivs = JSON.parse(localStorage.getItem('diplo_universities') || '[]');
    const updatedUnivs = allUnivs.map(u => {
      if (u.id === connectedUniv.id) {
        return { ...u, password: newPassword };
      }
      return u;
    });

    localStorage.setItem('diplo_universities', JSON.stringify(updatedUnivs));
    
    // Mettre à jour l'objet courant
    const updatedConnected = { ...connectedUniv, password: newPassword };
    localStorage.setItem('connected_univ', JSON.stringify(updatedConnected));
    
    setIsSecurityModalOpen(false);
    setNewPassword('');
    alert("Mot de passe mis à jour avec succès !");
  };

  const downloadQR = () => {
    const svg = document.getElementById("qr-output");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `Certificat_${generatedData?.id}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div ref={containerRef} className="flex-1 flex flex-col h-full w-full bg-[#f8fafc]">
      {/* MODAL DE CHARGEMENT */}
      {isEmitting && emissionStep < 3 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[40px] w-full max-w-sm p-10 text-center shadow-2xl animate-in zoom-in-95">
             <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
             <h3 className="text-xl font-black text-slate-800 mb-2">
               {emissionStep === 1 ? 'Génération du Hash...' : 'Inscription Blockchain...'}
             </h3>
             <p className="text-slate-500 text-sm">Veuillez patienter quelques instants.</p>
          </div>
        </div>
      )}

      {/* TOP BAR */}
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <span className="material-symbols-outlined">{connectedUniv.icon}</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
            {connectedUniv.name} <span className="text-slate-400 font-medium ml-2">- Portail Officiel</span>
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={connectWallet}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black transition-all shadow-lg ${
              account 
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
            {account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'Connecter Wallet'}
          </button>
          <button onClick={() => setIsSecurityModalOpen(true)} className="w-11 h-11 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all" title="Sécurité">
            <span className="material-symbols-outlined">security</span>
          </button>
          <button onClick={() => navigate('/admin')} className="w-11 h-11 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-all" title="Déconnexion">
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </header>

      <div className="p-8 max-w-7xl mx-auto space-y-8 w-full">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Diplômes', val: '1,254', color: 'blue', icon: 'description' },
            { label: 'Étudiants Certifiés', val: '892', color: 'indigo', icon: 'group' },
            { label: 'Authenticité', val: '100%', color: 'emerald', icon: 'verified_user' },
            { label: 'Alertes Fraude', val: '14', color: 'amber', icon: 'warning' },
          ].map((s, i) => (
            <div key={i} className="stat-card bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
              <div className="w-12 h-12 mb-4 rounded-2xl flex items-center justify-center bg-slate-50 text-slate-600">
                <span className="material-symbols-outlined">{s.icon}</span>
              </div>
              <h4 className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{s.label}</h4>
              <p className="text-3xl font-black text-slate-800">{s.val}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden main-panel">
            {issueStatus === 'success' ? (
              <div className="p-12 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex flex-col md:flex-row gap-10 items-center">
                  <div className="flex-1">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                      <span className="material-symbols-outlined text-4xl">verified</span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-2">Émission Réussie</h3>
                    <p className="text-slate-500 font-medium mb-8">Le diplôme a été ancré de manière immuable sur la blockchain.</p>
                    
                    <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Étudiant</span>
                        <span className="text-lg font-bold text-slate-800">{generatedData?.name}</span>
                      </div>
                      <div className="flex gap-8">
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Matricule</span>
                          <span className="font-bold text-slate-800">{generatedData?.id}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Diplôme</span>
                          <span className="font-bold text-slate-800">{generatedData?.type}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Empreinte Blockchain (Hash)</span>
                        <span className="text-[10px] font-mono text-blue-600 break-all bg-blue-50 p-2 rounded-lg block">{generatedData?.hash}</span>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-8">
                      <button onClick={resetForm} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black shadow-xl active:scale-95 transition-all">Nouveau</button>
                      <button onClick={() => navigate('/graduate')} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black hover:bg-slate-200 transition-all">Vérifier</button>
                    </div>
                  </div>

                  <div className="w-full md:w-64 bg-white border-2 border-slate-100 rounded-[40px] p-8 flex flex-col items-center shadow-2xl">
                    <div className="bg-white p-3 rounded-2xl shadow-inner mb-4 border border-slate-50">
                      <QRCodeSVG 
                        id="qr-output"
                        value={generatedData?.qrValue || ""} 
                        size={160}
                        level="M" 
                      />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">QR Code Officiel</p>
                    <button 
                      onClick={downloadQR}
                      className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <span className="material-symbols-outlined text-lg">download</span>
                      Télécharger
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-10">
                <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                  <span className="material-symbols-outlined text-blue-600">add_card</span>
                  Nouvelle Certification
                </h3>
                <form onSubmit={handleEmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Matricule Étudiant</label>
                      <input required type="text" value={studentID} onChange={(e)=>setStudentID(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold outline-none focus:border-blue-500 transition-all" placeholder="UJKZ-2024-001" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nom Complet</label>
                      <input required type="text" value={studentName} onChange={(e)=>setStudentName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold outline-none focus:border-blue-500 transition-all" placeholder="Compaoré Alice" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Année d'obtention</label>
                      <input required type="number" value={graduationYear} onChange={(e)=>setGraduationYear(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold outline-none focus:border-blue-500 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Type de Diplôme</label>
                      <select value={degreeType} onChange={(e)=>setDegreeType(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold outline-none focus:border-blue-500 transition-all appearance-none">
                        <option>Licence Professionnelle</option>
                        <option>Master Spécialisé</option>
                        <option>Doctorat Unique</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95">
                    Certifier et Inscrire sur la Blockchain
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="bg-slate-900 rounded-[40px] p-8 text-white main-panel shadow-2xl">
            <h3 className="text-xl text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-400">info</span>
              Guide de Certification
            </h3>
            <div className="space-y-6">
              {[
                { t: 'Intégrité', d: 'Chaque diplôme est hashé pour garantir qu\'aucune modification n\'est possible.' },
                { t: 'Transparence', d: 'Le registre est public et vérifiable par n\'importe quel recruteur.' },
                { t: 'Souveraineté', d: 'L\'université garde le contrôle total de ses clés de signature.' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white/5 p-5 rounded-3xl border border-white/10">
                  <h4 className="font-black text-blue-400 mb-1">{item.t}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL SÉCURITÉ */}
      {isSecurityModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">lock_reset</span>
              </div>
              <button onClick={() => setIsSecurityModalOpen(false)} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Changer de Mot de Passe</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Modifiez la clé d'accès attribuée par le Ministère pour sécuriser votre portail d'émission.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nouveau mot de passe</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">key</span>
                  <input 
                    type="password"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    placeholder="Entrez votre nouveau mot de passe"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <button 
                onClick={handlePasswordChange}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all"
              >
                Mettre à jour l'accès
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
