import ScheduledEvent, { IScheduledEvent } from '../models/ScheduledEvent'; // Adjust the path as needed

export class ScheduleService {
    async scheduleMultipleEvents  (eventIds: string[], scheduledAt: Date, adminId: string): Promise<IScheduledEvent>  {
        if (!Array.isArray(eventIds) || eventIds.length === 0) {
            throw new Error('Event IDs must be an array and cannot be empty.');
        }
        const scheduledEvent = new ScheduledEvent({
            eventIds,
            scheduledAt,
            adminId
        });

        return scheduledEvent.save();
    }
}