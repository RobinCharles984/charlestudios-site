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
  artstationLink?: string; // ✨
  createdAt?: string;
  
  // 🔄 Agora é array
  types: string[]; // ex: ['project', 'study']
  
  quizzes?: IQuiz[]; 
  galleryImages?: string[];
}