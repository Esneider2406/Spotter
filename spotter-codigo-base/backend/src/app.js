require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const openapi = require('../docs/openapi.json');

const app = express();

const origenes = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim()) : '*';
app.use(cors({ origin: origenes }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapi));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/perfil', require('./routes/perfil'));
app.use('/api/descubrir', require('./routes/descubrir'));
app.use('/api/likes', require('./routes/likes'));
app.use('/api/solicitudes', require('./routes/solicitudes'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/entrenadores', require('./routes/entrenadores'));
app.use('/api/reportes', require('./routes/reportes'));

app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// Manejador global de errores
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;
