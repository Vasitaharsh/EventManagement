import Event, { IEvent } from '../models/Event';
import EventReaction, { ReactionType } from '../models/EventReaction';
import Image from '../models/Image';

class EventService {
    async createEvent(files: Express.Multer.File[],eventData: Partial<IEvent>, userId: string): Promise<IEvent> {
        const imagePromises = files.map(file => {
            const newImage = new Image({
                filename: file.filename,
                path: file.path
            });

            return newImage.save();
        });

        const savedImages = await Promise.all(imagePromises);

        // Step 2: Extract image IDs for the event
        const imageIds = savedImages.map(image => image._id);

        // Step 3: Create the event
        const event = new Event({
            ...eventData,
            eventImages: imageIds,
            createdBy: userId
        });

        const savedEvent = await event.save();
        return savedEvent;
      }
      async getEventById(eventId: string): Promise<IEvent | null> {
        
        const event = await Event.findById(eventId);
        if(!event) throw new Error('event not exists')
        return event
      }
    
      async updateEvent(eventId: string, eventData: Partial<IEvent>): Promise<IEvent | null> {
        
        const event = await Event.findById(eventId);
        if(!event) throw new Error('event not exists')
            const updatedEvent = await Event.findByIdAndUpdate(eventId, eventData, { new: true });

    if (!updatedEvent) {
      throw new Error('Error updating event');
    }

    return updatedEvent;
      }
    
      async deleteEvent(eventId: string): Promise<IEvent | null> {
        const event = await Event.findById(eventId);
    if (!event) {
      throw new Error('Event does not exist');
    }
    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      throw new Error('Error deleting event');
    }

    return deletedEvent;
      }
  async listEvents(page: number, limit: number, title?: string, city?: string, startDate?: string, endDate?: string) {
    const query: any = {};

  if (title) query.title = new RegExp(title, 'i');
  if (city) query.city = city;
  if (startDate && endDate)
    {
     query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
  else if (startDate) {
    query.date = { $gte: new Date(startDate as string) };
  } else if (endDate) {
    query.date = { $lte: new Date(endDate as string) };
  }

  const skip = (page - 1) * limit;

  const events = await Event.aggregate([
    { $match: query },
    {
      $lookup: {
        from: 'eventreactions',
        localField: '_id',
        foreignField: 'eventId',
        as: 'reactions',
      },
    },
    {
      $addFields: {
        likesCount: {
          $size: {
            $filter: {
              input: '$reactions',
              as: 'reaction',
              cond: { $eq: ['$$reaction.reaction', ReactionType.Like] },
            },
          },
        },
        dislikesCount: {
          $size: {
            $filter: {
              input: '$reactions',
              as: 'reaction',
              cond: { $eq: ['$$reaction.reaction', ReactionType.Dislike] },
            },
          },
        },
      },
    },
    {
      $project: {
        title: 1,
        description: 1,
        email: 1,
        phone: 1,
        address: 1,
        city: 1,
        organizerDetails: 1,
        paidStatus: 1,
        eventImages: 1,
        displayStatus: 1,
        createdBy: 1,
        likesCount: 1,
        dislikesCount: 1,
      },
    },
    { $skip: skip },
    { $limit: limit },
  ]).exec();


  const totalRecords = await Event.countDocuments(query).exec();
  const totalPages = Math.ceil(totalRecords / limit);

  return {
    totalRecords,
    totalPages,
    currentPage: page,
    limit,
    events
  };
  }


  async updateEventStatus(eventId: string, status: boolean) {
    return Event.findByIdAndUpdate(eventId, { displayStatus: status }, { new: true });
  }

  async generateReports(startDate?: string, endDate?: string) {
    const query: any = {};

    if (startDate && endDate) query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };

    const paidEvents = await Event.aggregate([
      { $match: { ...query, paidStatus: true } },
      { $group: { _id: null, total: { $sum: 1 } } },
    ]);

    const unpaidEvents = await Event.aggregate([
      { $match: { ...query, paidStatus: false } },
      { $group: { _id: null, total: { $sum: 1 } } },
    ]);

    return {
      paidEvents: paidEvents[0]?.total || 0,
      unpaidEvents: unpaidEvents[0]?.total || 0,
    };
  }

  async likeOrDislikeEvent(eventId: string, userId: string, reaction: ReactionType) {
    const existingReaction = await EventReaction.findOne({ eventId, userId });

  if (existingReaction) {
    if (existingReaction.reaction === reaction) {
      return; 
    }
    if (reaction === ReactionType.Like) {
      await Event.findByIdAndUpdate(eventId, {
        $inc: { likesCount: 1, dislikesCount: -1 },
      });
    } else {
      await Event.findByIdAndUpdate(eventId, {
        $inc: { likesCount: -1, dislikesCount: 1 },
      });
    }

    existingReaction.reaction = reaction;
    await existingReaction.save();
  } else {
    await EventReaction.create({ eventId, userId, reaction });

    if (reaction === ReactionType.Like) {
      await Event.findByIdAndUpdate(eventId, { $inc: { likesCount: 1 } });
    } else {
      await Event.findByIdAndUpdate(eventId, { $inc: { dislikesCount: 1 } });
    }
  }
  }
}

export default new EventService();
