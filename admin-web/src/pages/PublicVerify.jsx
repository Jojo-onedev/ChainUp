import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useBlockchain } from '../blockchain/useBlockchain';
import { Link } from 'react-router-dom';

export default function PublicVerify() {
  const [hash, setHash] = useState('');
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const { verifyDiploma } = useBlockchain();
  const fileInputRef = useRef(null);
  const qrRef = useRef(null);

  const downloadQR = () => {
    const svg = document.getElementById("qr-gen");
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
      downloadLink.download = `QRCode_DiploChain_${result.name.replace(' ', '_')}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleVerify = async (e, providedHash) => {
    if (e) e.preventDefault();
    const hashToVerify = providedHash || hash;
    if (!hashToVerify) return;

    setStatus('loading');
    setTimeout(async () => {
      try {
        const data = await verifyDiploma(hashToVerify);
        if (data && data.valid) {
          setResult(data);
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch {
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
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        import('jsqr').then(({ default: jsQR }) => {
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            setHash(code.data);
            handleVerify(null, code.data);
          } else {
            alert('Aucun QR Code détecté sur cette image.');
          }
        });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100">

      {/* HEADER */}
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="material-symbols-outlined text-white">shield_person</span>
          </div>
          <Link to="/" className="text-xl font-extrabold text-slate-800 tracking-tight">
            DiploChain <span className="text-blue-600 font-black">Verification Publique</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Réseau Blockchain Actif</span>
          </div>
          <Link
            to="/admin"
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-all"
          >
            Espace Université
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 py-12">

        {/* TITRE */}
        <div className="text-center max-w-2xl mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
            Vérifiez un diplôme <span className="text-blue-600">Instantanément</span>.
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Saisissez le code d'empreinte numérique unique présent sur votre document ou scannez le QR Code pour confirmer son authenticité sur la blockchain Polygon.
          </p>
        </div>

        {/* BARRE DE RECHERCHE */}
        <div className="w-full max-w-3xl">
          <form onSubmit={handleVerify} className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <span className="material-symbols-outlined text-3xl">search</span>
            </div>

            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

            <input
              type="text"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              placeholder="0x... (Collez le hash ici)"
              className="w-full h-24 pl-16 pr-52 bg-white rounded-[32px] border-2 border-transparent shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] text-xl font-bold focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-200 text-slate-800"
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
                className="h-full px-8 bg-slate-900 hover:bg-blue-600 text-white font-black rounded-2xl transition-all shadow-xl active:scale-95 disabled:opacity-50 uppercase tracking-widest text-xs flex items-center gap-2"
              >
                {status === 'loading' ? (
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                ) : (
                  <><span className="material-symbols-outlined">verified</span> Vérifier</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RÉSULTATS */}
        <div className="w-full max-w-4xl mt-12 min-h-[260px]">

          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Analyse Blockchain en cours...</p>
            </div>
          )}

          {status === 'success' && result && (
            <div className="bg-white rounded-[40px] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-[140px] text-emerald-500">verified</span>
              </div>
              
              <div className="flex flex-col md:flex-row gap-12">
                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                      <span className="material-symbols-outlined text-4xl">check_circle</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 uppercase">Diplôme Authentique</h3>
                      <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Sécurisé par DiploChain</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                    {[
                      { label: 'Titulaire', value: result.name },
                      { label: 'Année de réussite', value: result.year },
                      { label: 'Type de certification', value: result.degree },
                      { label: 'Enregistrement', value: result.date },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">{label}</span>
                        <span className="text-xl font-bold text-slate-800">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-mono text-slate-400">HASH: {hash.substring(0, 24)}...</p>
                    <a
                      href={`https://amoy.polygonscan.com/address/0x78b7813df1e6a5907744aff6E4FfA91D8EAf3A9d`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      Audit sur PolygonScan
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                  </div>
                </div>

                {/* SECTION QR CODE */}
                <div className="w-full md:w-64 flex flex-col items-center justify-center bg-slate-50 rounded-[32px] p-8 border border-slate-100">
                   <div className="bg-white p-4 rounded-2xl shadow-sm mb-6">
                      <QRCodeSVG 
                        id="qr-gen"
                        value={hash} 
                        size={160}
                        level="H"
                        includeMargin={false}
                      />
                   </div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">QR Code de Validation</p>
                   <button 
                    onClick={downloadQR}
                    className="w-full py-3 bg-white hover:bg-blue-50 text-blue-600 border border-blue-100 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm"
                   >
                     <span className="material-symbols-outlined text-lg">download</span>
                     Télécharger
                   </button>
                </div>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-white rounded-[40px] p-12 shadow-xl border border-red-50 text-center">
              <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-6xl">gpp_maybe</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 uppercase">Vérification Échouée</h3>
              <p className="text-slate-500 font-medium max-w-sm mx-auto text-sm leading-relaxed">
                Ce hash ne correspond à aucun diplôme certifié sur notre réseau. Veuillez vérifier le code ou scanner un QR Code officiel.
              </p>
              <button
                onClick={() => { setHash(''); setStatus('idle'); }}
                className="mt-10 px-8 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 transition-all"
              >
                Nouvelle Recherche
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="py-10 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
        © 2026 DiploChain System · Decentralized Credential Network
      </footer>
    </div>
  );
}
