import mongoose, { Schema, Document } from 'mongoose';

// Definindo a estrutura de um Quiz individual
interface IQuizFile {
  fileName: string; // Nome do arquivo para aparecer no botão (ex: "Prova_01.html")
  content: string;  // O código HTML
}

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  coverImageUrl?: string;
  githubLink?: string;
  itchioLink?: string;
  tags: string[];
  createdAt: Date;
  type: 'project' | 'study';
  
  // ⚠️ MUDANÇA AQUI: Array de Quizzes em vez de string única
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
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  type: { type: String, default: 'project', enum: ['project', 'study'] },
  
  // ⚠️ NOVO SCHEMA NO BANCO
  quizzes: [{
    fileName: { type: String, required: true },
    content: { type: String, required: true }
  }],
  
  galleryImages: [{ type: String }]
});

export default mongoose.model<IProject>('Project', ProjectSchema);