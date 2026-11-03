import { useEffect, useState } from 'react';
import { api } from '../api.js';
import Avatar from '../components/Avatar.jsx';
import { useAuth } from '../auth.jsx';
import { useNotif } from '../notificaciones.jsx';

export default function Chat() {
  const { usuario } = useAuth();
  const { mensajes: sinLeer, contactos: nuevos, refrescar } = useNotif();
  const [contactos, setContactos] = useState([]);
  const [actual, setActual] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState('');
  const [error, setError] = useState('');

  // Recarga la lista cuando aparece un contacto nuevo (Match o solicitud aceptada)
  useEffect(() => { api('/api/chat').then(setContactos).catch((e) => setError(e.message)); }, [nuevos.length]);

  // Se consulta cada 4 s para ver mensajes nuevos (suficiente para un MVP)
  useEffect(() => {
    if (!actual) return undefined;
    const cargar = () =>
      api(`/api/chat/${actual.id}`)
        .then((m) => { setMensajes(m); refrescar(); })
        .catch((e) => setError(e.message));
    cargar();
    const t = setInterval(cargar, 4000);
    return () => clearInterval(t);
  }, [actual, refrescar]);

  const enviar = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return;
    try {
      await api(`/api/chat/${actual.id}`, { method: 'POST', body: { contenido: texto } });
      setTexto('');
      setMensajes(await api(`/api/chat/${actual.id}`));
    } catch (err) { setError(err.message); }
  };

  return (
    <section>
      <h1>Chat</h1>
      {error && <p className="error" role="alert">{error}</p>}
      {contactos.length === 0 && !error && <p className="suave">Aún no tienes conversaciones. Se habilitan con un Match o cuando aceptan tu solicitud de mensaje.</p>}
      <div className="chat">
        <ul className="contactos">
          {contactos.map((c) => {
            const n = (sinLeer.find((x) => x.id === c.id) || { n: 0 }).n;
            return (
              <li key={c.id}>
                <button className={actual?.id === c.id ? 'activo' : ''} onClick={() => { setActual(c); setMensajes([]); setError(''); }}>
                  <Avatar foto={c.foto} nombre={c.nombre} tam={30} />
                  <span>{c.nombre}{c.rol === 'entrenador' ? ' (entrenador)' : ''}</span>
                  {n > 0 && <span className="insignia">{n}</span>}
                </button>
              </li>
            );
          })}
        </ul>
        {actual && (
          <div className="conversacion">
            <div className="mensajes">
              {mensajes.map((m) => (
                <p key={m.id} className={m.de_usuario === usuario.id ? 'mio' : 'suyo'}>{m.contenido}</p>
              ))}
            </div>
            <form onSubmit={enviar} className="redactar">
              <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escribe un mensaje" maxLength={1000} />
              <button className="primario">Enviar</button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}