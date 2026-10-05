import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { useAuth } from './auth.jsx';
import Login from './pages/Login.jsx';
import Perfil from './pages/Perfil.jsx';
import Descubrir from './pages/Descubrir.jsx';
import Entrenadores from './pages/Entrenadores.jsx';
import Solicitudes from './pages/Solicitudes.jsx';
import Chat from './pages/Chat.jsx';

function Privada({ children }) {
  const { usuario } = useAuth();
  return usuario ? children : <Navigate to="/login" replace />;
}

function Barra() {
  const { usuario, salir } = useAuth();
  if (!usuario) return null;
  const esUsuario = usuario.rol === 'usuario';
  return (
    <header className="barra">
      <strong className="logo">Spotter</strong>
      <nav>
        {esUsuario && <NavLink to="/descubrir">Descubrir</NavLink>}
        {esUsuario && <NavLink to="/entrenadores">Entrenadores</NavLink>}
        <NavLink to="/solicitudes">Solicitudes</NavLink>
        <NavLink to="/chat">Chat</NavLink>
        <NavLink to="/perfil">Mi perfil</NavLink>
      </nav>
      <button className="enlace" onClick={salir}>Cerrar sesión</button>
    </header>
  );
}

export default function App() {
  const { usuario } = useAuth();
  const inicio = usuario ? (usuario.rol === 'entrenador' ? '/perfil' : '/descubrir') : '/login';
  return (
    <>
      <Barra />
      <main className="contenido">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/perfil" element={<Privada><Perfil /></Privada>} />
          <Route path="/descubrir" element={<Privada><Descubrir /></Privada>} />
          <Route path="/entrenadores" element={<Privada><Entrenadores /></Privada>} />
          <Route path="/solicitudes" element={<Privada><Solicitudes /></Privada>} />
          <Route path="/chat" element={<Privada><Chat /></Privada>} />
          <Route path="*" element={<Navigate to={inicio} replace />} />
        </Routes>
      </main>
    </>
  );
}
