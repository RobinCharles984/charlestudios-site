import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import type { IProject } from '../data/types';

export function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '', slug: '', description: '', githubLink: '', itchioLink: '', artstationLink: '', 
    coverImageUrl: '', adminSecret: '',
    types: [] as string[],
    quizzes: [] as { fileName: string, content: string }[],
    galleryImages: [] as string[]
  });

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/projects`) 
      .then(res => {
         const found = res.data.find((p: IProject) => p._id === id);
         if (found) {
            setFormData({
               ...found,
               adminSecret: '',
               types: found.types || (found.type ? [found.type] : ['project']),
               galleryImages: found.galleryImages || [],
               quizzes: found.quizzes || [],
               githubLink: found.githubLink || '',
               itchioLink: found.itchioLink || '',
               artstationLink: found.artstationLink || '', 
               coverImageUrl: found.coverImageUrl || ''
            });
         } else { alert('Not found!'); navigate('/'); }
         setLoading(false);
      })
      .catch(() => { navigate('/'); });
  }, [id, navigate]);

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
      const files = e.target.files;
      if (!files || files.length === 0) return;
      if (field === 'cover') {
        const base64 = await convertToBase64(files[0]);
        setFormData(prev => ({ ...prev, coverImageUrl: base64 }));
      } else if (field === 'html') {
          const newQuizzes = [...formData.quizzes]; 
          for (let i = 0; i < files.length; i++) {
              const text = await readHtmlFile(files[i]);
              newQuizzes.push({ fileName: files[i].name.replace('.html', ''), content: text });
          }
          setFormData(prev => ({ ...prev, quizzes: newQuizzes }));
      } else if (field === 'gallery') {
          const newImages: string[] = [];
          for (let i = 0; i < files.length; i++) {
            const base64 = await convertToBase64(files[i]);
            newImages.push(base64);
          }
          setFormData(prev => ({ ...prev, galleryImages: [...prev.galleryImages, ...newImages] }));
      }
  };

  const removeQuiz = (index: number) => {
      const newQuizzes = formData.quizzes.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, quizzes: newQuizzes }));
  };

  const removeGalleryImage = (index: number) => {
      const newImages = formData.galleryImages.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, galleryImages: newImages }));
  };

  const handleDelete = async () => {
     if (!window.confirm("TEM CERTEZA? Isso vai apagar para sempre!")) return;
     const secret = prompt("Confirme a senha de admin para deletar:");
     if (!secret) return;
     try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/projects/${id}`, { headers: { 'x-admin-secret': secret } });
        alert('Deletado.'); navigate('/');
     } catch (error) { alert('Erro ao deletar.'); }
  };

  const handleTypeChange = (type: string) => {
    setFormData(prev => {
        const currentTypes = prev.types;
        if (currentTypes.includes(type)) {
            if (currentTypes.length === 1) return prev;
            return { ...prev, types: currentTypes.filter(t => t !== type) };
        } else {
            return { ...prev, types: [...currentTypes, type] };
        }
    });
  };

  const handleChange = (e: any) => {
      const { name, value } = e.target;
      setFormData(prev => ({...prev, [name]: value}));
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/projects/${id}`, formData, { headers: { 'x-admin-secret': formData.adminSecret } });
      alert('Atualizado!'); navigate('/');
    } catch (error) { alert('Erro ao atualizar.'); }
  };

  const inputStyle = "w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-yellow-500 outline-none";
  if (loading) return <div className="text-white p-10 text-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12 px-6 flex justify-center">
      <div className="max-w-3xl w-full bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl">
        <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
            <div><h1 className="text-3xl font-bold text-yellow-500">Edit Project</h1><p className="text-slate-400 text-sm">Editing: {formData.title}</p></div>
            <button onClick={handleDelete} className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded hover:bg-red-900 font-bold text-sm">🗑️ DELETE</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
                <label className="block text-sm text-slate-400 mb-3">Categories</label>
                <div className="flex gap-6">
                    {['project', 'study', 'certificate'].map(type => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer capitalize">
                            <input type="checkbox" checked={formData.types.includes(type)} onChange={() => handleTypeChange(type)} className={`w-5 h-5 accent-${type === 'study' ? 'yellow' : type === 'certificate' ? 'green' : 'indigo'}-500`}/>
                            <span className={`font-bold text-${type === 'study' ? 'yellow' : type === 'certificate' ? 'green' : 'indigo'}-400`}>{type}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <input name="title" value={formData.title} onChange={handleChange} className={inputStyle} required placeholder="Title" />
                <input name="slug" value={formData.slug} onChange={handleChange} className={inputStyle} placeholder="Slug" />
            </div>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={8} className={inputStyle} required placeholder="Markdown Description" />

            <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
                <label className="block text-sm text-indigo-400 font-bold mb-2">📸 Gallery</label>
                <input type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e, 'gallery')} className="block w-full text-sm text-slate-400 mb-4"/>
                {formData.galleryImages.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {formData.galleryImages.map((img, idx) => (
                    <div key={idx} className="min-w-[100px] relative group"><img src={img} className="h-16 w-16 object-cover rounded border border-slate-600"/>
                        <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100">×</button>
                    </div>))}
                </div>)}
            </div>

            {formData.types.includes('study') && (
                <div className="bg-yellow-900/20 p-4 rounded border border-yellow-700/50">
                    <label className="block text-sm text-yellow-400 font-bold mb-2">📝 Quizzes (.html)</label>
                    <input type="file" accept=".html" multiple onChange={(e) => handleFileUpload(e, 'html')} className="block w-full text-sm text-slate-400 mb-4"/>
                    {formData.quizzes.length > 0 && (<div className="flex flex-wrap gap-2">{formData.quizzes.map((q, idx) => (
                        <div key={idx} className="bg-yellow-800/80 text-yellow-100 text-xs px-3 py-1 rounded-full border border-yellow-600 flex items-center gap-2">
                            <span>📄 {q.fileName}</span><button type="button" onClick={() => removeQuiz(idx)} className="text-red-300 font-bold ml-1">×</button>
                        </div>))}</div>)}
                </div>
            )}
            <div className="flex gap-4 items-center"><input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} className="text-slate-400 text-sm"/>{formData.coverImageUrl && <img src={formData.coverImageUrl} className="w-10 h-10 rounded"/>}</div>
            <div className="grid md:grid-cols-3 gap-4">
                <input name="githubLink" placeholder="GitHub" value={formData.githubLink} onChange={handleChange} className={inputStyle} />
                <input name="itchioLink" placeholder="Itch.io" value={formData.itchioLink} onChange={handleChange} className={inputStyle} />
                <input name="artstationLink" placeholder="ArtStation" value={formData.artstationLink} onChange={handleChange} className={`${inputStyle} border-blue-900`} />
            </div>
            <input type="password" name="adminSecret" placeholder="Admin Key" value={formData.adminSecret} onChange={handleChange} className={inputStyle} required />
            <div className="flex gap-4 pt-4">
                <Link to="/" className="w-1/3 py-3 rounded-lg text-center border border-slate-600 text-slate-400 hover:bg-slate-800 font-bold">Cancel</Link>
                <button type="submit" className="w-2/3 bg-yellow-600 py-3 rounded-lg text-white font-bold hover:bg-yellow-500 shadow-lg">💾 Save Changes</button>
            </div>
        </form>
      </div>
    </div>
  );
}