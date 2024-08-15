import mongoose, { Schema, Document } from 'mongoose';

export interface IScheduledEvent extends Document {
  eventIds: mongoose.Types.ObjectId[];
  scheduledAt: Date;
  createdBy: mongoose.Types.ObjectId;
}

const scheduledEventSchema: Schema = new Schema({
  eventIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    }
  ],
  scheduledAt: {
    type: Date,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const ScheduledEvent = mongoose.model<IScheduledEvent>('ScheduledEvent', scheduledEventSchema);

export default ScheduledEvent;
