import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Transport from '../models/Transport.model';

export default class TransportController {
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, perPage = 9999, sort = '_id', order = 'ASC' } = req.query;
      const totalRows = await Transport.countDocuments();
      const response = await Transport.find(
        {},
        {},
        {
          skip: (parseInt(page as string) - 1) * parseInt(perPage as string),
          limit: parseInt(perPage as string),
        }
      )
        .populate('driver')
        .populate('event')
        .sort({ [sort as string]: order === 'ASC' ? 1 : -1 });

      res.status(StatusCodes.OK).json({
        data: {
          items: response,
          totalRows,
        },
        message: 'Transport items retrieved successfully',
      });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { vehicleType, vehicleDetails, driver, event, departureTime, arrivalTime, departureLocation, destinationLocation, notes } = req.body;

      if (arrivalTime && new Date(departureTime) > new Date(arrivalTime)) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Data przyjazdu nie może być wcześniejsza niż data odjazdu',
          errors: {
            arrivalTime: 'Data przyjazdu nie może być wcześniejsza niż data odjazdu',
          },
        });
        return;
      }

      const userId = (req as any).userId;
      const newTransport = new Transport({
        vehicleType,
        vehicleDetails,
        driver,
        event,
        departureTime,
        arrivalTime,
        departureLocation,
        destinationLocation,
        notes,
        status: 'active',
        createdBy: userId,
      });

      const response = await newTransport.save();
      res.status(StatusCodes.CREATED).json({ message: 'Wydarzenie zostało dodane', data: response });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }

  static async get(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const item = await Transport.findById(id).populate('driver').populate('event').populate('vehicleDetails');

      if (!item) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Transport item not found' });
        return;
      }
      res.status(StatusCodes.OK).json({ data: item, message: 'Transport item retrieved successfully' });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { vehicleType, vehicleDetails, driver, event, departureTime, arrivalTime, departureLocation, destinationLocation, notes } = req.body;

      const existingTransport = await Transport.findById(id);
      if (!existingTransport) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Transport nie istnieje' });
        return;
      }

      if (arrivalTime && new Date(departureTime) > new Date(arrivalTime)) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Data przyjazdu nie może być wcześniejsza niż data odjazdu',
          errors: {
            arrivalTime: 'Data przyjazdu nie może być wcześniejsza niż data odjazdu',
          },
        });
        return;
      }

      const updatedItem = await Transport.findByIdAndUpdate(
        id,
        {
          vehicleType,
          vehicleDetails,
          driver,
          event,
          departureTime,
          arrivalTime,
          departureLocation,
          destinationLocation,
          notes,
        },
        { new: true }
      );
      res.status(StatusCodes.OK).json({ message: 'Trasnport został zaktualizowany', data: updatedItem });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }
}
