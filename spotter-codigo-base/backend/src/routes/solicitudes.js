const router = require('express').Router();
const db = require('../db');
const ah = require('../utils/ah');
const { auth } = require('../middleware/auth');
const { validarMensajeSolicitud, ordenarPar } = require('../utils/reglas');
const { MAX_SOLICITUDES_DIA } = require('../utils/constantes');

router.use(auth);

// POST /api/solicitudes {a, mensaje} → un único mensaje para llamar la atención
router.post('/', ah(async (req, res) => {
  const yo = req.usuario.id;
  const a = Number(req.body.a);
  const mensaje = typeof req.body.mensaje === 'string' ? req.body.mensaje.trim() : req.body.mensaje;

  if (!Number.isInteger(a) || a === yo) return res.status(400).json({ error: 'Destinatario inválido' });
  const errMsg = validarMensajeSolicitud(mensaje);
  if (errMsg) return res.status(400).json({ error: errMsg });

  const dest = await db.query('SELECT 1 FROM usuarios WHERE id = $1', [a]);
  if (!dest.rowCount) return res.status(404).json({ error: 'Usuario no encontrado' });

  const [x, y] = ordenarPar(yo, a);
  const match = await db.query('SELECT 1 FROM matches WHERE usuario_a = $1 AND usuario_b = $2', [x, y]);
  if (match.rowCount) return res.status(409).json({ error: 'Ya tienen Match: pueden chatear directamente' });

  const hoy = await db.query(
    "SELECT COUNT(*)::int AS n FROM solicitudes_mensaje WHERE de_usuario = $1 AND creado_en > NOW() - INTERVAL '1 day'",
    [yo]
  );
  if (hoy.rows[0].n >= MAX_SOLICITUDES_DIA) {
    return res.status(429).json({ error: `Alcanzaste el límite de ${MAX_SOLICITUDES_DIA} solicitudes por día` });
  }

  try {
    const r = await db.query(
      'INSERT INTO solicitudes_mensaje (de_usuario, a_usuario, mensaje) VALUES ($1,$2,$3) RETURNING *',
      [yo, a, mensaje]
    );
    res.status(201).json(r.rows[0]);
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Ya enviaste una solicitud a esta persona' });
    throw e;
  }
}));

// GET /api/solicitudes → solicitudes pendientes que recibí
router.get('/', ah(async (req, res) => {
  const r = await db.query(
    `SELECT s.id, s.mensaje, s.creado_en, u.id AS de_id, u.nombre AS de_nombre, u.rol AS de_rol
       FROM solicitudes_mensaje s JOIN usuarios u ON u.id = s.de_usuario
      WHERE s.a_usuario = $1 AND s.estado = 'pendiente'
      ORDER BY s.creado_en DESC`,
    [req.usuario.id]
  );
  res.json(r.rows);
}));

// PUT /api/solicitudes/:id {estado: 'aceptada' | 'rechazada'}
router.put('/:id', ah(async (req, res) => {
  const { estado } = req.body;
  if (!['aceptada', 'rechazada'].includes(estado)) {
    return res.status(400).json({ error: "El estado debe ser 'aceptada' o 'rechazada'" });
  }
  const r = await db.query(
    "UPDATE solicitudes_mensaje SET estado = $1 WHERE id = $2 AND a_usuario = $3 AND estado = 'pendiente' RETURNING *",
    [estado, Number(req.params.id), req.usuario.id]
  );
  if (!r.rowCount) return res.status(404).json({ error: 'Solicitud no encontrada o ya respondida' });
  res.json(r.rows[0]);
}));

module.exports = router;
