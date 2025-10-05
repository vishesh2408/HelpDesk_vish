import pool from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

// Create ticket
export async function createTicket(req, res) {
  const { title, description, priority = 'normal', sla_seconds = 86400 } = req.body;

  if (!title) {
    return res.status(400).json({
      error: { code: 'FIELD_REQUIRED', field: 'title', message: 'Title required' }
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const insertSql = `
      INSERT INTO tickets 
        (title, description, requester_id, assignee_id, status, priority, sla_seconds, created_at, updated_at, due_at, breached, version)
      VALUES 
        ($1, $2, $3, NULL, 'open', $4, $5, now(), now(), now() + ($5::integer * interval '1 second'), false, 1)
      RETURNING *;
    `;
    const r = await client.query(insertSql, [title, description, req.user.id, priority, sla_seconds]);
    const ticket = r.rows[0];

    // Timeline log
    await client.query(
      'INSERT INTO timeline (ticket_id, actor_id, action, metadata) VALUES($1,$2,$3,$4)',
      [ticket.id, req.user.id, 'created', JSON.stringify({ title, priority })]
    );

    await client.query('COMMIT');
    return res.status(201).json({ ticket });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    return res.status(500).json({ error: { code: 'SERVER_ERROR' } });
  } finally {
    client.release();
  }
}

// List tickets
export async function listTickets(req, res) {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const offset = parseInt(req.query.offset) || 0;
  const q = req.query.q || null;
  const breached = req.query.breached;

  let params = [];
  let where = [];

  // Search by title/description
  if (q) {
    params.push(q);
    where.push(`to_tsvector('english', coalesce(t.title,'') || ' ' || coalesce(t.description,'')) @@ plainto_tsquery('english',$${params.length})`);
  }

  // Breached filter
  if (typeof breached !== 'undefined') {
    params.push(breached === 'true');
    where.push(`(now() > t.due_at AND t.status NOT IN ('resolved','closed')) = $${params.length}`);
  }

  // Role restriction
  if (req.user.role === 'user') {
    params.push(req.user.id);
    where.push(`t.requester_id = $${params.length}`);
  } else if (req.user.role === 'agent') {
    params.push(req.user.id);
    where.push(`t.assignee_id = $${params.length}`);
  }

  const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
  const sql = `
    SELECT t.*, (now()>t.due_at AND t.status NOT IN ('resolved','closed')) AS breached
    FROM tickets t
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;
  params.push(limit, offset);

  try {
    const r = await pool.query(sql, params);
    const next_offset = r.rowCount < limit ? null : offset + limit;
    res.json({ items: r.rows, next_offset });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: { code: 'SERVER_ERROR' } });
  }
}

// Get ticket detail
export async function getTicket(req, res) {
  const id = req.params.id;
  try {
    const tR = await pool.query(`
      SELECT t.*, (now()>t.due_at AND t.status NOT IN ('resolved','closed')) AS breached 
      FROM tickets t 
      WHERE id=$1
    `, [id]);

    if (!tR.rowCount) return res.status(404).json({ error: { code: 'NOT_FOUND' } });

    const ticket = tR.rows[0];

    // Role check
    if (req.user.role === 'user' && ticket.requester_id !== req.user.id) {
      return res.status(403).json({ error: { code: 'FORBIDDEN' } });
    }
    if (req.user.role === 'agent' && ticket.assignee_id !== req.user.id) {
      return res.status(403).json({ error: { code: 'FORBIDDEN' } });
    }

    const comments = await pool.query('SELECT * FROM comments WHERE ticket_id=$1 ORDER BY created_at ASC', [id]);
    const timeline = await pool.query('SELECT * FROM timeline WHERE ticket_id=$1 ORDER BY created_at ASC', [id]);

    res.json({ ticket, comments: comments.rows, timeline: timeline.rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: { code: 'SERVER_ERROR' } });
  }
}

// Patch ticket with optimistic locking
export async function patchTicket(req, res) {
  const id = req.params.id;
  const clientVersion = parseInt(req.header('If-Match'));
  if (Number.isNaN(clientVersion)) return res.status(400).json({ error: { code: 'FIELD_REQUIRED', field: 'If-Match', message: 'If-Match header required' } });

  const allowed = ['status', 'assignee_id', 'title', 'description', 'priority', 'sla_seconds'];
  const sets = [];
  const vals = [];
  let idx = 3;

  for (const k of allowed) {
    if (typeof req.body[k] !== 'undefined') {
      sets.push(`${k} = $${idx++}`);
      vals.push(req.body[k]);
    }
  }

  if (!sets.length) return res.status(400).json({ error: { code: 'FIELD_REQUIRED', message: 'No updatable fields provided' } });

  try {
    // Check ticket and role permission
    const ticketR = await pool.query('SELECT * FROM tickets WHERE id=$1', [id]);
    if (!ticketR.rowCount) return res.status(404).json({ error: { code: 'NOT_FOUND' } });
    const ticket = ticketR.rows[0];

    if (req.user.role === 'user') return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Users cannot update tickets' } });
    if (req.user.role === 'agent' && ticket.assignee_id !== req.user.id) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Agents can only update assigned tickets' } });
    }

    const sql = `UPDATE tickets SET ${sets.join(',')}, version = version + 1, updated_at = now() WHERE id = $1 AND version = $2 RETURNING *`;
    const r = await pool.query(sql, [id, clientVersion, ...vals]);

    if (!r.rowCount) return res.status(409).json({ error: { code: 'CONFLICT', message: 'Stale ticket version' } });

    const updated = r.rows[0];

    await pool.query(
      'INSERT INTO timeline (ticket_id, actor_id, action, metadata) VALUES($1,$2,$3,$4)',
      [id, req.user.id, 'updated', JSON.stringify({ patched_fields: Object.keys(req.body) })]
    );

    res.json({ ticket: updated });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: { code: 'SERVER_ERROR' } });
  }
}

// Post a comment (threaded)
export async function postComment(req, res) {
  const ticketId = req.params.id;
  const { body, parent_id = null } = req.body;
  if (!body) return res.status(400).json({ error: { code: 'FIELD_REQUIRED', field: 'body', message: 'Comment body required' } });

  try {
    const ticketR = await pool.query('SELECT * FROM tickets WHERE id=$1', [ticketId]);
    if (!ticketR.rowCount) return res.status(404).json({ error: { code: 'NOT_FOUND' } });
    const ticket = ticketR.rows[0];

    if (req.user.role === 'user' && ticket.requester_id !== req.user.id) {
      return res.status(403).json({ error: { code: 'FORBIDDEN' } });
    }
    if (req.user.role === 'agent' && ticket.assignee_id !== req.user.id) {
      return res.status(403).json({ error: { code: 'FORBIDDEN' } });
    }

    const r = await pool.query(
      'INSERT INTO comments (ticket_id, author_id, parent_id, body, created_at) VALUES($1,$2,$3,$4, now()) RETURNING *',
      [ticketId, req.user.id, parent_id, body]
    );

    const comment = r.rows[0];

    await pool.query(
      'INSERT INTO timeline (ticket_id, actor_id, action, metadata) VALUES($1,$2,$3,$4)',
      [ticketId, req.user.id, 'commented', JSON.stringify({ comment_id: comment.id })]
    );

    res.status(201).json({ comment });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: { code: 'SERVER_ERROR' } });
  }
}
