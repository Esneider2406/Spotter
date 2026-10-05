const { puedeChatear, validarMensajeSolicitud, ordenarPar } = require('../src/utils/reglas');

describe('puedeChatear', () => {
  test('con Match se puede chatear', () => {
    expect(puedeChatear({ hayMatch: true, haySolicitudAceptada: false })).toBe(true);
  });
  test('con solicitud aceptada se puede chatear', () => {
    expect(puedeChatear({ hayMatch: false, haySolicitudAceptada: true })).toBe(true);
  });
  test('sin Match ni solicitud aceptada no se puede chatear', () => {
    expect(puedeChatear({ hayMatch: false, haySolicitudAceptada: false })).toBe(false);
  });
});

describe('validarMensajeSolicitud', () => {
  test('mensaje válido', () => {
    expect(validarMensajeSolicitud('¡Hola! ¿Entrenamos piernas mañana?')).toBe(null);
  });
  test('mensaje vacío', () => {
    expect(validarMensajeSolicitud('   ')).toBe('El mensaje no puede estar vacío');
  });
  test('mensaje demasiado largo', () => {
    expect(validarMensajeSolicitud('a'.repeat(201))).toBe('El mensaje no puede superar 200 caracteres');
  });
});

describe('ordenarPar', () => {
  test('siempre devuelve (menor, mayor)', () => {
    expect(ordenarPar(7, 3)).toEqual([3, 7]);
    expect(ordenarPar(3, 7)).toEqual([3, 7]);
  });
});
