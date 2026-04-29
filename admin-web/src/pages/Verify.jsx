import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Verify() {
  const [verifyStatus, setVerifyStatus] = useState(0); // 0: idle, 1: loading, 2: success, 3: error
  const [hashInput, setHashInput] = useState('');
  
  const containerRef = useRef(null);

  useGSAP(() => {
    // Header animation
    gsap.from('.verify-header', {
      y: -20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    });

    // Content animation
    gsap.from('.verify-content', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.2
    });
  }, { scope: containerRef });

  const handleVerify = (e) => {
    e.preventDefault();
    if (!hashInput) return;
    
    setVerifyStatus(1);
    setTimeout(() => {
      // Fake verification logic based on input length
      if (hashInput.length > 10) {
        setVerifyStatus(2);
      } else {
        setVerifyStatus(3);
      }
    }, 1500);
  };

  return (
    <div ref={containerRef} className="flex-1 flex flex-col h-full w-full">
      <header className="verify-header h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-8 flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-slate-800">Vérification de Diplôme</h2>
      </header>

      <div className="verify-content p-8 max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100">
            <span className="material-symbols-outlined text-4xl">policy</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 mb-4">Vérification Blockchain</h1>
          <p className="text-slate-500 max-w-md mx-auto">
            Saisissez le Hash cryptographique ou l'identifiant unique du diplôme pour vérifier son authenticité sur le réseau Polygon.
          </p>
        </div>

        <div className="bg-white w-full rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-emerald-400"></div>
          
          <form onSubmit={handleVerify} className="relative z-10">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  required
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value)}
                  placeholder="Ex: 0x8F21aB... ou DIP-2024-XXXX" 
                  className="w-full bg-slate-50 border-2 border-slate-200 text-slate-800 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono font-bold text-lg"
                />
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[24px]">key</span>
              </div>
              <button 
                type="submit"
                disabled={verifyStatus === 1}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-blue-500/30 active:scale-95 transition-all whitespace-nowrap flex items-center justify-center gap-2"
              >
                {verifyStatus === 1 ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">refresh</span>
                    Recherche...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">search</span>
                    Vérifier
                  </>
                )}
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <div className="w-full h-px bg-slate-200"></div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Ou utiliser la caméra</span>
              <div className="w-full h-px bg-slate-200"></div>
            </div>
            
            <button type="button" className="w-full mt-8 bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-300 text-slate-600 font-bold py-6 rounded-2xl transition-colors flex flex-col items-center justify-center gap-3 group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-blue-600 transition-colors">qr_code_scanner</span>
              </div>
              Scanner un code QR
            </button>
          </form>

          {/* RESULTS AREA */}
          {verifyStatus === 2 && (
            <div className="mt-10 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-emerald-600 text-3xl">verified</span>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-emerald-800 mb-1">Diplôme Authentique</h3>
                  <p className="text-sm text-emerald-600 mb-4">Ce document a été vérifié sur la blockchain Polygon et correspond à un enregistrement valide.</p>
                  
                  <div className="bg-white p-4 rounded-xl border border-emerald-100 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">Titulaire</span>
                      <span className="font-bold text-slate-800">Traoré Kévin</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">Diplôme</span>
                      <span className="font-bold text-slate-800">Licence Professionnelle</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">Date d'émission</span>
                      <span className="font-bold text-slate-800">14 Juin 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {verifyStatus === 3 && (
            <div className="mt-10 p-6 bg-red-50 border border-red-200 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-red-600 text-3xl">error</span>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-red-800 mb-1">Document Non Trouvé</h3>
                  <p className="text-sm text-red-600">Aucun enregistrement correspondant à ce Hash n'a été trouvé sur la blockchain. Le diplôme pourrait être falsifié.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
