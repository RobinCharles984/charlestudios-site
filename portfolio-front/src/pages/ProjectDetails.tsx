import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Giscus from '@giscus/react';
import axios from 'axios';
import remarkGfm from 'remark-gfm'; // Se não instalou, remova essa linha e a propriedade remarkPlugins lá embaixo
import type { IProject } from '../data/types';

export function ProjectDetails() {
  const { slug } = useParams();
  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    axios.get(`${API_URL}/projects/${slug}`)
      .then(res => { 
        const data = res.data;
        // Normalização de segurança
        if (!data.types) {
           data.types = data.type ? [data.type] : ['project'];
        }
        setProject(data); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="text-white p-10">Loading...</div>;
  if (!project) return <div className="text-white p-10">Not found!</div>;

  const hasQuizzes = project.quizzes && project.quizzes.length > 0;
  const isStudy = project.types.includes('study'); 

  // 🎨 ESTILIZAÇÃO CUSTOMIZADA (Estilo GitHub)
  const markdownComponents = {
    // Títulos com borda embaixo e espaçamento
    h1: (props: any) => <h1 className="text-3xl font-bold border-b border-slate-700 pb-2 mb-6 mt-10 text-white" {...props} />,
    h2: (props: any) => <h2 className="text-2xl font-bold border-b border-slate-700 pb-2 mb-4 mt-8 text-white" {...props} />,
    h3: (props: any) => <h3 className="text-xl font-bold mb-3 mt-6 text-white" {...props} />,
    
    // Parágrafos com respiro
    p: (props: any) => <p className="mb-4 leading-7 text-slate-300 text-justify" {...props} />,
    
    // Listas com bolinhas/números e INDENTAÇÃO CORRETA
    ul: (props: any) => <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-300 marker:text-indigo-500" {...props} />,
    ol: (props: any) => <ol className="list-decimal pl-6 mb-4 space-y-2 text-slate-300 marker:text-indigo-500" {...props} />,
    li: (props: any) => <li className="pl-1" {...props} />,
    
    // Citações (Blockquotes)
    blockquote: (props: any) => <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 my-6 italic text-slate-400 bg-slate-800/30 rounded-r" {...props} />,
    
    // Código (Inline e Bloco)
    code: ({inline, className, children, ...props}: any) => {
      return inline ? (
        <code className="bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded text-sm font-mono border border-slate-700" {...props}>{children}</code>
      ) : (
        <pre className="bg-[#0d1117] p-4 rounded-lg overflow-x-auto border border-slate-700 my-6 shadow-md">
          <code className="text-sm font-mono text-slate-200" {...props}>{children}</code>
        </pre>
      )
    },
    
    // Links e Imagens
    a: (props: any) => <a className="text-indigo-400 hover:text-indigo-300 hover:underline font-medium decoration-2 underline-offset-2" target="_blank" rel="noopener noreferrer" {...props} />,
    img: (props: any) => <img className="rounded-lg shadow-lg border border-slate-700 my-8 w-full max-h-[600px] object-cover" {...props} />,
    
    // Tabelas (Se usar remark-gfm)
    table: (props: any) => <div className="overflow-x-auto my-6"><table className="min-w-full text-left border-collapse border border-slate-700" {...props} /></div>,
    th: (props: any) => <th className="bg-slate-800 border border-slate-700 px-4 py-2 font-bold text-white" {...props} />,
    td: (props: any) => <td className="border border-slate-700 px-4 py-2 text-slate-300" {...props} />,
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans pb-10">
      <div className="max-w-4xl mx-auto px-6 py-10">
        
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-8 text-sm font-bold group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Home
        </Link>

        <div>
            {/* Badges */}
            <div className="flex gap-2 mb-4">
              {project.types.map(t => (
                <span key={t} className={`px-3 py-1 rounded text-xs font-bold uppercase ${
                  t === 'study' ? 'bg-yellow-600 text-yellow-100' : 
                  t === 'certificate' ? 'bg-green-600 text-green-100' :
                  'bg-indigo-600 text-indigo-100'
                }`}>
                  {t}
                </span>
              ))}
            </div>

            <h1 className="text-4xl font-bold mt-2 mb-6">{project.title}</h1>

            {project.coverImageUrl && (
              <img src={project.coverImageUrl} className="w-full rounded-xl mb-8 object-cover max-h-[400px] shadow-lg border border-slate-700" />
            )}

            {/* 🔥 MARKDOWN RENDERIZADO COM ESTILO GITHUB 🔥 */}
            <div className="mb-16">
              <ReactMarkdown 
                components={markdownComponents} 
                remarkPlugins={[remarkGfm]} // Remova se não instalou o pacote
              >
                {project.description}
              </ReactMarkdown>
            </div>

            {/* Simulador (Apenas para Estudos) */}
            {isStudy && hasQuizzes && (
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4 border-l-4 border-yellow-500 pl-3">🎓 Interactive Simulator</h2>
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
                <div className={`border-4 border-slate-700 overflow-hidden bg-white shadow-2xl ${project.quizzes && project.quizzes.length > 1 ? 'rounded-b-xl rounded-tr-xl' : 'rounded-xl'}`}>
                  <div className="bg-slate-800 p-2 text-center text-xs text-slate-400 flex justify-between px-4">
                      <span>Preview Mode</span>
                      <span className="text-yellow-500 font-bold">{project.quizzes && project.quizzes[activeQuizIndex]?.fileName}</span>
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

            <div className="flex flex-wrap gap-4 mb-12 border-t border-slate-800 pt-8">
              {project.githubLink && (
                  <a href={project.githubLink} target="_blank" rel="noreferrer" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition border border-slate-700 font-bold flex items-center gap-2">GitHub</a>
              )}
              {project.itchioLink && (
                  <a href={project.itchioLink} target="_blank" rel="noreferrer" className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition font-bold flex items-center gap-2">Itch.io</a>
              )}
              {project.artstationLink && (
                  <a href={project.artstationLink} target="_blank" rel="noreferrer" className="px-6 py-3 bg-[#13aff0] hover:bg-[#0b92cc] rounded-lg transition font-bold flex items-center gap-2 text-white">🎨 ArtStation</a>
              )}
              <Link to={`/admin/edit/${project._id}`} className="ml-auto px-4 py-3 text-slate-500 hover:text-yellow-500 text-sm font-bold border border-transparent hover:border-yellow-500 rounded transition">✏️ Edit Page</Link>
            </div>
            
            <div className="mt-10">
              <h3 className="text-2xl font-bold mb-4">Comments</h3>
              <Giscus repo="RobinCharles984/charlestudios-site-comments" repoId="R_kgDOQaZIyg" category="General" categoryId="DIC_kwDOQaZIys4CyDV5" mapping="pathname" theme="dark" lang="en" />
            </div>
        </div>
      </div>
    </div>
  );
}