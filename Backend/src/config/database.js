require('dotenv').config();

const mariadb = require('mariadb');

let pool;

function getPool() {
  if (!pool) {
    pool = mariadb.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'vetcare',
      connectionLimit: 5
    });
  }

  return pool;
}

async function query(sql, params = []) {
  let connection;

  try {
    connection = await getPool().getConnection();
    return await connection.query(sql, params);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function close() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

module.exports = {
  query,
  close
};
