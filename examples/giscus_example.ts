import Giscus from '@giscus/react';

export const CommentsSection = () => {
  return (
    <Giscus
      id="comments"
      repo="SEU_USUARIO/SEU_REPO_DE_COMENTARIOS"
      repoId="ID_DO_REPO"
      category="General"
      categoryId="ID_DA_CATEGORIA"
      mapping="pathname" // Isso mapeia a URL do site (o slug) à discussão
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme="dark"
      lang="pt"
      loading="lazy"
    />
  );
};