import React, { useState, useRef } from 'react';
import jsQR from 'jsqr';
import { useBlockchain } from './blockchain/useBlockchain';

function App() {
  const [hash, setHash] = useState('');
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  
  const { verifyDiploma } = useBlockchain();
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleVerify = async (e, providedHash) => {
    if (e) e.preventDefault();
    const hashToVerify = providedHash || hash;
    if (!hashToVerify) return;

    setStatus('loading');
    
    // On simule une petite attente pour l'effet visuel
    setTimeout(async () => {
      try {
        const data = await verifyDiploma(hashToVerify);
        if (data && data.valid) {
          setResult(data);
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (err) {
        setStatus('error');
      }
    }, 1200);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          setHash(code.data);
          handleVerify(null, code.data);
        } else {
          alert("Aucun QR Code dtect sur cette image.");
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100">
      
      {/* HEADER - Harmonisé avec le portail Admin */}
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="material-symbols-outlined text-white">shield_person</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight font-outfit">DiploChain <span className="text-blue-600 font-black">Verify</span></h2>
        </div>
        
        <div className="hidden md:flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Réseau Blockchain Actif</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 py-12">
        
        {/* SECTION TITRE */}
        <div className="text-center max-w-2xl mb-12 ">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 font-outfit leading-tight">
            Vérifiez vos diplomes <span className="text-blue-600">Instantanement</span>.
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Saisissez le code d'empreinte numérique unique présent sur votre document pour confirmer son authenticité sur la blockchain.
          </p>
        </div>

        {/* BARRE DE RECHERCHE PREMIUM */}
        <div className="w-full max-w-3xl">
          <form onSubmit={handleVerify} className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <span className="material-symbols-outlined text-3xl">search</span>
            </div>
            
            {/* Input de fichier cach */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />

            <input 
              type="text"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              placeholder="0x... (Collez le hash ici)"
              className="w-full h-24 pl-16 pr-44 bg-white rounded-[32px] border-2 border-transparent shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] text-xl font-bold focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-200 text-slate-800"
            />
            
            <div className="absolute inset-y-3 right-3 flex items-center gap-3">
              <button 
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="w-16 h-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-blue-600 rounded-2xl transition-all flex items-center justify-center"
                title="Charger une image QR Code"
              >
                <span className="material-symbols-outlined text-3xl">add_a_photo</span>
              </button>

              <button 
                type="submit"
                disabled={status === 'loading'}
                className="h-full px-10 bg-slate-900 hover:bg-blue-600 text-white font-black rounded-2xl transition-all shadow-xl active:scale-95 disabled:opacity-50 uppercase tracking-widest text-xs flex items-center gap-2"
              >
                {status === 'loading' ? (
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined">verified</span>
                    Vrifier
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RÉSULTATS */}
        <div className="w-full max-w-2xl mt-12 min-h-[300px]">
          
          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest font-outfit">Analyse Blockchain en cours...</p>
            </div>
          )}

          {status === 'success' && result && (
            <div className="bg-white rounded-[40px] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-white animate-in zoom-in-95 duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-[140px] text-emerald-500">verified</span>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <span className="material-symbols-outlined text-4xl font-bold">check_circle</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 font-outfit uppercase">Diplme Authentique</h3>
                    <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Scuris par DiploChain</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Titulaire du diplme</span>
                    <span className="text-xl font-bold text-slate-800">{result.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Anne de russite</span>
                    <span className="text-xl font-bold text-slate-800">{result.year}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Type de certification</span>
                    <span className="text-xl font-bold text-slate-800">{result.degree}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Enregistrement</span>
                    <span className="text-xl font-bold text-slate-800">{result.date}</span>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 font-mono">
                    <span className="material-symbols-outlined text-sm">link</span>
                    HASH: {hash.substring(0, 24)}...
                  </div>
                  <a 
                    href={`https://amoy.polygonscan.com/address/${hash}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Vrification PolygonScan
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-white rounded-[40px] p-12 shadow-xl border border-red-50 animate-in shake duration-500 text-center">
              <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-6xl">gpp_maybe</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 font-outfit uppercase">Vrification choue</h3>
              <p className="text-slate-500 font-medium max-w-sm mx-auto text-sm leading-relaxed">
                Ce hash ne correspond  aucun diplme certifi sur notre réseau. Veuillez vérifier le code ou scanner un QR Code officiel.
              </p>
              <button 
                onClick={() => {setHash(''); setStatus('idle')}}
                className="mt-10 px-8 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 transition-all"
              >
                Nouvelle Recherche
              </button>
            </div>
          )}

        </div>
      </main>

      <footer className="py-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
        &copy; 2026 DiploChain System &bull; Decentralized Credential Network
      </footer>
    </div>
  );
}

export default App;
