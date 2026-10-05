const { NIVELES } = require('./constantes');

/**
 * Puntaje de compatibilidad (0-100) entre dos perfiles deportivos.
 *  - 40 pts: mismo objetivo
 *  - 30 pts: mismo nivel (15 si difieren en un escalón)
 *  - 30 pts: proporción de horarios en común
 */
function calcularCompatibilidad(a, b) {
  if (!a || !b) return 0;
  let puntos = 0;

  if (a.objetivo && a.objetivo === b.objetivo) puntos += 40;

  if (NIVELES.includes(a.nivel) && NIVELES.includes(b.nivel)) {
    const diff = Math.abs(NIVELES.indexOf(a.nivel) - NIVELES.indexOf(b.nivel));
    if (diff === 0) puntos += 30;
    else if (diff === 1) puntos += 15;
  }

  const ha = a.horarios || [];
  const hb = b.horarios || [];
  const comunes = ha.filter((h) => hb.includes(h)).length;
  const total = new Set([...ha, ...hb]).size;
  if (total > 0) puntos += Math.round((30 * comunes) / total);

  return puntos;
}

module.exports = { calcularCompatibilidad };
