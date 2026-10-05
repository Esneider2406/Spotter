import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Entrenadores() {
  const [lista, setLista] = useState([]);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { api('/api/entrenadores').then(setLista).catch((e) => setError(e.message)); }, []);

  const contactar = async (id) => {
    const mensaje = window.prompt('Preséntate en un mensaje (máx. 200 caracteres):');
    if (!mensaje) return;
    setMsg(''); setError('');
    try {
      await api('/api/solicitudes', { method: 'POST', body: { a: id, mensaje } });
      setMsg('Solicitud enviada. Podrás chatear cuando el entrenador la acepte.');
    } catch (e) { setError(e.message); }
  };

  return (
    <section>
      <h1>Entrenadores</h1>
      {msg && <p className="ok" role="status">{msg}</p>}
      {error && <p className="error" role="alert">{error}</p>}
      {!error && lista.length === 0 && <p className="suave">Todavía no hay entrenadores publicados.</p>}
      <div className="rejilla">
        {lista.map((e) => (
          <article key={e.id} className="tarjeta">
            <h2>{e.nombre}</h2>
            <p><strong>{e.especialidad}</strong> · {e.experiencia_anios} {e.experiencia_anios === 1 ? 'año' : 'años'} de experiencia</p>
            {e.descripcion && <p>{e.descripcion}</p>}
            {e.tarifa != null && <p className="suave">Desde ${Number(e.tarifa).toLocaleString('es-CO')} por sesión</p>}
            <div className="acciones"><button className="primario" onClick={() => contactar(e.id)}>Contactar</button></div>
          </article>
        ))}
      </div>
    </section>
  );
}
