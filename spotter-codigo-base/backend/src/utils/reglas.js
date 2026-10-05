// Reglas de negocio de Spotter (funciones puras, fáciles de probar)

// Solo se puede chatear si hay Match o una solicitud de mensaje aceptada
function puedeChatear({ hayMatch, haySolicitudAceptada }) {
  return Boolean(hayMatch || haySolicitudAceptada);
}

// Devuelve null si el mensaje es válido, o el texto del error
function validarMensajeSolicitud(mensaje) {
  if (typeof mensaje !== 'string' || !mensaje.trim()) return 'El mensaje no puede estar vacío';
  if (mensaje.trim().length > 200) return 'El mensaje no puede superar 200 caracteres';
  return null;
}

// Ordena dos ids para guardar cada pareja una sola vez (menor, mayor)
function ordenarPar(a, b) {
  return a < b ? [a, b] : [b, a];
}

module.exports = { puedeChatear, validarMensajeSolicitud, ordenarPar };
