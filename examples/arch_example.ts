// types.ts (compartilhado mentalmente entre front e back)

export interface IProject {
  id?: string;           // Gerado pelo Banco de Dados
  title: string;         // Ex: "Super Mario Clone"
  description: string;   // Ex: "Um clone feito em Unity..."
  coverImageUrl: string; // URL da imagem
  githubLink?: string;   // Opcional
  itchioLink?: string;   // Opcional
  tags: string[];        // Ex: ["Unity", "C#", "2D"]
  slug: string;          // Identificador único para a URL (ex: super-mario-clone) -> importante para o giscus
}