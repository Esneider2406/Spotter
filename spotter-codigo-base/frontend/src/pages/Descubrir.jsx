import { useEffect, useState } from 'react';
import { api } from '../api.js';

const ETIQUETAS = { perder_peso: 'Perder peso', ganar_musculo: 'Ganar músculo', resistencia: 'Resistencia', salud_general: 'Salud general', rendimiento: 'Rendimiento', manana: 'mañana', tarde: 'tarde', noche: 'noche' };

export default function Descubrir() {
  const [lista, setLista] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const cargar = () =>
    api('/api/descubrir').then(setLista).catch((e) => setError(e.message)).finally(() => setCargando(false));
  useEffect(() => { cargar(); }, []);

  const meGusta = async (id) => {
    setMsg(''); setError('');
    try {
      const r = await api(`/api/likes/${id}`, { method: 'POST' });
      setMsg(r.match ? '¡Es un Match! Ya pueden chatear.' : 'Me gusta enviado. Si la otra persona también te elige, habrá Match.');
      cargar();
    } catch (e) { setError(e.message); }
  };

  const solicitud = async (id) => {
    const mensaje = window.prompt('Escribe tu mensaje (máx. 200 caracteres). Solo puedes enviar uno a cada persona:');
    if (!mensaje) return;
    setMsg(''); setError('');
    try {
      await api('/api/solicitudes', { method: 'POST', body: { a: id, mensaje } });
      setMsg('Solicitud enviada');
    } catch (e) { setError(e.message); }
  };

  const reportar = async (id) => {
    const motivo = window.prompt('¿Por qué quieres reportar a esta persona?');
    if (!motivo) return;
    try { await api('/api/reportes', { method: 'POST', body: { reportado: id, motivo } }); cargar(); }
    catch (e) { setError(e.message); }
  };

  return (
    <section>
      <h1>Personas para entrenar</h1>
      {msg && <p className="ok" role="status">{msg}</p>}
      {error && <p className="error" role="alert">{error}</p>}
      {cargando && <p className="suave">Cargando…</p>}
      {!cargando && !error && lista.length === 0 && <p className="suave">Por ahora no hay más perfiles. Vuelve pronto o invita a alguien de tu gimnasio.</p>}
      <div className="rejilla">
        {lista.map((p) => (
          <article key={p.id} className="tarjeta">
            <div className="fila">
              <h2>{p.nombre}</h2>
              <span className="puntaje" title="Compatibilidad">{p.compatibilidad}%</span>
            </div>
            <p><strong>{ETIQUETAS[p.objetivo]}</strong> · {p.nivel}</p>
            {p.tipo_entrenamiento && <p>{p.tipo_entrenamiento}</p>}
            <p className="suave">Entrena en la {p.horarios.map((h) => ETIQUETAS[h]).join(', ')}{p.ciudad ? ` · ${p.ciudad}` : ''}</p>
            {p.bio && <p>{p.bio}</p>}
            <div className="acciones">
              <button className="primario" onClick={() => meGusta(p.id)}>Me gusta</button>
              <button onClick={() => solicitud(p.id)}>Enviar mensaje</button>
              <button className="enlace" onClick={() => reportar(p.id)}>Reportar</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
