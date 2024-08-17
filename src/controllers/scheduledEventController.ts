import { Request, Response } from 'express';
import { ScheduleService } from '../services/scheduledEventService'; // Adjust the path as needed

const scheduleService = new ScheduleService();

export class ScheduleController {
    async scheduleMultipleEventsController(req: Request, res: Response): Promise<void> {
        const { eventIds, scheduledAt, adminId } = req.body;
        try {
            const scheduledEvent = await scheduleService.scheduleMultipleEvents(eventIds, new Date(scheduledAt), adminId);
            res.status(201).json({ message: 'Events scheduled successfully', scheduledEvent });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            res.status(400).json({ message: errorMessage });
        }
    };
}
