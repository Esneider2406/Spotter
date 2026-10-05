const router = require('express').Router();
const db = require('../db');
const ah = require('../utils/ah');
const { auth, soloRol } = require('../middleware/auth');
const { ordenarPar } = require('../utils/reglas');

// POST /api/likes/:id → da "Me gusta"; si es mutuo se crea el Match
router.post('/:id', auth, soloRol('usuario'), ah(async (req, res) => {
  const yo = req.usuario.id;
  const destino = Number(req.params.id);
  if (!Number.isInteger(destino) || destino === yo) return res.status(400).json({ error: 'Destino inválido' });

  const u = await db.query("SELECT 1 FROM usuarios WHERE id = $1 AND rol = 'usuario'", [destino]);
  if (!u.rowCount) return res.status(404).json({ error: 'Usuario no encontrado' });

  await db.query('INSERT INTO likes (de_usuario, a_usuario) VALUES ($1,$2) ON CONFLICT DO NOTHING', [yo, destino]);

  const reciproco = await db.query('SELECT 1 FROM likes WHERE de_usuario = $1 AND a_usuario = $2', [destino, yo]);
  if (!reciproco.rowCount) return res.json({ match: false });

  const [a, b] = ordenarPar(yo, destino);
  await db.query('INSERT INTO matches (usuario_a, usuario_b) VALUES ($1,$2) ON CONFLICT DO NOTHING', [a, b]);
  res.json({ match: true });
}));

module.exports = router;
