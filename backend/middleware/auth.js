import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default function auth(req, res, next) {
  const h = req.header('Authorization');
  if (!h || !h.startsWith('Bearer ')) return res.status(401).json({ error: { code: 'UNAUTHENTICATED' } });
  const token = h.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role };
    return next();
  } catch (e) {
    return res.status(401).json({ error: { code: 'UNAUTHENTICATED' } });
  }
}
