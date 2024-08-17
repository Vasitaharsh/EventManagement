import { Request, Response, NextFunction } from 'express';
import eventService from '../services/EventService';
import { AuthRequest } from '../types/types';
import { ReactionType } from '../models/EventReaction';
import { Types } from 'mongoose';

class EventController {

    async createEvent(req: AuthRequest, res: Response): Promise<void | any> {
        const files = req.files as Express.Multer.File[];
        const { title, description, email, phone, address, city, organizerDetails, paidStatus, displayStatus, likesCount, dislikesCount } = req.body;

        if (!files || files.length === 0) return res.status(400).send('No files uploaded.');

        
        try {
            if (!req.user) {
                res.status(401).json({ message: 'User not authenticated' });
                return;
             }
             
             const userId = req.user.id;
             const eventData = {
                title,
                description,
                email,
                phone,
                address,
                city,
                organizerDetails,
                paidStatus,
                displayStatus,
                likesCount,
                dislikesCount,
                userId,
            };

          const createdEvent = await eventService.createEvent(files, eventData, userId);
          
          const eventUrl = `https://localhost:5000/api/events/getById/${createdEvent._id}`;

          
          res.status(201).json({
            message: 'Event created successfully',
            event: createdEvent,
            shareableUrl: eventUrl,
          });;
        } catch (error) {
          res.status(500).json({ message: "error created event" });
        }
      }
      async getEvent(req: Request, res: Response): Promise<void> {
        try {
            const eventId = req.params.id;
          const event = await eventService.getEventById(eventId);
          if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
          }
          res.status(200).json(event);
        } catch (err) {
            
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
          res.status(500).json({ message: errorMessage });
        }
      }
  async listEvents(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, title, city, startDate, endDate } = req.query;
      const events = await eventService.listEvents(Number(page), Number(limit), title as string, city as string, startDate as string, endDate as string);
      res.json(events);
    } catch (error) {

      res.status(500).json({ message: 'Error resetting password', error });
    }
  }

  async updateEvent(req: Request, res: Response): Promise<void> {
    try {
      const event = await eventService.updateEvent(req.params.id, req.body);
      if (!event) {
        res.status(404).json({ message: 'Event not found' });
        return;
      }
      res.status(200).json(event);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      res.status(500).json({ message: errorMessage });
    }
  }

  async deleteEvent(req: Request, res: Response): Promise<void> {
    try {
      const event = await eventService.deleteEvent(req.params.id);
      if (!event) {
        res.status(404).json({ message: 'Event not found' });
        return;
      }
      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
        
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      res.status(500).json({ message: errorMessage });
    }
  }


  async updateEventStatus(req: Request, res: Response) {
    try {
      const { eventId, status } = req.body;
      const updatedEvent = await eventService.updateEventStatus(eventId, status);
      res.json(updatedEvent);
    } catch (error) {
      res.status(500).json({ message: 'Error resetting password', error });
    }
  }

  async generateReports(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const reports = await eventService.generateReports(startDate as string, endDate as string);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: 'Error resetting password', error });
    }
  }
  async likeOrDislikeEvent(req: AuthRequest, res: Response) {
    const { eventId } = req.params;
  const userId = req.user?.id;
  const { reaction } = req.body;

  if (!userId) {
    res.status(401).json({ message: 'User not authenticated' });
    return;
 }

  if (![ReactionType.Like, ReactionType.Dislike].includes(reaction)) {
    return res.status(400).json({ error: 'Invalid reaction type' });
  }

  try {
    await eventService.likeOrDislikeEvent(eventId, userId, reaction);
    res.status(200).json({ message: 'Reaction recorded' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating reaction' });
  }
  }
  async payForEvent(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { eventId } = req.params;
        const userId = req.user?.id; 
        
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return
        }

        // Convert eventId and userId to ObjectId
        const eventObjectId = new Types.ObjectId(eventId);
        const userObjectId = new Types.ObjectId(userId);

        const { amount } = req.body;

        if (!amount || isNaN(amount)) {
             res.status(400).json({ message: 'Invalid amount' });
             return
        }

        // Call the service method to handle the payment
        const payment = await eventService.payForEvent(eventObjectId, userObjectId, amount);

        res.status(200).json({ message: 'Payment successful', payment });
    } catch (error) {
        next(error); // Pass errors to the error-handling middleware
    }
}
}

export default new EventController();
