import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Event from '../models/Event.model';

export default class EventController {
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, perPage = 9999, sort = '_id', order = 'ASC' } = req.query;
      const totalRows = await Event.countDocuments();
      const response = await Event.find(
        {},
        {},
        {
          skip: (parseInt(page as string) - 1) * parseInt(perPage as string),
          limit: parseInt(perPage as string),
        }
      )
        .populate('assignedEmployees')
        .sort({ [sort as string]: order === 'ASC' ? 1 : -1 });

      res.status(StatusCodes.OK).json({
        data: {
          items: response,
          totalRows,
        },
        message: 'Event items retrieved successfully',
      });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { eventName, clientName, clientEmail, clientPhone, date, description, location, budget, assignedEmployees, estimatedHours, actualHours, notes } = req.body;

      const existingEventName = await Event.findOne({ eventName });
      if (existingEventName) {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: 'Wydarzenie o podanej nazwie już istnieje', errors: { eventName: 'Wydarzenie o podanej nazwie już istnieje' } });
        return;
      }

      const userId = (req as any).userId;

      const newEvent = new Event({
        eventName,
        clientName,
        clientEmail,
        clientPhone,
        date,
        description,
        location,
        budget,
        assignedEmployees,
        estimatedHours,
        actualHours,
        notes,
        status: 'Pending',
        createdBy: userId,
      });

      console.log(newEvent);

      const response = await newEvent.save().catch((err) => {
        console.log(err);
      });
      res.status(StatusCodes.CREATED).json({ message: 'Wydarzenie zostało dodane', data: response });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }

  static async get(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const item = await Event.findById(id).populate('assignedEmployees');
      if (!item) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Event item not found' });
        return;
      }

      res.status(StatusCodes.OK).json({ data: item, message: 'Event item retrieved successfully' });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { eventName, clientName, clientEmail, clientPhone, date, description, location, budget, assignedEmployees, estimatedHours, actualHours, notes } = req.body;

      const existingEvent = await Event.findById(id);
      if (!existingEvent) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Wydarzenie nie istnieje' });
        return;
      }

      const existingEventName = await Event.findOne({ eventName });
      if (existingEventName && existingEventName._id.toString() !== id) {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: 'Wydarzenie o podanej nazwie już istnieje', errors: { eventName: 'Wydarzenie o podanej nazwie już istnieje' } });
        return;
      }

      const updatedItem = await Event.findByIdAndUpdate(
        id,
        {
          eventName,
          clientName,
          clientEmail,
          clientPhone,
          date,
          description,
          location,
          budget,
          assignedEmployees,
          estimatedHours,
          actualHours,
          notes,
        },
        { new: true }
      ).catch((err) => {
        console.log(err);
      });

      res.status(StatusCodes.OK).json({ message: 'Wydarzenie zostało zaktualizowane', data: updatedItem });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }
}
