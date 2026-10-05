import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Solicitudes() {
  const [lista, setLista] = useState([]);
  const [error, setError] = useState('');

  const cargar = () => api('/api/solicitudes').then(setLista).catch((e) => setError(e.message));
  useEffect(() => { cargar(); }, []);

  const responder = async (id, estado) => {
    try { await api(`/api/solicitudes/${id}`, { method: 'PUT', body: { estado } }); cargar(); }
    catch (e) { setError(e.message); }
  };

  return (
    <section>
      <h1>Solicitudes recibidas</h1>
      {error && <p className="error" role="alert">{error}</p>}
      {!error && lista.length === 0 && <p className="suave">No tienes solicitudes pendientes.</p>}
      <div className="rejilla">
        {lista.map((s) => (
          <article key={s.id} className="tarjeta">
            <h2>{s.de_nombre}</h2>
            <p>“{s.mensaje}”</p>
            <div className="acciones">
              <button className="primario" onClick={() => responder(s.id, 'aceptada')}>Aceptar</button>
              <button onClick={() => responder(s.id, 'rechazada')}>Rechazar</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
