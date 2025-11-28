export interface IQuiz {
  fileName: string;
  content: string;
}

export interface IProject {
  _id: string;
  title: string;
  slug: string;
  description: string;
  coverImageUrl?: string;
  githubLink?: string;
  itchioLink?: string;
  createdAt?: string;
  type: 'project' | 'study';
  
  // ⚠️ Atualizado
  quizzes?: IQuiz[]; 
  
  galleryImages?: string[];
}