import pool from '../config/db.js';

// Create a ticket
export const createTicket = async ({ title, description, user_id, sla_seconds = 86400 }) => {
  const res = await pool.query(
    `INSERT INTO tickets
      (title, description, status, assignee_id, sla_seconds, due_at, version, requester_id, created_at, updated_at, breached)
     VALUES
      ($1, $2, 'open', NULL, $3, NOW() + ($3::integer * INTERVAL '1 second'), 1, $4, NOW(), NOW(), false)
     RETURNING *`,
    [title, description, sla_seconds, user_id]
  );
  return res.rows[0];
};

// Get ticket by ID
export const getTicketById = async (id) => {
  const res = await pool.query(`SELECT * FROM tickets WHERE id = $1`, [id]);
  return res.rows[0];
};

// List tickets with search
export const listTickets = async ({ limit = 10, offset = 0, search = '' }) => {
  const res = await pool.query(
    `SELECT t.*,
            COALESCE(c.body, '') AS latest_comment
     FROM tickets t
     LEFT JOIN LATERAL (
       SELECT body FROM comments WHERE ticket_id = t.id ORDER BY created_at DESC LIMIT 1
     ) c ON true
     WHERE t.title ILIKE $1 OR t.description ILIKE $1 OR c.body ILIKE $1
     ORDER BY t.created_at DESC
     LIMIT $2 OFFSET $3`,
    [`%${search}%`, limit, offset]
  );
  return res.rows;
};

// Update ticket with optimistic locking
export const updateTicket = async ({ id, title, description, status, assignee_id, version }) => {
  const res = await pool.query(
    `UPDATE tickets
     SET title=$1,
         description=$2,
         status=$3,
         assignee_id=$4,
         version=version+1,
         updated_at=NOW()
     WHERE id=$5 AND version=$6
     RETURNING *`,
    [title, description, status, assignee_id, id, version]
  );
  return res.rows[0];
};
