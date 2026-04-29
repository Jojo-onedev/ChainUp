import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navLinks = [
    { path: '/admin/dashboard', icon: 'space_dashboard', label: 'Tableau de Bord' },
    { path: '/admin/certifications', icon: 'workspace_premium', label: 'Mes Certifications' },
    { path: '/admin/students', icon: 'groups', label: 'Répertoire Étudiants' },
    { path: '/admin/verify', icon: 'qr_code_scanner', label: 'Vérifier un Diplôme' },
  ];

  return (
    <div className="font-body-md overflow-x-hidden min-h-screen bg-slate-50 text-slate-800 flex">
      {/* BACKGROUND DECORATIONS (LIGHT THEME) */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-blue-100 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* --- SIDEBAR --- */}
      <aside className="h-screen w-72 bg-white border-r border-slate-200 shadow-sm fixed left-0 top-0 z-40 hidden lg:flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="material-symbols-outlined text-white text-xl">account_balance</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-slate-800 tracking-tight leading-tight">Univ. Joseph<br/>Ki-Zerbo</h1>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-3">Menu Principal</div>
          
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm shadow-blue-500/5'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium'
                }`}
              >
                <span className="material-symbols-outlined">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="p-6 border-t border-slate-100">
          <Link to="/" className="flex items-center gap-3 text-slate-500 hover:text-red-500 font-medium text-sm transition-colors">
            <span className="material-symbols-outlined">logout</span>
            Déconnexion
          </Link>
        </div>
      </aside>

      {/* --- MAIN CONTENT CANVAS --- */}
      <div className="flex-1 lg:ml-72 relative z-10 flex flex-col min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
