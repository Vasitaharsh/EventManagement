import { Router } from 'express';
import {ScheduleController}  from '../controllers/scheduledEventController';
import  verifyTokenAndRole from '../middlewares/authMiddleware';

const router = Router();

const scheduleController = new ScheduleController();
router.post('/schedule-multiple',verifyTokenAndRole(['admin']), scheduleController.scheduleMultipleEventsController);

export default router;
