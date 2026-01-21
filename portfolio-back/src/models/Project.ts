import mongoose, { Schema, Document } from 'mongoose';

interface IQuizFile {
  fileName: string;
  content: string;
}

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  coverImageUrl?: string;
  githubLink?: string;
  itchioLink?: string;
  artstationLink?: string;
  tags: string[];
  createdAt: Date;
  
  // Mantenha os dois para compatibilidade
  type?: string;   // ⬅️ VOLTOU (Para ler os antigos)
  types: string[]; // ⬅️ NOVO (Para os novos)
  
  quizzes?: IQuizFile[];
  galleryImages?: string[];
}

const ProjectSchema: Schema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  coverImageUrl: { type: String },
  githubLink: { type: String },
  itchioLink: { type: String },
  artstationLink: { type: String },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  
  // 👇 AQUI ESTÁ O SEGREDO: Adicionamos o antigo de volta
  type: { type: String }, 
  
  // E mantemos o novo
  types: [{ type: String, enum: ['project', 'study', 'certificate'] }], 

  quizzes: [{
    fileName: { type: String, required: true },
    content: { type: String, required: true }
  }],
  galleryImages: [{ type: String }]
});

export default mongoose.model<IProject>('Project', ProjectSchema);