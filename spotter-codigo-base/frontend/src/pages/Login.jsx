import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';

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
    <section className="tarjeta angosta">
      <h1>{registro ? 'Crea tu cuenta' : 'Entra a Spotter'}</h1>
      <p className="suave">Encuentra a alguien con tus mismos objetivos y horarios para entrenar.</p>
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
        <button className="primario">{registro ? 'Crear cuenta' : 'Entrar'}</button>
      </form>
      <button className="enlace" onClick={() => { setRegistro(!registro); setError(''); }}>
        {registro ? 'Ya tengo cuenta' : 'Aún no tengo cuenta'}
      </button>
    </section>
  );
}
