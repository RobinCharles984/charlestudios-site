// src/server.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Project from './models/Project';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors()); // Permite que o React acesse este servidor

//Import de imagem limitada à 50mb
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- ROTAS ---

// 1. GET - Listar todos os projetos
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }); // Mais recentes primeiro
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar projetos' });
  }
});

// 2. GET - Pegar detalhes de UM projeto pelo Slug
app.get('/api/projects/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) return res.status(404).json({ message: 'Projeto não encontrado' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar projeto' });
  }
});

// 3. POST - Criar um novo projeto (AGORA PROTEGIDO)
app.post('/api/projects', async (req, res) => {
  // Verifica a senha enviada no cabeçalho da requisição
  const adminSecret = req.headers['x-admin-secret'];
  
  if (adminSecret !== process.env.ADMIN_SECRET) {
     return res.status(403).json({ message: 'Sai daqui, impostor! Senha errada.' });
  }

  try {
    // ... (o resto do código continua igual)
    const { title, slug, description, githubLink, itchioLink, coverImageUrl } = req.body;
    
    const newProject = new Project({
      title,
      slug,
      description,
      githubLink,
      itchioLink,
      coverImageUrl
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar projeto', error });
  }
});

// 4. PUT - Atualizar um projeto existente
app.put('/api/projects/:id', async (req, res) => {
  const adminSecret = req.headers['x-admin-secret'];
  if (adminSecret !== process.env.ADMIN_SECRET) {
     return res.status(403).json({ message: 'Senha errada, impostor!' });
  }

  try {
    // Atualiza e retorna o objeto novo
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } // Importante: Retorna o dado atualizado, não o antigo
    );
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar', error });
  }
});

// 5. DELETE - Excluir um projeto
app.delete('/api/projects/:id', async (req, res) => {
  const adminSecret = req.headers['x-admin-secret'];
  if (adminSecret !== process.env.ADMIN_SECRET) {
     return res.status(403).json({ message: 'Senha errada, impostor!' });
  }

  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Projeto deletado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar', error });
  }
});

// --- CONEXÃO COM O BANCO E START ---

// Se não tiver string de conexão, avisa
const MONGO_URI = process.env.MONGO_URI || '';

if (!MONGO_URI) {
  console.error("❌ ERRO: Variável MONGO_URI não definida no .env");
} else {
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('✅ Conectado ao MongoDB');
      app.listen(PORT, () => console.log(`🔥 Servidor rodando na porta ${PORT}`));
    })
    .catch((err) => console.error('❌ Erro ao conectar no MongoDB:', err));
}