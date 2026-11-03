const router = require('express').Router();
const db = require('../db');
const ah = require('../utils/ah');
const { auth } = require('../middleware/auth');

router.use(auth);

// GET /api/notificaciones → resumen para los avisos (el frontend lo consulta cada 5 s)
router.get('/', ah(async (req, res) => {
  const yo = req.usuario.id;

  // Mensajes sin leer, agrupados por quién los envió
  const mensajes = await db.query(
    `SELECT u.id, u.nombre, COUNT(*)::int AS n
       FROM mensajes m JOIN usuarios u ON u.id = m.de_usuario
      WHERE m.a_usuario = $1 AND m.leido = FALSE
      GROUP BY u.id, u.nombre`,
    [yo]
  );

  // Solicitudes de mensaje pendientes
  const solicitudes = await db.query(
    "SELECT COUNT(*)::int AS n FROM solicitudes_mensaje WHERE a_usuario = $1 AND estado = 'pendiente'",
    [yo]
  );

  // Contactos con los que ya puedo chatear (Match o solicitud aceptada)
  const contactos = await db.query(
    `SELECT id, nombre FROM usuarios WHERE id IN (
       SELECT CASE WHEN usuario_a = $1 THEN usuario_b ELSE usuario_a END FROM matches WHERE usuario_a = $1 OR usuario_b = $1
       UNION
       SELECT CASE WHEN de_usuario = $1 THEN a_usuario ELSE de_usuario END FROM solicitudes_mensaje
        WHERE estado = 'aceptada' AND (de_usuario = $1 OR a_usuario = $1)
     )`,
    [yo]
  );

  res.json({ mensajes: mensajes.rows, solicitudes: solicitudes.rows[0].n, contactos: contactos.rows });
}));

module.exports = router;