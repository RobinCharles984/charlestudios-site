import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Giscus from '@giscus/react';
import axios from 'axios';
import type { IProject } from '../data/types';

export function ProjectDetails() {
  const { slug } = useParams();
  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 1. Estado para controlar qual aba do quiz está ativa (começa na primeira)
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    axios.get(`${API_URL}/projects/${slug}`)
      .then(res => { setProject(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="text-white p-10">Loading...</div>;
  if (!project) return <div className="text-white p-10">Not found!</div>;

  // Verifica se o projeto tem a nova estrutura de quizzes
  const hasQuizzes = project.quizzes && project.quizzes.length > 0;

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans pb-10">
      <div className="max-w-4xl mx-auto px-6 py-10">
        
        {/* Badge de Tipo */}
        <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${project.type === 'study' ? 'bg-yellow-600 text-yellow-100' : 'bg-indigo-600 text-indigo-100'}`}>
          {project.type}
        </span>

        <Link 
            to={`/admin/edit/${project._id}`} 
            className="text-xs text-slate-600 hover:text-yellow-500 border border-slate-800 hover:border-yellow-500 px-3 py-1 rounded transition">
            ✏️ Edit
        </Link>

        <h1 className="text-4xl font-bold mt-2 mb-6">{project.title}</h1>

        {/* --- ÁREA DE ESTUDO (PLAYER HTML MÚLTIPLO) --- */}
        {project.type === 'study' && hasQuizzes && (
          <div className="mb-10">
            
            {/* 2. Abas de Navegação (Só aparecem se tiver mais de 1 arquivo) */}
            {project.quizzes && project.quizzes.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-0">
                {project.quizzes.map((quiz, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveQuizIndex(index)}
                    className={`px-4 py-2 rounded-t-lg text-sm font-bold transition border-b-0 ${
                      activeQuizIndex === index 
                        ? 'bg-white text-slate-900' // Aba Ativa (Branca)
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700' // Aba Inativa (Escura)
                    }`}
                  >
                    📄 {quiz.fileName}
                  </button>
                ))}
              </div>
            )}

            {/* 3. O Iframe (Carrega o conteúdo do índice ativo) */}
            <div className={`border-4 border-slate-700 overflow-hidden bg-white ${project.quizzes && project.quizzes.length > 1 ? 'rounded-b-xl rounded-tr-xl' : 'rounded-xl'}`}>
              
              <div className="bg-slate-800 p-2 text-center text-xs text-slate-400 flex justify-between px-4">
                 <span>Simulator Preview</span>
                 {/* Mostra o nome do arquivo atual */}
                 <span className="text-yellow-500 font-bold">
                    {project.quizzes && project.quizzes[activeQuizIndex]?.fileName}
                 </span>
              </div>

              <iframe 
                // A Mágica: Pega o conteúdo HTML do quiz selecionado no array
                srcDoc={project.quizzes && project.quizzes[activeQuizIndex]?.content} 
                className="w-full h-[600px]"
                title="Study Simulation"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        )}

        {/* Capa (Se não tiver quiz, mostra a capa normal) */}
        {!hasQuizzes && project.coverImageUrl && (
          <img src={project.coverImageUrl} className="w-full rounded-xl mb-8 object-cover max-h-[400px]" />
        )}

        {/* Markdown Renderer */}
        <div className="prose prose-invert max-w-none prose-img:rounded-xl prose-a:text-indigo-400">
          <ReactMarkdown>{project.description}</ReactMarkdown>
        </div>

        {/* Links Externos */}
        <div className="flex gap-4 mt-8 mb-12">
          {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noreferrer" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition border border-slate-700 font-bold">
                View on GitHub
              </a>
          )}
          {project.itchioLink && (
              <a href={project.itchioLink} target="_blank" rel="noreferrer" className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition font-bold">
                Play on Itch.io
              </a>
          )}
        </div>
        
        <hr className="border-slate-800 my-8"/>

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