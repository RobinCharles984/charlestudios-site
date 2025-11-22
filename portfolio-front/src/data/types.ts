//Isto é o padrão que será enviado para o MongoDB
//Seguindo a mesma arquitetura tanto pro front quanto pro back

export interface IProject {
  _id: string; // MongoDB usa _id
  title: string;
  slug: string;
  description: string;
  coverImageUrl?: string;
  githubLink?: string;
  itchioLink?: string;
  createdAt?: string;
}