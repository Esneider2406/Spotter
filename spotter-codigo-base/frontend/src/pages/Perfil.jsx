import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';

const OBJETIVOS = { perder_peso: 'Perder peso', ganar_musculo: 'Ganar músculo', resistencia: 'Resistencia', salud_general: 'Salud general', rendimiento: 'Rendimiento deportivo' };
const NIVELES = { principiante: 'Principiante', intermedio: 'Intermedio', avanzado: 'Avanzado' };
const HORARIOS = { manana: 'Mañana', tarde: 'Tarde', noche: 'Noche' };

export default function Perfil() {
  const { usuario } = useAuth();
  const esEntrenador = usuario.rol === 'entrenador';
  const [f, setF] = useState(
    esEntrenador
      ? { especialidad: '', experiencia_anios: 0, descripcion: '', tarifa: '' }
      : { objetivo: 'ganar_musculo', nivel: 'principiante', tipo_entrenamiento: '', horarios: [], ciudad: '', bio: '' }
  );
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api('/api/perfil').then(({ perfil }) => {
      if (perfil) setF((prev) => ({ ...prev, ...Object.fromEntries(Object.entries(perfil).map(([k, v]) => [k, v ?? ''])) }));
    }).catch((e) => setError(e.message));
  }, []);

  const cambiar = (e) => setF({ ...f, [e.target.name]: e.target.value });
  const alternarHorario = (h) =>
    setF({ ...f, horarios: f.horarios.includes(h) ? f.horarios.filter((x) => x !== h) : [...f.horarios, h] });

  const guardar = async (e) => {
    e.preventDefault();
    setMsg(''); setError('');
    try {
      await api(esEntrenador ? '/api/entrenadores/perfil' : '/api/perfil', { method: 'PUT', body: f });
      setMsg('Perfil guardado');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="tarjeta angosta">
      <h1>{esEntrenador ? 'Tu perfil de entrenador' : 'Tu perfil deportivo'}</h1>
      <form onSubmit={guardar}>
        {esEntrenador ? (
          <>
            <label>Especialidad<input name="especialidad" value={f.especialidad} onChange={cambiar} required /></label>
            <label>Años de experiencia<input type="number" min="0" name="experiencia_anios" value={f.experiencia_anios} onChange={cambiar} required /></label>
            <label>Descripción de tus servicios<textarea name="descripcion" maxLength={500} value={f.descripcion} onChange={cambiar} /></label>
            <label>Tarifa por sesión (COP)<input type="number" min="0" name="tarifa" value={f.tarifa} onChange={cambiar} /></label>
          </>
        ) : (
          <>
            <label>Objetivo
              <select name="objetivo" value={f.objetivo} onChange={cambiar}>
                {Object.entries(OBJETIVOS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            <label>Nivel
              <select name="nivel" value={f.nivel} onChange={cambiar}>
                {Object.entries(NIVELES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            <label>Tipo de entrenamiento<input name="tipo_entrenamiento" placeholder="Pesas, funcional, running…" value={f.tipo_entrenamiento} onChange={cambiar} /></label>
            <fieldset>
              <legend>Horarios en los que entrenas</legend>
              {Object.entries(HORARIOS).map(([k, v]) => (
                <label key={k} className="check"><input type="checkbox" checked={f.horarios.includes(k)} onChange={() => alternarHorario(k)} />{v}</label>
              ))}
            </fieldset>
            <label>Ciudad<input name="ciudad" value={f.ciudad} onChange={cambiar} /></label>
            <label>Sobre ti<textarea name="bio" maxLength={300} value={f.bio} onChange={cambiar} /></label>
          </>
        )}
        {error && <p className="error" role="alert">{error}</p>}
        {msg && <p className="ok" role="status">{msg}</p>}
        <button className="primario">Guardar perfil</button>
      </form>
    </section>
  );
}
