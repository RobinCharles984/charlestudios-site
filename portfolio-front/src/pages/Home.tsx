import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import type { IProject } from '../data/types';

function Home() {
  const [items, setItems] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Controle de Abas
  const [careerTab, setCareerTab] = useState<'experience' | 'certificate'>('experience');
  const [portfolioTab, setPortfolioTab] = useState<'project' | 'study'>('project');

  useEffect(() => {
    // Busca os dados (Lógica Blindada contra erros)
    axios.get(`${import.meta.env.VITE_API_URL}/projects`)
      .then(res => { 
          const rawData = Array.isArray(res.data) ? res.data : [];
          
          const normalized = rawData.map((p: any) => ({
              ...p,
              // Garante que 'types' sempre seja um array
              types: Array.isArray(p.types) ? p.types : (p.type ? [p.type] : ['project']),
              description: p.description || '' 
          }));
          
          setItems(normalized); 
          setLoading(false); 
      })
      .catch((err) => {
          console.error("Erro ao buscar projetos:", err);
          setLoading(false);
      });
  }, []);

  // Filtros
  const certificates = items.filter(i => i.types?.includes('certificate'));
  const portfolioItems = items.filter(i => i.types?.includes(portfolioTab));

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      
      {/* --- 1. HERO SECTION (Seus Dados Pessoais) --- */}
      <header className="py-20 px-6 text-center md:text-left md:flex md:items-center md:justify-center md:gap-12 max-w-6xl mx-auto">
        <img 
          src="https://github.com/RobinCharles984.png" 
          alt="Profile" 
          className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-indigo-500 mx-auto md:mx-0 shadow-xl"
        />
        
        <div className="mt-6 md:mt-0">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Hello, I'm Tales
          </h1>
          <p className="text-xl text-slate-300 mt-4 max-w-lg">
            Fullstack Developer passionate about creating digital experiences and video games. 
            Focused on React, Node.js, and Game Dev (with Unity and Unreal Engine).
            Nickname: Charles.
          </p>
          
          <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
            {/* GitHub */}
            <a href="https://github.com/RobinCharles984" target="_blank" rel="noreferrer" className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition font-bold border border-slate-700">
              GitHub
            </a>
            
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/tales-prudente-61358621a" target="_blank" rel="noreferrer" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition font-bold">
              LinkedIn
            </a>

            {/* ✅ WhatsApp (Verde) */}
            <a href="https://wa.me/5535988138829" target="_blank" rel="noreferrer" className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition font-bold flex items-center gap-2">
              WhatsApp
            </a>

            {/* ✅ ArtStation (Azul Escuro) */}
            <a href="https://www.artstation.com/charlesstudios" target="_blank" rel="noreferrer" className="px-6 py-2 bg-blue-900 hover:bg-blue-800 rounded-lg transition font-bold flex items-center gap-2">
              ArtStation
            </a>
          </div>
        </div>
      </header>

      {/* --- 2. CAREER & EDUCATION (Com Abas) --- */}
      <section id="career" className="max-w-6xl mx-auto px-6 py-12 border-t border-slate-800">
         <div className="flex gap-6 mb-8 border-b border-slate-800 pb-2">
            <button onClick={() => setCareerTab('experience')} className={`text-2xl font-bold pb-2 ${careerTab === 'experience' ? 'text-white border-b-4 border-indigo-500' : 'text-slate-500'}`}>
               💼 Experience
            </button>
            <button onClick={() => setCareerTab('certificate')} className={`text-2xl font-bold pb-2 ${careerTab === 'certificate' ? 'text-white border-b-4 border-green-500' : 'text-slate-500'}`}>
               🏆 Certificates
            </button>
         </div>

         {/* Conteúdo da Aba Experiência */}
         {careerTab === 'experience' ? (
             <div className="space-y-8 pl-4 border-l-2 border-slate-700">
                
                {/* Experiência 1 */}
                <div className="relative">
                   <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-indigo-500"></div>
                   <h3 className="text-xl font-bold text-white">Web Development - Saturno Pedais</h3>
                   <span className="text-indigo-400 text-sm">01/2022 - 07/2022 • Intern</span>
                   <div className="text-slate-400 mt-2 text-sm space-y-1">
                      <p>• Worked at a web-app project;</p>
                      <p>• Used React with TypeScript for the front-end and Node.js for the backend;</p>
                      <p>• Helped with mounting the product;</p>
                      <p>• Learned a few of hardware firmware and components.</p>
                   </div>
                </div>

                {/* Experiência 2 */}
                <div className="relative">
                   <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-slate-700"></div>
                   <h3 className="text-xl font-bold text-white">Game Developer - Inatel</h3>
                   <span className="text-indigo-400 text-sm">04/2023 - 04/2025 • Intern</span>
                   <div className="text-slate-400 mt-2 text-sm space-y-1">
                      <p>• Guide other students at game development (Unity, Construct 3);</p>
                      <p>• Presentation for guests;</p>
                      <p>• Game development classes;</p>
                      <p>• Creation of a VR Game.</p>
                   </div>
                </div>

                {/* Experiência 3 */}
                <div className="relative">
                   <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-slate-700"></div>
                   <h3 className="text-xl font-bold text-white">Virtual Reality Developer - Ford Motor Company</h3>
                   <span className="text-indigo-400 text-sm">03/2025 - 11/2025 • Research</span>
                   <div className="text-slate-400 mt-2 text-sm space-y-1">
                      <p>• VR App development with Unreal Engine 5;</p>
                      <p>• Plugin development using C++ and FBX SDK;</p>
                      <p>• Documentation and agile methodology with Notion;</p>
                      <p>• Project with Ford Motor Company.</p>
                   </div>
                </div>

             </div>
         ) : (
             /* Conteúdo da Aba Certificados */
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map(cert => (
                   <Link to={`/project/${cert.slug}`} key={cert._id} className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-green-500 transition group flex gap-4 items-center">
                      {cert.coverImageUrl && <img src={cert.coverImageUrl} className="w-20 h-20 object-cover rounded opacity-80 group-hover:opacity-100" />}
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-green-400">{cert.title}</h3>
                        <p className="text-xs text-slate-500">View Certificate</p>
                      </div>
                   </Link>
                ))}
                {certificates.length === 0 && <p className="text-slate-500 italic">No certificates found. Add one in Admin!</p>}
             </div>
         )}
      </section>

      {/* --- 3. PORTFOLIO (Projects & Studies) --- */}
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
                    {/* Badges de Tipo */}
                    <div className="absolute top-2 right-2 flex gap-1 z-10">
                        {item.types?.includes('study') && <span className="bg-yellow-600 px-2 py-1 rounded text-[10px] font-bold shadow">STUDY</span>}
                        {item.types?.includes('project') && <span className="bg-indigo-600 px-2 py-1 rounded text-[10px] font-bold shadow">PROJ</span>}
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
                       {(item.description || '').replace(/[#*`]/g, '')}
                    </p>
                    <div className="mt-4 flex gap-2">
                         <span className="text-xs bg-slate-900 px-2 py-1 rounded text-indigo-300">View Details</span>
                    </div>
                 </div>
              </Link>
           ))}
           {portfolioItems.length === 0 && !loading && (
             <p className="text-slate-500 col-span-full text-center py-10">No items found in this category.</p>
           )}
        </div>
      </section>

      <footer className="text-center py-8 text-slate-600 text-sm border-t border-slate-800 mt-12">
        © 2025 Charles Portfolio. Made with ReactJS and NodeJS.
      </footer>
    </div>
  );
}

export default Home;