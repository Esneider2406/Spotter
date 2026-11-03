import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import Logo from '../components/Logo.jsx';

const BENEFICIOS = [
  ['🎯', 'Mismos objetivos'],
  ['🕐', 'Mismos horarios'],
  ['💬', 'Chat con tus matches'],
  ['🧑‍🏫', 'Entrenadores que te guían'],
];
const PASOS = [
  ['Crea tu perfil', 'Cuéntanos tu objetivo, tu nivel y en qué horarios entrenas.'],
  ['Descubre compañeros', 'Te mostramos personas compatibles, de la más afín a la menos.'],
  ['Haz match y entrena', 'Si el interés es mutuo, chatean y quedan para el próximo entreno.'],
];

export default function Login() {
  const [registro, setRegistro] = useState(false);
  const [f, setF] = useState({ nombre: '', email: '', password: '', rol: 'usuario' });
  const [error, setError] = useState('');
  const { entrar } = useAuth();
  const navigate = useNavigate();

  const cambiar = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await api(registro ? '/api/auth/registro' : '/api/auth/login', { method: 'POST', body: f });
      entrar(data);
      navigate(registro || data.usuario.rol === 'entrenador' ? '/perfil' : '/descubrir');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="portada">
      <section className="hero">
        <Logo claro tam={40} />
        <h1>Nadie levanta solo.</h1>
        <p className="lema">Encuentra a quien te cuida el rack, te empuja en la última serie y llega a la misma hora que tú.</p>
        <ul className="beneficios">
          {BENEFICIOS.map(([icono, texto]) => (
            <li key={texto}><span aria-hidden="true">{icono}</span>{texto}</li>
          ))}
        </ul>
        <ol className="pasos">
          {PASOS.map(([titulo, detalle]) => (
            <li key={titulo}><strong>{titulo}</strong><span>{detalle}</span></li>
          ))}
        </ol>
      </section>

      <section className="tarjeta acceso">
        <h2>{registro ? 'Crea tu cuenta' : 'Bienvenido de vuelta'}</h2>
        <p className="suave">{registro ? 'Tu próximo compañero de entreno está a un perfil de distancia.' : 'Entra y retoma tu rutina.'}</p>
        <form onSubmit={enviar}>
          {registro && (
            <>
              <label>Nombre<input name="nombre" value={f.nombre} onChange={cambiar} required /></label>
              <label>Soy
                <select name="rol" value={f.rol} onChange={cambiar}>
                  <option value="usuario">Persona que quiere entrenar</option>
                  <option value="entrenador">Entrenador</option>
                </select>
              </label>
            </>
          )}
          <label>Correo<input type="email" name="email" value={f.email} onChange={cambiar} required /></label>
          <label>Contraseña<input type="password" name="password" value={f.password} onChange={cambiar} required minLength={registro ? 8 : undefined} /></label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="primario grande">{registro ? 'Crear cuenta' : 'Entrar'}</button>
        </form>
        <button className="enlace" onClick={() => { setRegistro(!registro); setError(''); }}>
          {registro ? 'Ya tengo cuenta' : 'Aún no tengo cuenta'}
        </button>
      </section>
    </div>
  );
}