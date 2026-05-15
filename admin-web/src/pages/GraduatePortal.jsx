import React, { useState } from 'react';
import { useBlockchain } from '../blockchain/useBlockchain';
import { Search, GraduationCap, Calendar, User, CheckCircle, Share2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function GraduatePortal() {
  const [studentID, setStudentID] = useState('');
  const [diplomas, setDiplomas] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { loading, getStudentDiplomas } = useBlockchain();

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!studentID.trim()) return;

    setHasSearched(true);
    const results = await getStudentDiplomas(studentID.trim());
    setDiplomas(results || []);
  };

  const copyShareLink = (hash) => {
    const link = `${window.location.origin}/verify?hash=${hash}`;
    navigator.clipboard.writeText(link);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-[#0f172a] text-white px-6 py-3 rounded-xl shadow-2xl font-bold animate-in fade-in slide-in-from-bottom-4">
          Lien de vérification copié !
        </div>
      )}
      {/* Navbar Minimaliste */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#2563eb] rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <span className="font-black text-xl tracking-tight">DiploChain <span className="text-[#2563eb]">Interface Diplomé</span></span>
        </div>
        <a href="/" className="text-sm font-bold text-slate-600 hover:text-[#2563eb] transition-colors">Retour à l'accueil</a>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Votre <span className="text-[#2563eb]">Coffre-Fort</span> Numérique
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Accédez instantanément à tous vos diplômes certifiés sur la blockchain Polygon et partagez vos preuves de réussite en un clic.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-20">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="text-slate-400 group-focus-within:text-[#2563eb] transition-colors" size={22} />
            </div>
            <input
              type="text"
              placeholder="Entrez votre numéro de matricule (ex: UJKZ-2024-001)"
              className="w-full pl-14 pr-36 py-6 bg-white border-2 border-slate-200 rounded-3xl text-lg font-semibold focus:outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-blue-50 transition-all shadow-xl shadow-slate-200/50"
              value={studentID}
              onChange={(e) => setStudentID(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-3 top-3 bottom-3 px-8 bg-[#0f172a] text-white rounded-2xl font-bold hover:bg-[#2563eb] transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? "Recherche..." : "Accéder"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>

        {/* Results Area */}
        <div className="space-y-8">
          {loading ? (
            <div className="flex flex-col items-center py-20 animate-pulse">
              <div className="w-16 h-16 bg-slate-200 rounded-full mb-4"></div>
              <div className="h-4 w-48 bg-slate-200 rounded"></div>
            </div>
          ) : hasSearched && diplomas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {diplomas.map((diploma, index) => (
                <div key={index} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group relative overflow-hidden">
                  {/* Badge Blockchain */}
                  <div className="absolute top-0 right-0 px-4 py-2 bg-blue-50 text-[#2563eb] text-[10px] font-black tracking-widest rounded-bl-2xl uppercase">
                    Blockchain Verified
                  </div>

                  <div className="flex items-start gap-5 mb-8">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#2563eb]">
                      <GraduationCap size={30} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black mb-1">{diploma.degree}</h3>
                      <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">{diploma.studentID}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-slate-600">
                      <User size={18} className="text-slate-400" />
                      <span className="font-semibold">{diploma.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <Calendar size={18} className="text-slate-400" />
                      <span className="font-semibold">Promotion {diploma.year}</span>
                    </div>
                    <div className="flex items-center gap-3 text-green-600">
                      <CheckCircle size={18} />
                      <span className="font-bold text-sm">Certifié le {diploma.date}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => copyShareLink(diploma.hash || 'demo-hash')}
                    className="w-full py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#2563eb] hover:text-white hover:border-[#2563eb] transition-all group-hover:shadow-lg"
                  >
                    <Share2 size={18} />
                    Partager mon lien de vérification
                  </button>
                </div>
              ))}
            </div>
          ) : hasSearched && !loading ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Aucun diplôme trouvé</h3>
              <p className="text-slate-500">Vérifiez votre matricule ou contactez votre établissement.</p>
            </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                <FeatureCard icon={<ShieldCheck className="text-blue-600" />} title="Sécurité" desc="Vos diplômes sont ancrés sur la blockchain." />
                <FeatureCard icon={<Share2 className="text-purple-600" />} title="Mobilité" desc="Partagez vos preuves partout dans le monde." />
                <FeatureCard icon={<CheckCircle className="text-green-600" />} title="Instantanné" desc="Vérification en moins de 3 secondes." />
             </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-12 text-slate-400 font-medium text-sm">
        © 2026 DiploChain Burkina · Souveraineté Numérique & Excellence
      </footer>
    </div>
  );
}

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-4">
      {icon}
    </div>
    <h4 className="font-bold mb-2">{title}</h4>
    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
  </div>
);
