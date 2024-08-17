import cron from 'node-cron';
import { Op } from 'sequelize';
import { ScheduledEvent } from '../models/ScheduledEvent';
import { Event } from '../models/Event';

cron.schedule('0 12 * * *', async () => {
  try {
    const now = new Date();
    
    // Find scheduled events where scheduledAt is less than or equal to the current time
    const scheduledEvents = await ScheduledEvent.findAll({
      where: {
        scheduledAt: {
          [Op.lte]: now,
        },
      },
    });

    for (const scheduledEvent of scheduledEvents) {
      // Find all events associated with the scheduled event
      const events = await Event.findAll({
        where: {
          id: {
            [Op.in]: scheduledEvent.eventIds,
          },
        },
      });

      if (events.length > 0) {
        for (const event of events) {
          console.log(`Triggering event: ${event.title} scheduled by admin: ${scheduledEvent.createdBy}`);
        }

        // Delete the scheduled event after processing
        await ScheduledEvent.destroy({
          where: { id: scheduledEvent.id },
        });
      }
    }
  } catch (error) {
    console.error('Error processing scheduled events:', error);
  }
});
