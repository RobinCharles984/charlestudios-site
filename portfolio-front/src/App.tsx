import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { ProjectDetails } from './pages/ProjectDetails';
import { CreateProject } from './pages/CreateProject';
import { EditProject } from './pages/EditProject';
import type { IProject } from './data/types'; 

// --- Old Home Component (Just for tests) ---
function OldHome() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    axios.get(`${API_URL}/projects`)
      .then(response => {
        setProjects(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      
      {/* --- 1. HERO SECTION --- */}
      <header className="py-20 px-6 text-center md:text-left md:flex md:items-center md:justify-center md:gap-12 max-w-5xl mx-auto">
        <img 
          src="https://github.com/RobinCharles984.png" // Ajuste para seu user
          alt="Profile" 
          className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-indigo-500 mx-auto md:mx-0 shadow-xl"
        />
        
        <div className="mt-6 md:mt-0">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Hello, I'm Charles
          </h1>
          <p className="text-xl text-slate-300 mt-4 max-w-lg">
            Fullstack Developer passionate about creating digital experiences and video games. 
            Focused on React, Node.js, and Game Dev (with Unity and Unreal Engine).
          </p>
          
          <div className="mt-6 flex gap-4 justify-center md:justify-start">
            <a href="https://github.com/RobinCharles984" target="_blank" className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition">GitHub</a>
            <a href="https://www.linkedin.com/in/tales-prudente-61358621a" target="_blank" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition">LinkedIn</a>
          </div>
        </div>
      </header>

      {/* --- 2. EXPERIENCE --- */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8 border-b border-slate-700 pb-2">Experience</h2>
        <div className="space-y-8">
          
          <div className="relative pl-8 border-l-2 border-indigo-500">
            <div className="absolute -left-[9px] top-0 w-4 h-4 bg-indigo-500 rounded-full"></div>
            <h3 className="text-xl font-bold">Web Development - Saturno Pedais</h3>
            <span className="text-sm text-indigo-400"> 01/2022 - 07/2022 • Intern</span>
            <p className="text-slate-400 mt-2">
              <p>Worked at a web-app project;</p>
              <p>Used React with TypeScript for the front-end and Node.js for the backend (with a big quantity of libraries to connectwith the company hardware product);</p>
              <p>Helped with mounting the product;</p>
              <p>Learned a few of hardware firmware and components.</p>
            </p>
          </div>

          <div className="relative pl-8 border-l-2 border-slate-700">
             <div className="absolute -left-[9px] top-0 w-4 h-4 bg-slate-700 rounded-full"></div>
            <h3 className="text-xl font-bold">Game Developer - Inatel</h3>
            <span className="text-sm text-indigo-400">04/2023 - 04/2025 • Intern</span>
            <p className="text-slate-400 mt-2">
              <p>Guide other students at game devoplment(Unity, Construct 3, GameMaker Studio 2);</p>
              <p>Presentation for guests;</p>
              <p>Game development classes;</p>
              <p>Creation of a VR Game.</p>
            </p>
          </div>

          <div className="relative pl-8 border-l-2 border-slate-700">
             <div className="absolute -left-[9px] top-0 w-4 h-4 bg-slate-700 rounded-full"></div>
            <h3 className="text-xl font-bold"> Virtual Reality Developer - Ford Motor Company</h3>
            <span className="text-sm text-indigo-400">03/2025 - 11/2025 • Research</span>
            <p className="text-slate-400 mt-2">
              <p> VR App development with Unreal Engine 5; </p>
              <p>   Plugin development using C++ and FBX SDK for Unreal Engine 5;</p>
              <p>  Git/GitHub version control;</p>
              <p>Documentation and agile methodology with Notion;</p>
              <p>Article write;</p>
              <p> Project with Ford Motor Company.</p>
            </p>
          </div>

        </div>
      </section>

      {/* --- 3. PROJECTS --- */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">My Projects</h2>
          <Link to="/admin/new" className="text-xs text-slate-700 hover:text-indigo-400">Admin</Link>
        </div>

        {loading ? (
          <p className="text-center text-slate-500">Loading projects...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map(project => (
              <Link 
                to={`/project/${project.slug}`} 
                key={project._id} 
                className="group bg-slate-800 rounded-xl overflow-hidden hover:transform hover:-translate-y-2 transition duration-300 shadow-lg border border-slate-700 hover:border-indigo-500"
              >
                <div className="h-48 bg-slate-700 w-full object-cover overflow-hidden">
                   {project.coverImageUrl ? (
                     <img src={project.coverImageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                   ) : (
                     <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-slate-800 flex items-center justify-center text-4xl">🚀</div>
                   )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition">{project.title}</h3>
                  <p className="text-slate-400 text-sm line-clamp-3">
                    {project.description}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <span className="text-xs bg-slate-900 px-2 py-1 rounded text-indigo-300">React</span>
                    <span className="text-xs bg-slate-900 px-2 py-1 rounded text-indigo-300">Node</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer className="text-center py-8 text-slate-600 text-sm">
        © 2025 Charles Portfolio. Made with ReactJS and NodeJS.
      </footer>
    </div>
  );
}

function Home() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [filter, setFilter] = useState<'all' | 'project' | 'study'>('project'); // Começa vendo Projetos
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca tudo e filtra no front (mais rápido para poucos itens)
    axios.get(`${import.meta.env.VITE_API_URL}/projects`)
      .then(res => { setProjects(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Lógica do Filtro
  const filteredItems = projects.filter(p => filter === 'all' ? true : p.type === filter);

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <header className="py-20 px-6 text-center md:text-left md:flex md:items-center md:justify-center md:gap-12 max-w-5xl mx-auto">
        <img 
          src="https://github.com/RobinCharles984.png" // Ajuste para seu user
          alt="Profile" 
          className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-indigo-500 mx-auto md:mx-0 shadow-xl"
        />
        
        <div className="mt-6 md:mt-0">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Hello, I'm Charles
          </h1>
          <p className="text-xl text-slate-300 mt-4 max-w-lg">
            Fullstack Developer passionate about creating digital experiences and video games. 
            Focused on React, Node.js, and Game Dev (with Unity and Unreal Engine).
          </p>
          
          <div className="mt-6 flex gap-4 justify-center md:justify-start">
            <a href="https://github.com/RobinCharles984" target="_blank" className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition">GitHub</a>
            <a href="https://www.linkedin.com/in/tales-prudente-61358621a" target="_blank" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition">LinkedIn</a>
          </div>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8 border-b border-slate-700 pb-2">Experience</h2>
        <div className="space-y-8">
          
          <div className="relative pl-8 border-l-2 border-indigo-500">
            <div className="absolute -left-[9px] top-0 w-4 h-4 bg-indigo-500 rounded-full"></div>
            <h3 className="text-xl font-bold">Web Development - Saturno Pedais</h3>
            <span className="text-sm text-indigo-400"> 01/2022 - 07/2022 • Intern</span>
            <p className="text-slate-400 mt-2">
              <p>Worked at a web-app project;</p>
              <p>Used React with TypeScript for the front-end and Node.js for the backend (with a big quantity of libraries to connectwith the company hardware product);</p>
              <p>Helped with mounting the product;</p>
              <p>Learned a few of hardware firmware and components.</p>
            </p>
          </div>

          <div className="relative pl-8 border-l-2 border-slate-700">
             <div className="absolute -left-[9px] top-0 w-4 h-4 bg-slate-700 rounded-full"></div>
            <h3 className="text-xl font-bold">Game Developer - Inatel</h3>
            <span className="text-sm text-indigo-400">04/2023 - 04/2025 • Intern</span>
            <p className="text-slate-400 mt-2">
              <p>Guide other students at game devoplment(Unity, Construct 3, GameMaker Studio 2);</p>
              <p>Presentation for guests;</p>
              <p>Game development classes;</p>
              <p>Creation of a VR Game.</p>
            </p>
          </div>

          <div className="relative pl-8 border-l-2 border-slate-700">
             <div className="absolute -left-[9px] top-0 w-4 h-4 bg-slate-700 rounded-full"></div>
            <h3 className="text-xl font-bold"> Virtual Reality Developer - Ford Motor Company</h3>
            <span className="text-sm text-indigo-400">03/2025 - 11/2025 • Research</span>
            <p className="text-slate-400 mt-2">
              <p> VR App development with Unreal Engine 5; </p>
              <p>   Plugin development using C++ and FBX SDK for Unreal Engine 5;</p>
              <p>  Git/GitHub version control;</p>
              <p>Documentation and agile methodology with Notion;</p>
              <p>Article write;</p>
              <p> Project with Ford Motor Company.</p>
            </p>
          </div>

        </div>
      </section>

      {/* --- NOVA SEÇÃO DE CONTEÚDO --- */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-end mb-8 border-b border-slate-700 pb-4">
          
          {/* ABAS DE NAVEGAÇÃO */}
          <div className="flex gap-6">
            <button 
              onClick={() => setFilter('project')}
              className={`text-2xl font-bold transition ${filter === 'project' ? 'text-white border-b-4 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
            >
              🚀 Projects
            </button>
            <button 
              onClick={() => setFilter('study')}
              className={`text-2xl font-bold transition ${filter === 'study' ? 'text-white border-b-4 border-yellow-500' : 'text-slate-500 hover:text-slate-300'}`}
            >
              📚 Studies & Quizzes
            </button>
          </div>

          <Link to="/admin/new" className="text-xs text-slate-700 hover:text-indigo-400">Admin</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredItems.map(item => (
              <Link to={`/project/${item.slug}`} key={item._id} className="group bg-slate-800 rounded-xl overflow-hidden hover:-translate-y-2 transition shadow-lg border border-slate-700">
                 <div className="h-48 bg-slate-700 w-full overflow-hidden relative">
                    {/* Badge na Capa */}
                    <span className={`absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold uppercase z-10 ${item.type === 'study' ? 'bg-yellow-600' : 'bg-indigo-600'}`}>
                      {item.type}
                    </span>
                    
                    {item.coverImageUrl ? (
                       <img src={item.coverImageUrl} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center text-4xl bg-slate-700">
                          {item.type === 'study' ? '📝' : '🚀'}
                       </div>
                    )}
                 </div>
                 <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400">{item.title}</h3>
                    {/* Descrição curta (remove markdown symbols pra preview) */}
                    <p className="text-slate-400 text-sm line-clamp-3">
                       {item.description.replace(/[#*`]/g, '')}
                    </p>
                 </div>
              </Link>
           ))}
        </div>
      </section>
      <footer className="text-center py-8 text-slate-600 text-sm">
        © 2025 Charles Portfolio. Made with ReactJS and NodeJS.
      </footer>
    </div>
  );
}

// --- Main App ---
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:slug" element={<ProjectDetails />} />
        <Route path="/admin/edit/:id" element={<EditProject />} />
        <Route path="/admin/new" element={<CreateProject />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;