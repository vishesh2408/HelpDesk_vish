import { addTimelineEntry } from '../models/Timeline.js';

export const logAction = async ({ ticket_id, action, user_id }) => {
  return await addTimelineEntry({ ticket_id, action, performed_by: user_id });
};
