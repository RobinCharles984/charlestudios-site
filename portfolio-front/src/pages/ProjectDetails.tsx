import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Giscus from '@giscus/react';
import axios from 'axios';
import type { IProject } from '../data/types';

export function ProjectDetails() {
  const { slug } = useParams();
  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Estado para controlar qual aba do quiz está ativa
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    axios.get(`${API_URL}/projects/${slug}`)
      .then(res => { setProject(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="text-white p-10">Loading...</div>;
  if (!project) return <div className="text-white p-10">Not found!</div>;

  const hasQuizzes = project.quizzes && project.quizzes.length > 0;

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans pb-10">
      <div className="max-w-4xl mx-auto px-6 py-10">
        
        {/* 1. Header (Badge e Título) */}
        <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${project.type === 'study' ? 'bg-yellow-600 text-yellow-100' : 'bg-indigo-600 text-indigo-100'}`}>
          {project.type}
        </span>

        <h1 className="text-4xl font-bold mt-2 mb-6">{project.title}</h1>

        {/* 2. Capa (Agora aparece sempre, para dar um visual legal no topo) */}
        {project.coverImageUrl && (
          <img src={project.coverImageUrl} className="w-full rounded-xl mb-8 object-cover max-h-[400px] shadow-lg border border-slate-700" />
        )}

        {/* 3. Descrição (Markdown) */}
        <div className="prose prose-invert max-w-none prose-img:rounded-xl prose-a:text-indigo-400 mb-10">
          <ReactMarkdown>{project.description}</ReactMarkdown>
        </div>

        {/* 4. ÁREA DE ESTUDO / QUIZ (MOVIDO PARA CÁ) */}
        {project.type === 'study' && hasQuizzes && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4 border-l-4 border-yellow-500 pl-3">
              🎓 Interactive Simulator
            </h2>

            {/* Abas de Navegação */}
            {project.quizzes && project.quizzes.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-0">
                {project.quizzes.map((quiz, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveQuizIndex(index)}
                    className={`px-4 py-2 rounded-t-lg text-sm font-bold transition border-b-0 ${
                      activeQuizIndex === index 
                        ? 'bg-white text-slate-900' 
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    📄 {quiz.fileName}
                  </button>
                ))}
              </div>
            )}

            {/* O Iframe */}
            <div className={`border-4 border-slate-700 overflow-hidden bg-white shadow-2xl ${project.quizzes && project.quizzes.length > 1 ? 'rounded-b-xl rounded-tr-xl' : 'rounded-xl'}`}>
              <div className="bg-slate-800 p-2 text-center text-xs text-slate-400 flex justify-between px-4">
                 <span>Preview Mode</span>
                 <span className="text-yellow-500 font-bold">
                    {project.quizzes && project.quizzes[activeQuizIndex]?.fileName}
                 </span>
              </div>

              <iframe 
                srcDoc={project.quizzes && project.quizzes[activeQuizIndex]?.content} 
                className="w-full h-[600px]"
                title="Study Simulation"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        )}

        {/* 5. Links Externos */}
        <div className="flex gap-4 mb-12 border-t border-slate-800 pt-8">
          {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noreferrer" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition border border-slate-700 font-bold flex items-center gap-2">
                <span>View Code on GitHub</span>
              </a>
          )}
          {project.itchioLink && (
              <a href={project.itchioLink} target="_blank" rel="noreferrer" className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition font-bold flex items-center gap-2">
                <span>Play on Itch.io</span>
              </a>
          )}
          
          {/* Botão de Editar (Admin) */}
          <a href={`/admin/edit/${project._id}`} className="ml-auto px-4 py-3 text-slate-500 hover:text-yellow-500 text-sm font-bold border border-transparent hover:border-yellow-500 rounded transition">
            ✏️ Edit Page
          </a>
        </div>
        
        {/* 6. Comentários */}
        <div className="mt-10">
           <h3 className="text-2xl font-bold mb-4">Comments</h3>
           <Giscus 
              repo="RobinCharles984/charlestudios-site-comments" 
              repoId="R_kgDOQaZIyg" 
              category="General" 
              categoryId="DIC_kwDOQaZIys4CyDV5" 
              mapping="pathname" 
              theme="dark" 
              lang="en" 
           />
        </div>
      </div>
    </div>
  );
}