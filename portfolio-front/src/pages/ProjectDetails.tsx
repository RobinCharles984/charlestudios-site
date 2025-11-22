import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Giscus from '@giscus/react';
import axios from 'axios';
import type { IProject } from '../data/types';

export function ProjectDetails() {
  const { slug } = useParams();
  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    axios.get(`${API_URL}/projects/${slug}`)
      .then(response => {
        setProject(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching project:", error);
        setLoading(false);
      });
  }, [slug]);

  // Estilo para o fundo da página (para não ficar branco se o texto for pequeno)
  const pageStyle = "min-h-screen bg-slate-900 text-white font-sans";

  if (loading) return <div className={pageStyle + " p-10"}>Loading details...</div>;
  if (!project) return <div className={pageStyle + " p-10"}><h2>Project not found! 😢</h2></div>;

  return (
    <div className={pageStyle}>
      <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
        
        {/* --- Header --- */}
        <h1 className="text-4xl font-bold mb-4 text-indigo-400">{project.title}</h1>
        
        {project.coverImageUrl && (
          <img src={project.coverImageUrl} alt={project.title} className="w-full rounded-xl mb-6 shadow-2xl border border-slate-700" />
        )}

        <div className="prose prose-invert max-w-none text-slate-300 mb-8">
           {/* Aqui você poderia usar um Markdown Renderer no futuro */}
           <p className="whitespace-pre-wrap">{project.description}</p>
        </div>

        {/* --- Links --- */}
        <div className="flex gap-4 mb-12">
          {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noreferrer" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition flex items-center gap-2 border border-slate-700">
                <span>View on GitHub</span>
              </a>
          )}
          {project.itchioLink && (
              <a href={project.itchioLink} target="_blank" rel="noreferrer" className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition flex items-center gap-2">
                <span>Play on Itch.io</span>
              </a>
          )}
        </div>

        <hr className="border-slate-700 mb-8" />

        {/* --- Comments --- */}
        <h3 className="text-2xl font-bold mb-6">Comments</h3>
        <Giscus
          id="comments"
          repo="RobinCharles984/charlestudios-site-comments" // SEU REPO
          repoId="R_kgDOQaZIyg" // SEU ID
          category="General"
          categoryId="DIC_kwDOQaZIys4CyDV5" // SEU ID
          mapping="pathname" 
          strict="0"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme="dark" // Tema Escuro
          lang="en"    // IDIOMA INGLÊS
        />
      </div>
    </div>
  );
}