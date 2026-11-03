// Foto de perfil redonda; si la persona no tiene foto muestra su inicial
export default function Avatar({ foto, nombre = '', tam = 48 }) {
  const estilo = { width: tam, height: tam, fontSize: tam * 0.42 };
  return foto ? (
    <img className="avatar" src={foto} alt={`Foto de ${nombre}`} style={estilo} />
  ) : (
    <span className="avatar sin-foto" style={estilo} aria-hidden="true">
      {nombre.trim().charAt(0).toUpperCase() || '?'}
    </span>
  );
}