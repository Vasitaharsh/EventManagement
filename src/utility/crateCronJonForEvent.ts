import cron from 'node-cron';
import ScheduledEvent from '../models/ScheduledEvent';
import Event from '../models/Event';  


// Cron job to run every day at 12 PM
cron.schedule('0 12 * * *', async () => {
  try {
    const now = new Date();
    const scheduledEvents = await ScheduledEvent.find({ scheduledAt: { $lte: now } });

    for (const scheduledEvent of scheduledEvents) {
      const events = await Event.find({ _id: { $in: scheduledEvent.eventIds } });

      if (events) {
        for (const event of events) {
          console.log(`Triggering event: ${event.title} scheduled by admin:`);
         
        }

        await ScheduledEvent.findByIdAndDelete(scheduledEvent._id);
      }
    }
  } catch (error) {
    console.error('Error processing scheduled events:', error);
  }
});
