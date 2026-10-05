const router = require('express').Router();
const db = require('../db');
const ah = require('../utils/ah');
const { auth, soloRol } = require('../middleware/auth');
const { validarPerfilEntrenador } = require('../utils/validaciones');

router.use(auth);

// GET /api/entrenadores → listado público de entrenadores
router.get('/', ah(async (_req, res) => {
  const r = await db.query(
    `SELECT u.id, u.nombre, e.especialidad, e.experiencia_anios, e.descripcion, e.tarifa
       FROM usuarios u JOIN perfiles_entrenador e ON e.usuario_id = u.id
      WHERE u.rol = 'entrenador' ORDER BY e.experiencia_anios DESC`
  );
  res.json(r.rows);
}));

// PUT /api/entrenadores/perfil → el entrenador publica o edita sus servicios
router.put('/perfil', soloRol('entrenador'), ah(async (req, res) => {
  const errores = validarPerfilEntrenador(req.body);
  if (errores.length) return res.status(400).json({ errores });

  const { especialidad, experiencia_anios, descripcion = null } = req.body;
  const tarifa = req.body.tarifa === '' || req.body.tarifa === undefined ? null : req.body.tarifa;
  const r = await db.query(
    `INSERT INTO perfiles_entrenador (usuario_id, especialidad, experiencia_anios, descripcion, tarifa)
     VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (usuario_id) DO UPDATE SET
       especialidad = EXCLUDED.especialidad, experiencia_anios = EXCLUDED.experiencia_anios,
       descripcion = EXCLUDED.descripcion, tarifa = EXCLUDED.tarifa
     RETURNING *`,
    [req.usuario.id, especialidad.trim(), Number(experiencia_anios), descripcion, tarifa]
  );
  res.json(r.rows[0]);
}));

module.exports = router;
