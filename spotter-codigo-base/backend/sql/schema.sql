-- Esquema de base de datos de Spotter (PostgreSQL)
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'usuario' CHECK (rol IN ('usuario','entrenador')),
  creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS perfiles_deportivos (
  usuario_id INT PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
  objetivo VARCHAR(30) NOT NULL,
  nivel VARCHAR(20) NOT NULL,
  tipo_entrenamiento VARCHAR(60),
  horarios TEXT[] NOT NULL DEFAULT '{}',
  ciudad VARCHAR(80),
  bio VARCHAR(300)
);

CREATE TABLE IF NOT EXISTS perfiles_entrenador (
  usuario_id INT PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
  especialidad VARCHAR(100) NOT NULL,
  experiencia_anios INT NOT NULL DEFAULT 0 CHECK (experiencia_anios >= 0),
  descripcion VARCHAR(500),
  tarifa NUMERIC(10,2)
);

CREATE TABLE IF NOT EXISTS likes (
  id SERIAL PRIMARY KEY,
  de_usuario INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  a_usuario INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  creado_en TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (de_usuario, a_usuario),
  CHECK (de_usuario <> a_usuario)
);

-- usuario_a siempre es el menor id, así cada pareja existe una sola vez
CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  usuario_a INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  usuario_b INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  creado_en TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (usuario_a, usuario_b),
  CHECK (usuario_a < usuario_b)
);

-- UNIQUE (de, a) garantiza el "único mensaje" por persona
CREATE TABLE IF NOT EXISTS solicitudes_mensaje (
  id SERIAL PRIMARY KEY,
  de_usuario INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  a_usuario INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  mensaje VARCHAR(200) NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente','aceptada','rechazada')),
  creado_en TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (de_usuario, a_usuario),
  CHECK (de_usuario <> a_usuario)
);

CREATE TABLE IF NOT EXISTS mensajes (
  id SERIAL PRIMARY KEY,
  de_usuario INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  a_usuario INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  contenido VARCHAR(1000) NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_mensajes_par ON mensajes (de_usuario, a_usuario, creado_en);

CREATE TABLE IF NOT EXISTS reportes (
  id SERIAL PRIMARY KEY,
  reportante INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  reportado INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  motivo VARCHAR(300) NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);
