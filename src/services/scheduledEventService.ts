// src/services/ScheduleService.ts
import {ScheduledEvent,  IScheduledEventAttributes } from '../models/ScheduledEvent'; // Adjust the path as needed

export class ScheduleService {
    async scheduleMultipleEvents(eventIds: string[], scheduledAt: Date, adminId: string): Promise<IScheduledEventAttributes> {
        if (!Array.isArray(eventIds) || eventIds.length === 0) {
            throw new Error('Event IDs must be an array and cannot be empty.');
        }

        if (!scheduledAt || !(scheduledAt instanceof Date)) {
            throw new Error('Invalid scheduledAt date.');
        }

        // Optionally, you can add more validation for eventIds, like checking if they exist in the database

        const scheduledEvent = await ScheduledEvent.create({
            eventIds,
            scheduledAt,
            createdBy: adminId,
        });

        return scheduledEvent;
    }
}

export default new ScheduleService();
