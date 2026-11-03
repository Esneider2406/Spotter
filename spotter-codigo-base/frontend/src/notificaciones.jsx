import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from './api.js';
import { useAuth } from './auth.jsx';

const VACIO = { mensajes: [], solicitudes: 0, contactos: [] };
const Ctx = createContext({ ...VACIO, totalMensajes: 0, refrescar: () => {} });
export const useNotif = () => useContext(Ctx);

// Consulta el servidor cada 5 s y muestra avisos cuando algo cambia
export function NotifProvider({ children }) {
  const { usuario } = useAuth();
  const { pathname } = useLocation();
  const [datos, setDatos] = useState(VACIO);
  const [avisos, setAvisos] = useState([]);
  const previo = useRef(null);
  const ruta = useRef(pathname);
  ruta.current = pathname;

  const avisar = useCallback((texto) => {
    const id = Date.now() + Math.random();
    setAvisos((a) => [...a, { id, texto }]);
    setTimeout(() => setAvisos((a) => a.filter((x) => x.id !== id)), 5000);
  }, []);

  const refrescar = useCallback(async () => {
    try {
      const d = await api('/api/notificaciones');
      const p = previo.current;
      if (p) {
        // Mensajes nuevos (no se avisa si ya estás en el chat)
        if (ruta.current !== '/chat') {
          d.mensajes.forEach((m) => {
            const antes = (p.mensajes.find((x) => x.id === m.id) || { n: 0 }).n;
            if (m.n > antes) avisar(`💬 ${m.nombre} te escribió (+${m.n - antes})`);
          });
        }
        if (d.solicitudes > p.solicitudes) avisar('📩 Tienes una nueva solicitud de mensaje');
        d.contactos
          .filter((c) => !p.contactos.some((x) => x.id === c.id))
          .forEach((c) => avisar(`🤝 ¡Ya puedes chatear con ${c.nombre}!`));
      }
      previo.current = d;
      setDatos(d);
    } catch {
      // si falla, se reintenta en el siguiente ciclo
    }
  }, [avisar]);

  useEffect(() => {
    if (!usuario) {
      previo.current = null;
      setDatos(VACIO);
      return undefined;
    }
    refrescar();
    const t = setInterval(refrescar, 5000);
    return () => clearInterval(t);
  }, [usuario, refrescar]);

  const totalMensajes = datos.mensajes.reduce((suma, m) => suma + m.n, 0);
  const pendientes = totalMensajes + datos.solicitudes;

  // Contador en la pestaña del navegador, como WhatsApp Web
  useEffect(() => {
    document.title = pendientes > 0 ? `(${pendientes}) Spotter` : 'Spotter · Encuentra con quién entrenar';
  }, [pendientes]);

  return (
    <Ctx.Provider value={{ ...datos, totalMensajes, refrescar }}>
      {children}
      <div className="avisos" role="status" aria-live="polite">
        {avisos.map((a) => <div key={a.id} className="aviso">{a.texto}</div>)}
      </div>
    </Ctx.Provider>
  );
}