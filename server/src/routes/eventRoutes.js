import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerAttendee,
  getCategories
} from '../controllers/eventController.js';

const router = express.Router();

router.get('/events', getEvents);
router.get('/events/:id', getEventById);
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);
router.post('/events/:id/register', registerAttendee);
router.get('/categories', getCategories);

export default router;
