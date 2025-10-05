import pool from '../config/db.js';

export const addTimelineEntry = async ({ ticket_id, action, performed_by }) => {
  const res = await pool.query(
    `INSERT INTO timeline (ticket_id, action, performed_by, created_at)
     VALUES ($1, $2, $3, NOW()) RETURNING *`,
    [ticket_id, action, performed_by]
  );
  return res.rows[0];
};

export const listTimelineByTicket = async (ticket_id) => {
  const res = await pool.query(
    `SELECT t.*, u.name AS user_name
     FROM timeline t
     JOIN users u ON t.performed_by = u.id
     WHERE ticket_id = $1
     ORDER BY created_at ASC`,
    [ticket_id]
  );
  return res.rows;
};
