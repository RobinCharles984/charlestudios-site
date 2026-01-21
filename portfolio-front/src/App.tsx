import { useEffect } from 'react'; // Adicione o useEffect aqui
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios'; // Importe o axios
import Home from './pages/Home';
import { ProjectDetails } from './pages/ProjectDetails';
import { CreateProject } from './pages/CreateProject';
import { EditProject } from './pages/EditProject';

function App() {
  
  // 🕒 SISTEMA DE KEEP-ALIVE
  useEffect(() => {
    const pingBackend = () => {
      axios.get(`${import.meta.env.VITE_API_URL}/ping`)
        .then(() => console.log('Ping enviado: Backend acordado ☕'))
        .catch(err => console.error('Falha no ping:', err));
    };

    // Pinga imediatamente ao abrir
    pingBackend();

    // Configura o intervalo para 5 minutos (300.000 ms)
    // 10 minutos pode ser arriscado se o limite for exatos 15
    const intervalId = setInterval(pingBackend, 5 * 60 * 1000);

    return () => clearInterval(intervalId); // Limpa ao fechar
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:slug" element={<ProjectDetails />} />
        <Route path="/admin/new" element={<CreateProject />} />
        <Route path="/admin/edit/:id" element={<EditProject />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;