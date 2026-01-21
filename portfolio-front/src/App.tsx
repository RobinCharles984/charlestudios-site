import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import type { IProject } from './data/types';

function Home() {
  const [items, setItems] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Controle de Abas
  const [careerTab, setCareerTab] = useState<'experience' | 'certificate'>('experience');
  const [portfolioTab, setPortfolioTab] = useState<'project' | 'study'>('project');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/projects`)
      .then(res => { 
          // ⚠️ Tratamento para compatibilidade com posts antigos que só tem 'type' string
          const normalized = res.data.map((p: any) => ({
              ...p,
              types: p.types || (p.type ? [p.type] : ['project']) // Garante que sempre seja array
          }));
          setItems(normalized); 
          setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  // Filtros
  const certificates = items.filter(i => i.types.includes('certificate'));
  const portfolioItems = items.filter(i => i.types.includes(portfolioTab)); // Filtra se tem a tag 'project' OU 'study'

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* HEADER (Mantenha o seu Header atual) */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
         <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
               CharlesStudios.dev
            </h1>
            <div className="flex gap-4">
               <a href="#career" className="hover:text-indigo-400 transition">Career</a>
               <a href="#portfolio" className="hover:text-indigo-400 transition">Portfolio</a>
            </div>
         </div>
      </header>

      {/* HERO (Mantenha sua intro) */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
         <h2 className="text-5xl font-bold mb-4">Building Realities.</h2>
         <p className="text-slate-400 text-xl">Fullstack Developer & Game Designer</p>
      </section>

      {/* --- SEÇÃO 1: CAREER & EDUCATION --- */}
      <section id="career" className="max-w-6xl mx-auto px-6 py-12 border-t border-slate-800">
         <div className="flex gap-6 mb-8 border-b border-slate-800 pb-2">
            <button onClick={() => setCareerTab('experience')} className={`text-2xl font-bold pb-2 ${careerTab === 'experience' ? 'text-white border-b-4 border-indigo-500' : 'text-slate-500'}`}>
               💼 Experience
            </button>
            <button onClick={() => setCareerTab('certificate')} className={`text-2xl font-bold pb-2 ${careerTab === 'certificate' ? 'text-white border-b-4 border-green-500' : 'text-slate-500'}`}>
               🏆 Certificates
            </button>
         </div>

         {/* CONTEÚDO DA CARREIRA */}
         {careerTab === 'experience' ? (
             <div className="space-y-8 pl-4 border-l-2 border-slate-700">
                {/* 📝 AQUI VAI SUA LISTA DE EXPERIÊNCIA MANUAL */}
                <div className="relative">
                   <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-indigo-500"></div>
                   <h3 className="text-xl font-bold text-white">Fullstack Developer</h3>
                   <span className="text-indigo-400 text-sm">Metacare Land • 2023 - Present</span>
                   <p className="text-slate-400 mt-2">Developing VR/AR solutions and web platforms.</p>
                </div>
                {/* Adicione mais experiências aqui... */}
             </div>
         ) : (
             /* GRID DE CERTIFICADOS (Vem do Banco de Dados!) */
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {certificates.map(cert => (
                   <Link to={`/project/${cert.slug}`} key={cert._id} className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-green-500 transition group">
                      {cert.coverImageUrl && <img src={cert.coverImageUrl} className="w-full h-32 object-cover rounded mb-4 opacity-80 group-hover:opacity-100" />}
                      <h3 className="font-bold text-lg group-hover:text-green-400">{cert.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">Click to view details</p>
                   </Link>
                ))}
                {certificates.length === 0 && <p className="text-slate-500">No certificates uploaded yet.</p>}
             </div>
         )}
      </section>

      {/* --- SEÇÃO 2: PORTFOLIO (Projetos & Estudos) --- */}
      <section id="portfolio" className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-end mb-8 border-b border-slate-700 pb-4">
          <div className="flex gap-6">
            <button onClick={() => setPortfolioTab('project')} className={`text-2xl font-bold pb-2 ${portfolioTab === 'project' ? 'text-white border-b-4 border-indigo-500' : 'text-slate-500'}`}>
              🚀 Projects
            </button>
            <button onClick={() => setPortfolioTab('study')} className={`text-2xl font-bold pb-2 ${portfolioTab === 'study' ? 'text-white border-b-4 border-yellow-500' : 'text-slate-500'}`}>
              📚 Studies
            </button>
          </div>
          <Link to="/admin/new" className="text-xs text-slate-700 hover:text-indigo-400">Admin</Link>
        </div>

        {loading && <p className="text-center text-xl text-slate-500 py-10">Loading content...</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {portfolioItems.map(item => (
              <Link to={`/project/${item.slug}`} key={item._id} className="group bg-slate-800 rounded-xl overflow-hidden hover:-translate-y-2 transition shadow-lg border border-slate-700">
                 <div className="h-48 bg-slate-700 w-full overflow-hidden relative">
                    {/* Tags Badge */}
                    <div className="absolute top-2 right-2 flex gap-1 z-10">
                        {item.types.includes('study') && <span className="bg-yellow-600 px-2 py-1 rounded text-[10px] font-bold">STUDY</span>}
                        {item.types.includes('project') && <span className="bg-indigo-600 px-2 py-1 rounded text-[10px] font-bold">PROJ</span>}
                    </div>
                    
                    {item.coverImageUrl ? (
                       <img src={item.coverImageUrl} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center text-4xl bg-slate-700">🎮</div>
                    )}
                 </div>
                 <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400">{item.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-3">
                       {item.description.replace(/[#*`]/g, '')}
                    </p>
                 </div>
              </Link>
           ))}
        </div>
      </section>
    </div>
  );
}

export default Home;