// Crea las tablas ejecutando sql/schema.sql  →  npm run db:init
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./db');

(async () => {
  const sql = fs.readFileSync(path.join(__dirname, '..', 'sql', 'schema.sql'), 'utf8');
  await db.query(sql);
  console.log('Tablas creadas correctamente');
  await db.pool.end();
})().catch((e) => {
  console.error('Error creando tablas:', e);
  process.exit(1);
});
