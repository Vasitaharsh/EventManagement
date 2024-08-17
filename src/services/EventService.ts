import { Event, IEventAttributes } from '../models/Event'; // Adjust path as necessary
import { EventReaction, ReactionType } from '../models/EventReaction'; // Adjust path as necessary
import { Image } from '../models/Image'; // Adjust path as necessary
import { sequelize } from '../models/indes';
import { Op } from 'sequelize';

class EventService {
 async createEvent(files: Express.Multer.File[], eventData: Partial<IEventAttributes>, userId: string): Promise<IEventAttributes> {
        // Ensure eventData contains required fields
        const { title, description, email, phone, address, city, organizerDetails, paidStatus, displayStatus } = eventData;

        if (!title || !description || !email || !phone || !address || !city || !organizerDetails || paidStatus === undefined || displayStatus === undefined) {
            throw new Error('Missing required event data');
        }

        // Create the event first
        const event = new Event({
            title,
            description,
            email,
            phone,
            address,
            city,
            organizerDetails,
            paidStatus,
            displayStatus,
            createdBy: userId
        });

        const savedEvent = await event.save();

        // Save images and associate with the event
        const imagePromises = files.map(file => {
            const newImage = new Image({
                filename: file.filename,
                path: file.path,
                eventId: savedEvent.id // Ensure the eventId is provided
            });

            return newImage.save();
        });

        const savedImages = await Promise.all(imagePromises);

        // Update the event with the associated images
        await savedEvent.update({ eventImages: savedImages.map(image => image.id) });

        return savedEvent;
    }

  async getEventById(eventId: string): Promise<IEventAttributes | null> {
    const event = await Event.findByPk(eventId, {
      include: [
        { model: Image, as: 'eventImages' },
        { model: EventReaction, as: 'reactions' }
      ]
    });

    if (!event) throw new Error('Event does not exist');
    return event;
  }

  async updateEvent(eventId: string, eventData: Partial<IEventAttributes>): Promise<IEventAttributes | null> {
    // Perform the update operation
    const [affectedCount] = await Event.update(eventData, {
        where: { id: eventId }
    });

    // Check if any rows were updated
    if (affectedCount === 0) {
        throw new Error('Error updating event');
    }

    // Fetch the updated event instance
    const updatedEvent = await Event.findByPk(eventId);

    if (!updatedEvent) {
        throw new Error('Event not found');
    }

    return updatedEvent;
}

async deleteEvent(eventId: string): Promise<IEventAttributes | null> {
  const eventToDelete = await Event.findOne({
      where: { id: eventId }
  });

  if (!eventToDelete) {
      throw new Error('Event does not exist');
  }

  await Event.destroy({
      where: { id: eventId }
  });

  return eventToDelete;
}

  async listEvents(page: number, limit: number, title?: string, city?: string, startDate?: string, endDate?: string) {
    const query: any = {};

    if (title) query.title = { [Op.iLike]: `%${title}%` }; // Use Op.iLike for case-insensitive matching
    if (city) query.city = city;
    if (startDate && endDate) {
      query.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    } else if (startDate) {
      query.createdAt = { [Op.gte]: new Date(startDate) };
    } else if (endDate) {
      query.createdAt = { [Op.lte]: new Date(endDate) };
    }

    const skip = (page - 1) * limit;

    const events = await Event.findAndCountAll({
      where: query,
      include: [
        {
          model: EventReaction,
          as: 'reactions',
          attributes: []
        }
      ],
      attributes: {
        include: [
          [sequelize.literal(`(
            SELECT COUNT(*) FROM "EventReactions"
            WHERE "EventReactions"."eventId" = "Event"."id"
            AND "EventReactions"."reaction" = 'like'
          )`), 'likesCount'],
          [sequelize.literal(`(
            SELECT COUNT(*) FROM "EventReactions"
            WHERE "EventReactions"."eventId" = "Event"."id"
            AND "EventReactions"."reaction" = 'dislike'
          )`), 'dislikesCount']
        ]
      },
      limit,
      offset: skip
    });

    const totalRecords = events.count;
    const totalPages = Math.ceil(totalRecords / limit);

    return {
      totalRecords,
      totalPages,
      currentPage: page,
      limit,
      events: events.rows
    };
  }

  async updateEventStatus(eventId: string, status: boolean): Promise<IEventAttributes | null> {
    // Perform the update operation
    const [affectedCount] = await Event.update({ displayStatus: status }, {
        where: { id: eventId }
    });

    // Check if any rows were updated
    if (affectedCount === 0) {
        throw new Error('Error updating event status');
    }

    // Fetch the updated event instance
    const updatedEvent = await Event.findByPk(eventId);

    if (!updatedEvent) {
        throw new Error('Event not found');
    }

    return updatedEvent;
}


  async generateReports(startDate?: string, endDate?: string) {
    const query: any = {};

    if (startDate && endDate) {
      query.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }

    const paidEvents = await Event.count({
      where: { ...query, paidStatus: true }
    });

    const unpaidEvents = await Event.count({
      where: { ...query, paidStatus: false }
    });

    return {
      paidEvents,
      unpaidEvents
    };
  }

  async likeOrDislikeEvent(eventId: string, userId: string, reaction: ReactionType) {
    const existingReaction = await EventReaction.findOne({
      where: { eventId, userId }
    });

    if (existingReaction) {
      if (existingReaction.reaction === reaction) {
        return; // No change needed
      }

      if (reaction === ReactionType.Like) {
        await Event.increment({ likesCount: 1, dislikesCount: -1 }, { where: { id: eventId } });
      } else {
        await Event.increment({ likesCount: -1, dislikesCount: 1 }, { where: { id: eventId } });
      }

      existingReaction.reaction = reaction;
      await existingReaction.save();
    } else {
      await EventReaction.create({ eventId, userId, reaction });

      if (reaction === ReactionType.Like) {
        await Event.increment({ likesCount: 1 }, { where: { id: eventId } });
      } else {
        await Event.increment({ dislikesCount: 1 }, { where: { id: eventId } });
      }
    }
  }
}

export default new EventService();
