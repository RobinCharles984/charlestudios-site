import { useState, type FormEvent, type ChangeEvent } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export function CreateProject() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    githubLink: '',
    itchioLink: '',
    artstationLink: '', // ✨ Novo
    coverImageUrl: '',
    adminSecret: '',
    types: ['project'] as string[], // 🔄 Array inicial
    quizzes: [] as { fileName: string, content: string }[],
    galleryImages: [] as string[]
  });

  // ... (Mantenha as funções convertToBase64 e readHtmlFile iguais) ...
  const convertToBase64 = (file: File): Promise<string> => {
     return new Promise((resolve, reject) => {
       const reader = new FileReader();
       reader.readAsDataURL(file);
       reader.onload = () => resolve(reader.result as string);
       reader.onerror = error => reject(error);
     });
   };
 
   const readHtmlFile = (file: File): Promise<string> => {
     return new Promise((resolve, reject) => {
       const reader = new FileReader();
       reader.readAsText(file);
       reader.onload = () => resolve(reader.result as string);
       reader.onerror = error => reject(error);
     });
   };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, field: string) => {
      // ... (Mantenha igual ao anterior, a lógica de upload não muda) ...
      // Só vou copiar a estrutura para você saber onde fica
      const files = e.target.files;
      if (!files || files.length === 0) return;

      if (field === 'cover') {
        const base64 = await convertToBase64(files[0]);
        setFormData(prev => ({ ...prev, coverImageUrl: base64 }));
      } else if (field === 'html') {
          // ... logica do quiz igual ...
          const newQuizzes = [...formData.quizzes];
          for (let i = 0; i < files.length; i++) {
            const text = await readHtmlFile(files[i]);
            newQuizzes.push({ fileName: files[i].name.replace('.html', ''), content: text });
          }
          setFormData(prev => ({ ...prev, quizzes: newQuizzes }));
      } else if (field === 'gallery') {
         // ... logica da galeria igual ...
         const newImages: string[] = [];
         for (let i = 0; i < files.length; i++) {
             const base64 = await convertToBase64(files[i]);
             newImages.push(base64);
         }
         setFormData(prev => ({ ...prev, galleryImages: [...prev.galleryImages, ...newImages] }));
      }
  };

  // 🔄 NOVA LÓGICA DE CHECKBOX PARA TIPOS
  const handleTypeChange = (type: string) => {
    setFormData(prev => {
        const currentTypes = prev.types;
        if (currentTypes.includes(type)) {
            // Se já tem, remove (mas impede de ficar vazio)
            if (currentTypes.length === 1) return prev;
            return { ...prev, types: currentTypes.filter(t => t !== type) };
        } else {
            // Se não tem, adiciona
            return { ...prev, types: [...currentTypes, type] };
        }
    });
  };

  const handleChange = (e: any) => {
     const { name, value } = e.target;
     if (name === 'title') {
        const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        setFormData(prev => ({...prev, title: value, slug}));
     } else {
        setFormData(prev => ({...prev, [name]: value}));
     }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/projects`, formData, {
         headers: { 'x-admin-secret': formData.adminSecret }
      });
      alert('Content published!');
      navigate('/');
    } catch (error) {
      alert('Error publishing.');
    } finally { setLoading(false); }
  };

  const inputStyle = "w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none";

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12 px-6 flex justify-center">
      <div className="max-w-3xl w-full bg-slate-800 p-8 rounded-2xl border border-slate-700">
        <h1 className="text-3xl font-bold mb-6">New Content</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 🔄 SELEÇÃO DE TIPOS (CHECKBOXES) */}
          <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
             <label className="block text-sm text-slate-400 mb-3">Categories (Select at least one)</label>
             <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.types.includes('project')} onChange={() => handleTypeChange('project')} className="w-5 h-5 accent-indigo-500"/>
                    <span className="font-bold text-indigo-400">🚀 Project</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.types.includes('study')} onChange={() => handleTypeChange('study')} className="w-5 h-5 accent-yellow-500"/>
                    <span className="font-bold text-yellow-400">📚 Study / Quiz</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.types.includes('certificate')} onChange={() => handleTypeChange('certificate')} className="w-5 h-5 accent-green-500"/>
                    <span className="font-bold text-green-400">🏆 Certificate</span>
                </label>
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} className={inputStyle} required />
            <input name="slug" placeholder="slug" value={formData.slug} readOnly className={inputStyle} />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Description (Markdown)</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={8} className={inputStyle} required />
          </div>

          {/* ... Uploads de Galeria (Igual) ... */}
          <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
             <label className="block text-sm text-indigo-400 font-bold mb-2">📸 Gallery</label>
             <input type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e, 'gallery')} className="block w-full text-sm text-slate-400"/>
             {/* ... preview images ... */}
          </div>

          {/* Upload de HTML (Só se for STUDY) */}
          {formData.types.includes('study') && (
             <div className="bg-yellow-900/20 p-4 rounded border border-yellow-700/50">
                <label className="block text-sm text-yellow-400 font-bold mb-2">📝 Upload Quizzes</label>
                <input type="file" accept=".html" multiple onChange={(e) => handleFileUpload(e, 'html')} className="block w-full text-sm text-slate-400"/>
                {/* ... lista de quizzes ... */}
             </div>
          )}

          {/* Capa */}
          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} className="text-slate-400"/>
          
          {/* ✨ LINKS (AGORA COM ARTSTATION) */}
          <div className="grid md:grid-cols-3 gap-4">
             <input name="githubLink" placeholder="GitHub URL" value={formData.githubLink} onChange={handleChange} className={inputStyle} />
             <input name="itchioLink" placeholder="Itch.io URL" value={formData.itchioLink} onChange={handleChange} className={inputStyle} />
             <input name="artstationLink" placeholder="ArtStation URL" value={formData.artstationLink} onChange={handleChange} className={`${inputStyle} border-blue-900 focus:ring-blue-500`} />
          </div>

          <input type="password" name="adminSecret" placeholder="Admin Key" value={formData.adminSecret} onChange={handleChange} className={inputStyle} required />
          
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 py-3 rounded text-white font-bold hover:bg-indigo-500">
             {loading ? 'Sending...' : 'Publish'}
          </button>
        </form>
      </div>
    </div>
  );
}