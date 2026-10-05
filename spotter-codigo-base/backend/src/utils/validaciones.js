const { OBJETIVOS, NIVELES, HORARIOS, ROLES } = require('./constantes');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validarRegistro(b = {}) {
  const e = [];
  if (!b.nombre || !String(b.nombre).trim()) e.push('El nombre es obligatorio');
  if (!b.email || !EMAIL_RE.test(b.email)) e.push('El correo no tiene un formato válido');
  if (!b.password || String(b.password).length < 8) e.push('La contraseña debe tener al menos 8 caracteres');
  if (b.rol !== undefined && !ROLES.includes(b.rol)) e.push('El rol no es válido');
  return e;
}

function validarPerfil(b = {}) {
  const e = [];
  if (!OBJETIVOS.includes(b.objetivo)) e.push(`El objetivo debe ser uno de: ${OBJETIVOS.join(', ')}`);
  if (!NIVELES.includes(b.nivel)) e.push(`El nivel debe ser uno de: ${NIVELES.join(', ')}`);
  if (!Array.isArray(b.horarios) || b.horarios.length === 0 || !b.horarios.every((h) => HORARIOS.includes(h))) {
    e.push(`Debes elegir al menos un horario válido: ${HORARIOS.join(', ')}`);
  }
  return e;
}

function validarPerfilEntrenador(b = {}) {
  const e = [];
  if (!b.especialidad || !String(b.especialidad).trim()) e.push('La especialidad es obligatoria');
  const exp = Number(b.experiencia_anios);
  if (!Number.isInteger(exp) || exp < 0) e.push('Los años de experiencia deben ser un entero mayor o igual a 0');
  if (b.tarifa !== undefined && b.tarifa !== null && b.tarifa !== '' && !(Number(b.tarifa) >= 0)) {
    e.push('La tarifa debe ser un número mayor o igual a 0');
  }
  return e;
}

module.exports = { validarRegistro, validarPerfil, validarPerfilEntrenador };
