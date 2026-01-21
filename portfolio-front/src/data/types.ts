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
  artstationLink?: string;
  createdAt?: string;
  types: string[]; // Array obrigatório
  quizzes?: IQuiz[]; 
  galleryImages?: string[];
}