import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pkg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL,
   
 });

pool.on('error', (err) => {
  console.error('Unexpected PG client error', err);
});

export default pool;
