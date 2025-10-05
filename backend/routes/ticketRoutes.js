import express from 'express';
import protect from '../middleware/auth.js';
import idempotency from '../middleware/idempotency.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import {
  createTicket,
  listTickets,
  getTicket,
  patchTicket,
  postComment
} from '../controllers/ticketController.js';

const router = express.Router();

// Create ticket (POST) - idempotent, only users can create
router.post('/', protect, authorizeRoles('user'), idempotency, createTicket);

// List tickets with pagination, search, breached filter
router.get('/', protect, listTickets);

// Get ticket detail with comments + timeline
router.get('/:id', protect, getTicket);

// Patch ticket with optimistic lock (If-Match header)
// Admin: any ticket, Agent: assigned tickets, User: cannot patch
router.patch('/:id', protect, patchTicket);

// Post comment (threaded)
// Admin: any ticket, Agent: assigned tickets, User: their own tickets
router.post('/:id/comments', protect, postComment);

export default router;
