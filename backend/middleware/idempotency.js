import pool from '../config/db.js';

export default async function idempotency(req, res, next) {
  if (req.method !== 'POST') return next();
  const key = req.header('Idempotency-Key');
  const userId = req.user?.id || null;
  if (!key) return res.status(400).json({ error: { code: 'FIELD_REQUIRED', field: 'Idempotency-Key', message: 'Idempotency-Key required' } });
  try {
    const existing = await pool.query(
      'SELECT response_status, response_body FROM idempotency_keys WHERE key=$1 AND user_id=$2 AND request_path=$3 AND request_method=$4',
      [key, userId, req.path, req.method]
    );
    if (existing.rowCount && existing.rows[0].response_status) {
      const r = existing.rows[0];
      return res.status(r.response_status).json(r.response_body);
    }

    // patch res.json to store later
    const origJson = res.json.bind(res);
    res.json = async function (body) {
      try {
        await pool.query(
          `INSERT INTO idempotency_keys (key,user_id,request_method,request_path,request_body,response_status,response_body)
           VALUES($1,$2,$3,$4,$5,$6,$7)
           ON CONFLICT (key,user_id,request_path,request_method) DO UPDATE
           SET response_status=EXCLUDED.response_status,response_body=EXCLUDED.response_body`,
          [key, userId, req.method, req.path, req.body || null, res.statusCode || 200, body]
        );
      } catch (e) {
        console.error('idempotency store failed', e);
      }
      return origJson(body);
    };

    return next();
  } catch (e) {
    console.error('idempotency check error', e);
    return res.status(500).json({ error: { code: 'SERVER_ERROR' } });
  }
}
