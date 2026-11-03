import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { useAuth } from './auth.jsx';
import Login from './pages/Login.jsx';
import Perfil from './pages/Perfil.jsx';
import Descubrir from './pages/Descubrir.jsx';
import Entrenadores from './pages/Entrenadores.jsx';
import Solicitudes from './pages/Solicitudes.jsx';
import Chat from './pages/Chat.jsx';
import Logo from './components/Logo.jsx';
import Frase from './components/Frase.jsx';
import { useNotif } from './notificaciones.jsx';

function Privada({ children }) {
  const { usuario } = useAuth();
  return usuario ? children : <Navigate to="/login" replace />;
}

function Barra() {
  const { usuario, salir } = useAuth();
  const { totalMensajes, solicitudes } = useNotif();
  if (!usuario) return null;
  const esUsuario = usuario.rol === 'usuario';
  return (
    <header className="barra">
      <Logo />
      <nav>
        {esUsuario && <NavLink to="/descubrir">Descubrir</NavLink>}
        {esUsuario && <NavLink to="/entrenadores">Entrenadores</NavLink>}
          <NavLink to="/solicitudes">Solicitudes{solicitudes > 0 && <span className="insignia">{solicitudes}</span>}</NavLink>
        <NavLink to="/chat">Chat{totalMensajes > 0 && <span className="insignia">{totalMensajes}</span>}</NavLink>
        <NavLink to="/perfil">Mi perfil</NavLink>
      </nav>
      <span className="saludo">Hola, {usuario.nombre.split(' ')[0]}</span>
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
      {usuario && <Frase />}
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
      <footer className="pie">Spotter · Entrena acompañado, llega más lejos.</footer>
    </>
  );
}