import mongoose, { Schema, Document } from 'mongoose';

// Interface para o TypeScript (igual a do Front, praticamente)
export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  coverImageUrl?: string;
  githubLink?: string;
  itchioLink?: string;
  tags: string[];
  createdAt: Date;
}

// Schema para o Mongoose (Banco de Dados)
const ProjectSchema: Schema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // A URL amigável
  description: { type: String, required: true },
  coverImageUrl: { type: String },
  githubLink: { type: String },
  itchioLink: { type: String },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IProject>('Project', ProjectSchema);