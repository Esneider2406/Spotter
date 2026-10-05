const { validarRegistro, validarPerfil, validarPerfilEntrenador } = require('../src/utils/validaciones');

describe('validarRegistro', () => {
  test('datos correctos no generan errores', () => {
    expect(validarRegistro({ nombre: 'Ana', email: 'ana@mail.com', password: '12345678' })).toEqual([]);
  });
  test('campos vacíos generan errores', () => {
    expect(validarRegistro({}).length).toBe(3);
  });
  test('correo con formato incorrecto', () => {
    expect(validarRegistro({ nombre: 'Ana', email: 'ana-mail', password: '12345678' }).length).toBe(1);
  });
  test('contraseña corta', () => {
    expect(validarRegistro({ nombre: 'Ana', email: 'ana@mail.com', password: '123' }).length).toBe(1);
  });
  test('rol inválido', () => {
    expect(validarRegistro({ nombre: 'Ana', email: 'ana@mail.com', password: '12345678', rol: 'admin' }).length).toBe(1);
  });
});

describe('validarPerfil', () => {
  test('perfil válido', () => {
    expect(validarPerfil({ objetivo: 'resistencia', nivel: 'avanzado', horarios: ['noche'] })).toEqual([]);
  });
  test('sin horarios es inválido', () => {
    expect(validarPerfil({ objetivo: 'resistencia', nivel: 'avanzado', horarios: [] }).length).toBe(1);
  });
  test('objetivo y nivel inventados son inválidos', () => {
    expect(validarPerfil({ objetivo: 'volar', nivel: 'dios', horarios: ['tarde'] }).length).toBe(2);
  });
});

describe('validarPerfilEntrenador', () => {
  test('perfil válido', () => {
    expect(validarPerfilEntrenador({ especialidad: 'Crossfit', experiencia_anios: 3, tarifa: 50000 })).toEqual([]);
  });
  test('experiencia negativa', () => {
    expect(validarPerfilEntrenador({ especialidad: 'Crossfit', experiencia_anios: -1 }).length).toBe(1);
  });
});
