import { Router } from 'express';
import EventController from '../controllers/EventController';
import  verifyTokenAndRole from '../middlewares/authMiddleware';
import upload from '../middlewares/upload';

const router = Router();

router.post('/create', verifyTokenAndRole(['user']),upload.array('images', 10), EventController.createEvent);
router.get('/getById/:id', verifyTokenAndRole(['user']), EventController.getEvent);
router.put('/events/:id', verifyTokenAndRole(['user']),upload.array('images', 10), EventController.updateEvent);
router.delete('/events/:id', verifyTokenAndRole(['user']), EventController.deleteEvent);

router.get('/getAllEvents',verifyTokenAndRole(['admin']), EventController.listEvents);
router.patch('/events/status',verifyTokenAndRole(['admin']), EventController.updateEventStatus);
router.get('/reports',verifyTokenAndRole(['admin']), EventController.generateReports);
router.post('/:eventId/reaction',verifyTokenAndRole(['user']), EventController.likeOrDislikeEvent);

export default router;
