const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Cliente simple para hablar con el backend; lanza Error con el mensaje de la API
export async function api(ruta, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE}${ruta}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || (data.errores && data.errores.join('. ')) || 'Ocurrió un error');
  return data;
}
