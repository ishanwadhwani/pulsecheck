const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

const connectToDB = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('🔗 Successfully connected to PostgreSQL database at:', res.rows[0].now);
  } catch (err) {
    console.error('Database connection failed.');
    console.error(err.stack);
    process.exit(1);
  }
};

connectToDB();

module.exports = pool;