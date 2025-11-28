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
    coverImageUrl: '',
    adminSecret: '',
    type: 'project',       
    quizzes: [] as { fileName: string, content: string }[], // ✅ Lista de Quizzes
    galleryImages: [] as string[]
  });

  // Converte Imagem para Base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Lê arquivo HTML como Texto
  const readHtmlFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, field: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (field === 'cover') {
      const base64 = await convertToBase64(files[0]);
      setFormData(prev => ({ ...prev, coverImageUrl: base64 }));
    } 
    else if (field === 'html') {
      // ✅ Lógica Nova: Múltiplos Arquivos
      if (files.length > 10) {
        alert("Sensei, o limite é de 10 simulados por post!");
        return;
      }

      const newQuizzes: { fileName: string; content: string; }[] = [];
      
      // Loop para processar todos os arquivos selecionados
      for (let i = 0; i < files.length; i++) {
        const text = await readHtmlFile(files[i]);
        // Remove a extensão .html para o nome ficar limpo
        const cleanName = files[i].name.replace('.html', ''); 
        newQuizzes.push({ fileName: cleanName, content: text });
      }

      setFormData(prev => ({ ...prev, quizzes: newQuizzes }));
    }
    else if (field === 'gallery') {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const base64 = await convertToBase64(files[i]);
        newImages.push(base64);
      }
      setFormData(prev => ({ ...prev, galleryImages: [...prev.galleryImages, ...newImages] }));
    }
  };

  const handleChange = (e: any) => {
     const { name, value } = e.target;
     if (name === 'title') {
        const slug = value.toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9 ]/g, '')
          .replace(/\s+/g, '-')
          .replace(/^-+|-+$/g, '');
        setFormData(prev => ({...prev, title: value, slug}));
     } else {
        setFormData(prev => ({...prev, [name]: value}));
     }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ Envia o objeto completo (agora com quizzes array)
      await axios.post(`${import.meta.env.VITE_API_URL}/projects`, formData, {
         headers: { 'x-admin-secret': formData.adminSecret }
      });
      alert('Content published!');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Error publishing. Check admin key or file size.');
    } finally { setLoading(false); }
  };

  const inputStyle = "w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none";

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12 px-6 flex justify-center">
      <div className="max-w-3xl w-full bg-slate-800 p-8 rounded-2xl border border-slate-700">
        
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">New Content</h1>
            <Link to="/" className="text-slate-400 hover:text-white text-sm">← Back</Link>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SELEÇÃO DE TIPO */}
          <div>
             <label className="block text-sm text-slate-400 mb-1">Type</label>
             <select name="type" value={formData.type} onChange={handleChange} className={inputStyle}>
                <option value="project">🚀 Project</option>
                <option value="study">📚 Study / Quiz</option>
             </select>
          </div>

          {/* Título e Slug */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm text-slate-400 mb-1">Title</label>
                <input name="title" placeholder="Ex: Math Final Exam" value={formData.title} onChange={handleChange} className={inputStyle} required />
            </div>
            <div>
                <label className="block text-sm text-slate-400 mb-1">Slug</label>
                <input name="slug" value={formData.slug} readOnly className={`${inputStyle} text-slate-500 cursor-not-allowed`} />
            </div>
          </div>

          {/* MARKDOWN DESCRIPTION */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">Description (Markdown Supported)</label>
            <textarea name="description" placeholder="# Introduction&#10;This study covers..." value={formData.description} onChange={handleChange} rows={8} className={inputStyle} required />
          </div>

          {/* GALERIA DE IMAGENS */}
          <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
            <label className="block text-sm text-indigo-400 font-bold mb-2">📸 Gallery (For Markdown)</label>
            <input type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e, 'gallery')} className="block w-full text-sm text-slate-400"/>
            
            {formData.galleryImages.length > 0 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {formData.galleryImages.map((img, idx) => (
                  <div key={idx} className="min-w-[100px] text-center">
                    <img src={img} className="h-16 w-16 object-cover rounded mx-auto border border-slate-600"/>
                    <button type="button" onClick={() => navigator.clipboard.writeText(`![Img](${img})`)} className="text-[10px] bg-slate-700 px-2 py-1 rounded mt-1 hover:bg-indigo-600 w-full transition">
                       Copy MD
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* UPLOAD DE QUIZZES (Só aparece se for Study) */}
          {formData.type === 'study' && (
             <div className="bg-yellow-900/20 p-4 rounded border border-yellow-700/50">
                <label className="block text-sm text-yellow-400 font-bold mb-2">📝 Upload Quizzes (.html) - Max 10</label>
                <input 
                    type="file" 
                    accept=".html" 
                    multiple  // ✅ Permite múltiplos arquivos
                    onChange={(e) => handleFileUpload(e, 'html')} 
                    className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-600 file:text-white hover:file:bg-yellow-700"
                />
                
                {/* Lista os arquivos carregados */}
                {formData.quizzes.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {formData.quizzes.map((q, idx) => (
                            <span key={idx} className="bg-yellow-800/80 text-yellow-100 text-xs px-3 py-1 rounded-full border border-yellow-600 flex items-center gap-2">
                                📄 {q.fileName}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-yellow-700 text-xs mt-2 italic">No files selected yet.</p>
                )}
             </div>
          )}

          {/* Capa e Links */}
          <div>
            <label className="block text-sm text-slate-400 mb-1">Cover Image (Optional)</label>
            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} className="text-slate-400 text-sm"/>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
             <div>
                <label className="block text-sm text-slate-400 mb-1">GitHub Link</label>
                <input name="githubLink" placeholder="https://..." value={formData.githubLink} onChange={handleChange} className={inputStyle} />
             </div>
             <div>
                <label className="block text-sm text-slate-400 mb-1">Itch.io Link</label>
                <input name="itchioLink" placeholder="https://..." value={formData.itchioLink} onChange={handleChange} className={inputStyle} />
             </div>
          </div>

          <div className="bg-red-900/20 p-4 rounded border border-red-900/50">
             <label className="block text-sm text-red-400 font-bold mb-1">Admin Key</label>
             <input type="password" name="adminSecret" placeholder="Master Password" value={formData.adminSecret} onChange={handleChange} className="w-full bg-slate-900 border border-red-900/50 rounded-lg p-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-red-500 outline-none" required />
          </div>
          
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-3 rounded text-white font-bold hover:from-indigo-500 hover:to-purple-500 shadow-lg transform transition hover:scale-[1.01]">
             {loading ? 'Publishing...' : '🚀 Publish Content'}
          </button>
        </form>
      </div>
    </div>
  );
}