import { useState, FormEvent, ChangeEvent } from 'react';
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
    coverImageUrl: '', // Aqui vai entrar a URL ou o Base64 da imagem
    adminSecret: ''
  });

  // --- Função Mágica: Converte Arquivo para Base64 ---
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result as string);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  // Lida com o Upload de Arquivo
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setFormData(prev => ({ ...prev, coverImageUrl: base64 }));
      } catch (error) {
        console.error("Erro ao converter imagem", error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'title') {
      const autoSlug = value
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '');

      setFormData(prev => ({ ...prev, title: value, slug: autoSlug }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      await axios.post(`${API_URL}/projects`, {
        ...formData
      }, {
        headers: {
          'x-admin-secret': formData.adminSecret
        }
      });

      alert('Project created successfully, Sensei!');
      navigate('/'); 
    } catch (error) {
      alert('Error! Check your password, image size, or if slug exists.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = "block text-sm font-medium text-slate-400 mb-1";
  const inputStyle = "w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200";

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12 px-6 font-sans flex items-center justify-center">
      <div className="max-w-3xl w-full bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
            New Project
          </h1>
          <Link to="/" className="text-slate-400 hover:text-white transition text-sm">
            ← Back to Home
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Project Title</label>
              <input name="title" placeholder="Ex: Super 2D Game" value={formData.title} onChange={handleChange} required className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Slug (Friendly URL)</label>
              <input name="slug" value={formData.slug} readOnly className={`${inputStyle} text-slate-400 bg-slate-950 cursor-not-allowed`} />
            </div>
          </div>

          <div>
            <label className={labelStyle}>Description</label>
            <textarea name="description" placeholder="Description..." value={formData.description} onChange={handleChange} required rows={5} className={inputStyle} />
          </div>

          {/* --- SEÇÃO DA IMAGEM (ATUALIZADA) --- */}
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
            <label className={labelStyle}>Cover Image</label>
            
            {/* Opção 1: Upload */}
            <div className="mb-3">
              <span className="text-xs text-indigo-400 uppercase font-bold mb-2 block">Option A: Upload File</span>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileUpload}
                className="block w-full text-sm text-slate-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-600 file:text-white
                  hover:file:bg-indigo-700
                  cursor-pointer"
              />
            </div>

            <div className="text-center text-slate-600 text-xs my-2">- OR -</div>

            {/* Opção 2: Link URL */}
            <div className="mb-3">
              <span className="text-xs text-indigo-400 uppercase font-bold mb-2 block">Option B: Image URL</span>
              <input 
                name="coverImageUrl" 
                placeholder="https://..." 
                value={formData.coverImageUrl} 
                onChange={handleChange} 
                className={inputStyle}
              />
            </div>

            {/* Preview */}
            {formData.coverImageUrl && (
              <div className="mt-4 h-48 w-full rounded-lg overflow-hidden bg-slate-950 border border-slate-600 relative">
                <img src={formData.coverImageUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">Preview</div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>GitHub Link</label>
              <input name="githubLink" placeholder="https://..." value={formData.githubLink} onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Itch.io Link</label>
              <input name="itchioLink" placeholder="https://..." value={formData.itchioLink} onChange={handleChange} className={inputStyle} />
            </div>
          </div>

          <hr className="border-slate-700 my-6" />
          
          <div className="bg-red-900/20 p-4 rounded-lg border border-red-900/50">
            <label className="block text-sm font-bold text-red-400 mb-1">Admin Key</label>
            <input type="password" name="adminSecret" placeholder="Master Password" value={formData.adminSecret} onChange={handleChange} required className="w-full bg-slate-900 border border-red-900/50 rounded-lg p-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-red-500 outline-none transition" />
          </div>

          <button type="submit" disabled={loading} className={`w-full py-4 rounded-lg font-bold text-lg shadow-lg transform transition hover:scale-[1.01] ${loading ? 'bg-slate-700 cursor-wait text-slate-400' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'}`}>
            {loading ? 'Publishing...' : '🚀 Publish Project'}
          </button>

        </form>
      </div>
    </div>
  );
}