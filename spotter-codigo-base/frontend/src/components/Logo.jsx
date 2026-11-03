// Marca de Spotter: una barra con discos dentro de un cuadrado amarillo
export default function Logo({ claro = false, tam = 32 }) {
  return (
    <span className={`marca${claro ? ' claro' : ''}`}>
      <svg width={tam} height={tam} viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#f5c518" />
        <rect x="9" y="14.5" width="14" height="3" rx="1.5" fill="#14202e" />
        <rect x="5" y="9" width="4" height="14" rx="1.5" fill="#14202e" />
        <rect x="23" y="9" width="4" height="14" rx="1.5" fill="#14202e" />
        <rect x="2" y="12" width="3" height="8" rx="1" fill="#14202e" />
        <rect x="27" y="12" width="3" height="8" rx="1" fill="#14202e" />
      </svg>
      <span>Spotter</span>
    </span>
  );
}