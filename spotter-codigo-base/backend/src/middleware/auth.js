const jwt = require('jsonwebtoken');

const secreto = () => process.env.JWT_SECRET || 'solo-para-desarrollo';

function generarToken(usuario) {
  return jwt.sign({ id: usuario.id, rol: usuario.rol }, secreto(), { expiresIn: '7d' });
}

// Exige un token JWT válido en el header Authorization: Bearer <token>
function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  try {
    const p = jwt.verify(token, secreto());
    req.usuario = { id: p.id, rol: p.rol };
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

const soloRol = (rol) => (req, res, next) =>
  req.usuario.rol === rol ? next() : res.status(403).json({ error: `Solo disponible para el rol ${rol}` });

module.exports = { generarToken, auth, soloRol };
