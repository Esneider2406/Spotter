const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const ah = require('../utils/ah');
const { validarRegistro } = require('../utils/validaciones');
const { generarToken } = require('../middleware/auth');

// POST /api/auth/registro
router.post('/registro', ah(async (req, res) => {
  const errores = validarRegistro(req.body);
  if (errores.length) return res.status(400).json({ errores });

  const { nombre, password, rol = 'usuario' } = req.body;
  const email = req.body.email.toLowerCase();

  const existe = await db.query('SELECT 1 FROM usuarios WHERE email = $1', [email]);
  if (existe.rowCount) return res.status(409).json({ error: 'El correo ya está registrado' });

  const hash = await bcrypt.hash(password, 10);
  const r = await db.query(
    'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES ($1,$2,$3,$4) RETURNING id, nombre, email, rol',
    [nombre.trim(), email, hash, rol]
  );
  const usuario = r.rows[0];
  res.status(201).json({ usuario, token: generarToken(usuario) });
}));

// POST /api/auth/login
router.post('/login', ah(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });

  const r = await db.query('SELECT * FROM usuarios WHERE email = $1', [email.toLowerCase()]);
  const u = r.rows[0];
  // Mismo mensaje en ambos casos para no revelar si el correo existe
  if (!u || !(await bcrypt.compare(password, u.password_hash))) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }
  const usuario = { id: u.id, nombre: u.nombre, email: u.email, rol: u.rol };
  res.json({ usuario, token: generarToken(usuario) });
}));

module.exports = router;
