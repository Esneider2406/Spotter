const app = require('./app');

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('Falta la variable de entorno JWT_SECRET');
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Spotter API escuchando en el puerto ${PORT}`));
