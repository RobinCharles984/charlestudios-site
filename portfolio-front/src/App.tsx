// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { ProjectDetails } from './pages/ProjectDetails';
import { CreateProject } from './pages/CreateProject';
import { EditProject } from './pages/EditProject';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota da Home */}
        <Route path="/" element={<Home />} />
        
        {/* Rota de Detalhes (slug) */}
        <Route path="/project/:slug" element={<ProjectDetails />} />
        
        {/* Rotas de Admin */}
        <Route path="/admin/new" element={<CreateProject />} />
        <Route path="/admin/edit/:id" element={<EditProject />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;