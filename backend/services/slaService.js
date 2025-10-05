import pool from '../config/db.js';

export async function markBreachedTickets() {
  // mark breached where now > due_at and status not in resolved/closed and breached=false
  const sql = `UPDATE tickets SET breached=true WHERE now() > due_at AND status NOT IN ('resolved','closed') AND breached = false RETURNING id`;
  const r = await pool.query(sql);
  if (r.rowCount) {
    for (const row of r.rows) {
      await pool.query('INSERT INTO timeline (ticket_id, action, metadata) VALUES($1,$2,$3)', [row.id, 'breached', JSON.stringify({ reason: 'due_at passed' })]);
    }
  }
  return r.rowCount;
}
