const router = require('express').Router();
const db = require('../db');
const ah = require('../utils/ah');
const { auth } = require('../middleware/auth');

// POST /api/reportes {reportado, motivo} → reportar comportamiento inapropiado
router.post('/', auth, ah(async (req, res) => {
  const reportado = Number(req.body.reportado);
  const motivo = typeof req.body.motivo === 'string' ? req.body.motivo.trim() : '';
  if (!Number.isInteger(reportado) || reportado === req.usuario.id) return res.status(400).json({ error: 'Usuario inválido' });
  if (!motivo || motivo.length > 300) return res.status(400).json({ error: 'El motivo debe tener entre 1 y 300 caracteres' });

  const u = await db.query('SELECT 1 FROM usuarios WHERE id = $1', [reportado]);
  if (!u.rowCount) return res.status(404).json({ error: 'Usuario no encontrado' });

  await db.query('INSERT INTO reportes (reportante, reportado, motivo) VALUES ($1,$2,$3)', [req.usuario.id, reportado, motivo]);
  res.status(201).json({ ok: true });
}));

module.exports = router;
