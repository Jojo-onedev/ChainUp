import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Certifications() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Header & controls animation
    gsap.from('.cert-header', {
      y: -20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    });

    gsap.from('.cert-controls', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
      delay: 0.1
    });

    // Table rows staggered animation
    gsap.from('.cert-row', {
      x: -20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: 'power2.out',
      delay: 0.3
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="flex-1 flex flex-col h-full w-full">
      <header className="cert-header h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-8 flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-slate-800">Mes Certifications</h2>
      </header>

      <div className="p-8 max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="cert-controls p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-800">Registre des diplômes</h3>
              <p className="text-sm text-slate-500">Liste complète de tous les diplômes émis par l'établissement.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Rechercher un étudiant..." 
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
              </div>
              <button className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-200 transition-colors">
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                Filtrer
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="p-4 pl-6">ID Diplôme</th>
                  <th className="p-4">Étudiant</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Année</th>
                  <th className="p-4">Transaction (Polygon)</th>
                  <th className="p-4 text-center">Statut</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {[
                  { id: 'DIP-2024-9182', name: 'Traoré Kévin', type: 'Licence', year: '2024', hash: '0x8F21...A4C1' },
                  { id: 'DIP-2023-4412', name: 'Ouédraogo Aminata', type: 'Master M2', year: '2023', hash: '0x1A9B...F9B2' },
                  { id: 'DIP-2024-1102', name: 'Zongo Fabrice', type: 'Licence', year: '2024', hash: '0x3C47...87D5' },
                  { id: 'DIP-2022-7734', name: 'Kaboré Léa', type: 'Doctorat', year: '2022', hash: '0x9E2A...D1F6' },
                  { id: 'DIP-2024-5541', name: 'Sanou Ibrahim', type: 'Master M1', year: '2024', hash: '0x5B8C...E2A3' },
                ].map((row, i) => (
                  <tr key={i} className="cert-row hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6 font-mono text-slate-600 font-medium">{row.id}</td>
                    <td className="p-4 font-bold text-slate-800">{row.name}</td>
                    <td className="p-4 text-slate-600">{row.type}</td>
                    <td className="p-4 text-slate-600">{row.year}</td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded font-mono text-xs border border-slate-200">
                        {row.hash}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-xs font-bold px-2.5 py-1 rounded-md border border-emerald-100">
                        <span className="material-symbols-outlined text-[14px]">verified</span> Validé
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
            <div>Affichage de 1 à 5 sur 1,248 diplômes</div>
            <div className="flex gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50 text-slate-400 cursor-not-allowed">&lt;</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-blue-200 bg-blue-50 text-blue-600 font-bold">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50 text-slate-600">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50 text-slate-600">3</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 hover:bg-slate-50 text-slate-600">&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
