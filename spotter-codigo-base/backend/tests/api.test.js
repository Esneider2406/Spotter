// Pruebas de integración ligeras: no requieren base de datos
const request = require('supertest');
const app = require('../src/app');

describe('API (sin base de datos)', () => {
  test('GET /health responde 200', async () => {
    const r = await request(app).get('/health');
    expect(r.status).toBe(200);
  });

  test('rutas protegidas sin token responden 401', async () => {
    const r = await request(app).get('/api/perfil');
    expect(r.status).toBe(401);
  });

  test('registro con datos inválidos responde 400', async () => {
    const r = await request(app).post('/api/auth/registro').send({ email: 'malo' });
    expect(r.status).toBe(400);
    expect(r.body.errores.length).toBeGreaterThan(0);
  });

  test('ruta inexistente responde 404', async () => {
    const r = await request(app).get('/api/nada');
    expect(r.status).toBe(404);
  });
});
