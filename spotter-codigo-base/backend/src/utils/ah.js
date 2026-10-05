// Envuelve handlers async para que los errores lleguen al manejador global
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
