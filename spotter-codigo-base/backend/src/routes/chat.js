const router = require('express').Router();
const db = require('../db');
const ah = require('../utils/ah');
const { auth } = require('../middleware/auth');
const { puedeChatear, ordenarPar } = require('../utils/reglas');

router.use(auth);

// ¿Hay Match o solicitud aceptada (en cualquier dirección) entre las dos personas?
async function tieneAcceso(yo, otro) {
  const [a, b] = ordenarPar(yo, otro);
  const m = await db.query('SELECT 1 FROM matches WHERE usuario_a = $1 AND usuario_b = $2', [a, b]);
  const s = await db.query(
    `SELECT 1 FROM solicitudes_mensaje WHERE estado = 'aceptada'
       AND ((de_usuario = $1 AND a_usuario = $2) OR (de_usuario = $2 AND a_usuario = $1))`,
    [yo, otro]
  );
  return puedeChatear({ hayMatch: m.rowCount > 0, haySolicitudAceptada: s.rowCount > 0 });
}

// GET /api/chat → contactos con los que puedo chatear
router.get('/', ah(async (req, res) => {
  const r = await db.query(
    `SELECT id, nombre, rol FROM usuarios WHERE id IN (
       SELECT CASE WHEN usuario_a = $1 THEN usuario_b ELSE usuario_a END FROM matches WHERE usuario_a = $1 OR usuario_b = $1
       UNION
       SELECT CASE WHEN de_usuario = $1 THEN a_usuario ELSE de_usuario END FROM solicitudes_mensaje
        WHERE estado = 'aceptada' AND (de_usuario = $1 OR a_usuario = $1)
     ) ORDER BY nombre`,
    [req.usuario.id]
  );
  res.json(r.rows);
}));

// GET /api/chat/:id → historial de mensajes con esa persona
router.get('/:id', ah(async (req, res) => {
  const otro = Number(req.params.id);
  if (!Number.isInteger(otro)) return res.status(400).json({ error: 'Destino inválido' });
  if (!(await tieneAcceso(req.usuario.id, otro))) {
    return res.status(403).json({ error: 'Solo pueden chatear si hay Match o una solicitud aceptada' });
  }
  const r = await db.query(
    `SELECT id, de_usuario, contenido, creado_en FROM mensajes
      WHERE (de_usuario = $1 AND a_usuario = $2) OR (de_usuario = $2 AND a_usuario = $1)
      ORDER BY creado_en ASC, id ASC`,
    [req.usuario.id, otro]
  );
  res.json(r.rows);
}));

// POST /api/chat/:id {contenido}
router.post('/:id', ah(async (req, res) => {
  const otro = Number(req.params.id);
  const contenido = typeof req.body.contenido === 'string' ? req.body.contenido.trim() : '';
  if (!Number.isInteger(otro)) return res.status(400).json({ error: 'Destino inválido' });
  if (!contenido || contenido.length > 1000) {
    return res.status(400).json({ error: 'El mensaje debe tener entre 1 y 1000 caracteres' });
  }
  if (!(await tieneAcceso(req.usuario.id, otro))) {
    return res.status(403).json({ error: 'Solo pueden chatear si hay Match o una solicitud aceptada' });
  }
  const r = await db.query(
    'INSERT INTO mensajes (de_usuario, a_usuario, contenido) VALUES ($1,$2,$3) RETURNING id, de_usuario, contenido, creado_en',
    [req.usuario.id, otro, contenido]
  );
  res.status(201).json(r.rows[0]);
}));

module.exports = router;
