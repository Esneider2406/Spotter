const router = require('express').Router();
const db = require('../db');
const ah = require('../utils/ah');
const { auth, soloRol } = require('../middleware/auth');
const { calcularCompatibilidad } = require('../utils/compatibilidad');

// GET /api/descubrir → personas compatibles, ordenadas por puntaje
// Solo se exponen los campos públicos del perfil (nunca email ni contraseña)
router.get('/', auth, soloRol('usuario'), ah(async (req, res) => {
  const yo = req.usuario.id;
  const mio = await db.query('SELECT * FROM perfiles_deportivos WHERE usuario_id = $1', [yo]);
  if (!mio.rowCount) return res.status(400).json({ error: 'Completa tu perfil deportivo para descubrir personas' });

  const otros = await db.query(
    `SELECT u.id, u.nombre, p.objetivo, p.nivel, p.tipo_entrenamiento, p.horarios, p.ciudad, p.bio
       FROM usuarios u
       JOIN perfiles_deportivos p ON p.usuario_id = u.id
      WHERE u.id <> $1 AND u.rol = 'usuario'
        AND u.id NOT IN (SELECT a_usuario FROM likes WHERE de_usuario = $1)
        AND u.id NOT IN (SELECT reportado FROM reportes WHERE reportante = $1)`,
    [yo]
  );

  const lista = otros.rows
    .map((o) => ({ ...o, compatibilidad: calcularCompatibilidad(mio.rows[0], o) }))
    .sort((a, b) => b.compatibilidad - a.compatibilidad);
  res.json(lista);
}));

module.exports = router;
