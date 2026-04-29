import React from 'react';

export default function Students() {
  const students = [
    { name: 'Traoré Kévin', email: 'k.traore@univ-ouaga.bf', faculty: 'Science Exactes', level: 'Licence 3', avatar: 'https://ui-avatars.com/api/?name=Traore+Kevin&background=f1f5f9&color=334155', certs: 1 },
    { name: 'Ouédraogo Aminata', email: 'a.ouedraogo@univ-ouaga.bf', faculty: 'Droit', level: 'Master 2', avatar: 'https://ui-avatars.com/api/?name=Ouedraogo+Aminata&background=f1f5f9&color=334155', certs: 2 },
    { name: 'Zongo Fabrice', email: 'f.zongo@univ-ouaga.bf', faculty: 'Économie', level: 'Licence 3', avatar: 'https://ui-avatars.com/api/?name=Zongo+Fabrice&background=f1f5f9&color=334155', certs: 1 },
    { name: 'Kaboré Léa', email: 'l.kabore@univ-ouaga.bf', faculty: 'Médecine', level: 'Doctorat', avatar: 'https://ui-avatars.com/api/?name=Kabore+Lea&background=f1f5f9&color=334155', certs: 3 },
    { name: 'Sanou Ibrahim', email: 'i.sanou@univ-ouaga.bf', faculty: 'Science Exactes', level: 'Master 1', avatar: 'https://ui-avatars.com/api/?name=Sanou+Ibrahim&background=f1f5f9&color=334155', certs: 1 },
    { name: 'Ilboudo Safiatou', email: 's.ilboudo@univ-ouaga.bf', faculty: 'Lettres', level: 'Master 2', avatar: 'https://ui-avatars.com/api/?name=Ilboudo+Safiatou&background=f1f5f9&color=334155', certs: 2 },
  ];

  return (
    <>
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-8 flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-slate-800">Répertoire Étudiants</h2>
        <div className="relative w-64">
          <input 
            type="text" 
            placeholder="Rechercher un profil..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-transparent rounded-full text-sm focus:outline-none focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
        </div>
      </header>

      <div className="p-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <img src={student.avatar} alt={student.name} className="w-16 h-16 rounded-2xl border-2 border-slate-100 shadow-sm" />
                <div className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-md border border-blue-100 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
                  {student.certs} Certif{student.certs > 1 ? 's' : ''}.
                </div>
              </div>
              
              <h3 className="font-extrabold text-slate-800 text-lg mb-1 group-hover:text-blue-600 transition-colors">{student.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{student.email}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-xs bg-slate-50 text-slate-600 border border-slate-200 px-2 py-1 rounded-md font-medium">{student.faculty}</span>
                <span className="text-xs bg-slate-50 text-slate-600 border border-slate-200 px-2 py-1 rounded-md font-medium">{student.level}</span>
              </div>
              
              <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl border border-slate-200 transition-colors text-sm flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">visibility</span>
                Voir le profil
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
