// Frase motivadora del día (cambia cada 24 h)
const FRASES = [
  'Nadie levanta solo.',
  'La constancia le gana al talento.',
  'Una serie más. Tú decides.',
  'Hoy entrenas, mañana lo agradeces.',
  'Con compañero no hay excusas.',
  'El mejor entrenamiento es el que haces.',
  'Cada repetición cuenta.',
];

export default function Frase() {
  const texto = FRASES[Math.floor(Date.now() / 86400000) % FRASES.length];
  return <div className="frase">“{texto}”</div>;
}