import mongoose, { Schema, Document } from 'mongoose';

enum ReactionType {
  Like = 'like',
  Dislike = 'dislike',
}

interface IEventReaction extends Document {
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  reaction: ReactionType;
}

const eventReactionSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  reaction: {
    type: String,
    enum: Object.values(ReactionType),
    required: true,
  },
}, {
  timestamps: true,
  unique: ['userId', 'eventId'],
});

const EventReaction = mongoose.model<IEventReaction>('EventReaction', eventReactionSchema);

export default EventReaction;
export { ReactionType };
