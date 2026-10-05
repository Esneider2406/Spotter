const { calcularCompatibilidad } = require('../src/utils/compatibilidad');

const base = { objetivo: 'ganar_musculo', nivel: 'intermedio', horarios: ['manana', 'tarde'] };

describe('calcularCompatibilidad', () => {
  test('perfiles idénticos dan 100', () => {
    expect(calcularCompatibilidad(base, { ...base })).toBe(100);
  });

  test('perfiles sin nada en común dan 0', () => {
    const otro = { objetivo: 'resistencia', nivel: 'avanzado', horarios: ['noche'] };
    const a = { objetivo: 'ganar_musculo', nivel: 'principiante', horarios: ['manana'] };
    expect(calcularCompatibilidad(a, otro)).toBe(0);
  });

  test('un escalón de diferencia en nivel suma 15', () => {
    const otro = { objetivo: 'resistencia', nivel: 'avanzado', horarios: ['noche'] };
    expect(calcularCompatibilidad(base, otro)).toBe(15);
  });

  test('horarios parcialmente compartidos suman proporcionalmente', () => {
    const otro = { objetivo: 'resistencia', nivel: 'principiante', horarios: ['tarde', 'noche'] };
    // 1 común de 3 distintos → 10 pts; nivel difiere 1 → 15 pts; objetivo distinto → 0
    expect(calcularCompatibilidad(base, otro)).toBe(25);
  });

  test('perfil faltante devuelve 0', () => {
    expect(calcularCompatibilidad(base, null)).toBe(0);
  });
});
