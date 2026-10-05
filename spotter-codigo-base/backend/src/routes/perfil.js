const router = require('express').Router();
const db = require('../db');
const ah = require('../utils/ah');
const { auth, soloRol } = require('../middleware/auth');
const { validarPerfil } = require('../utils/validaciones');

router.use(auth);

// GET /api/perfil → datos del usuario + su perfil (deportivo o de entrenador)
router.get('/', ah(async (req, res) => {
  const u = await db.query('SELECT id, nombre, email, rol FROM usuarios WHERE id = $1', [req.usuario.id]);
  if (!u.rowCount) return res.status(404).json({ error: 'Usuario no encontrado' });
  const tabla = req.usuario.rol === 'entrenador' ? 'perfiles_entrenador' : 'perfiles_deportivos';
  const p = await db.query(`SELECT * FROM ${tabla} WHERE usuario_id = $1`, [req.usuario.id]);
  res.json({ usuario: u.rows[0], perfil: p.rows[0] || null });
}));

// PUT /api/perfil → crea o actualiza el perfil deportivo
router.put('/', soloRol('usuario'), ah(async (req, res) => {
  const errores = validarPerfil(req.body);
  if (errores.length) return res.status(400).json({ errores });

  const { objetivo, nivel, horarios, tipo_entrenamiento = null, ciudad = null, bio = null } = req.body;
  const r = await db.query(
    `INSERT INTO perfiles_deportivos (usuario_id, objetivo, nivel, tipo_entrenamiento, horarios, ciudad, bio)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     ON CONFLICT (usuario_id) DO UPDATE SET
       objetivo = EXCLUDED.objetivo, nivel = EXCLUDED.nivel, tipo_entrenamiento = EXCLUDED.tipo_entrenamiento,
       horarios = EXCLUDED.horarios, ciudad = EXCLUDED.ciudad, bio = EXCLUDED.bio
     RETURNING *`,
    [req.usuario.id, objetivo, nivel, tipo_entrenamiento, horarios, ciudad, bio]
  );
  res.json(r.rows[0]);
}));

module.exports = router;
