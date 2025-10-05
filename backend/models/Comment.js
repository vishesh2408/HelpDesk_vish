import pool from '../config/db.js';

export const createComment = async ({ ticket_id, user_id, comment_text }) => {
  const res = await pool.query(
    `INSERT INTO comments (ticket_id, user_id, comment_text, created_at)
     VALUES ($1, $2, $3, NOW()) RETURNING *`,
    [ticket_id, user_id, comment_text]
  );
  return res.rows[0];
};

export const listCommentsByTicket = async (ticket_id) => {
  const res = await pool.query(
    `SELECT c.*, u.name AS user_name
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE ticket_id = $1
     ORDER BY created_at ASC`,
    [ticket_id]
  );
  return res.rows;
};
