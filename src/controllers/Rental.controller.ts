import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Rental from '../models/Rental.model';
import Device from '../models/Device.model';

export default class RentalController {
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, perPage = 9999, sort = '_id', order = 'ASC' } = req.query;
      const totalRows = await Rental.countDocuments();

      const response = await Rental.find(
        {},
        {},
        {
          skip: (parseInt(page as string) - 1) * parseInt(perPage as string),
          limit: parseInt(perPage as string),
        }
      )
        .populate('devices')
        .sort({ [sort as string]: order === 'ASC' ? 1 : -1 });

      res.status(StatusCodes.OK).json({
        data: {
          items: response,
          totalRows,
        },
        message: 'Lista wypożyczeń pobrana pomyślnie',
      });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd serwera' });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { clientName, clientCity, clientStreet, clientPostCode, clientPhone, clientEmail, rentalDate, returnDate, devices, inTotal, notes } = req.body;

      if (new Date(rentalDate) > new Date(returnDate)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Data rozpoczęcia nie może być późniejsza niż data zakończenia', errors: { rentalDate: 'Data rozpoczęcia nie może być późniejsza niż data zakończenia' } });
        return;
      }

      const date = new Date();

      if (date > new Date(rentalDate)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Data rozpoczęcia nie może być wcześniejsza niż dzisiejsza data', errors: { rentalDate: 'Data rozpoczęcia nie może być wcześniejsza niż dzisiejsza data' } });
        return;
      }

      const unavailableDevices = await Device.find({ _id: { $in: devices }, rentalId: { $ne: null } });
      if (unavailableDevices.length > 0) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Niektóre urządzenia są już wypożyczone',
          errors: { devices: 'Niektóre urządzenia są już wypożyczone' },
        });
        return;
      }

      const userId = (req as any).userId;
      const newRental = new Rental({
        clientName,
        clientCity,
        clientStreet,
        clientPostCode,
        clientPhone,
        clientEmail,
        rentalDate,
        returnDate,
        inTotal,
        notes,
        devices,
        createdBy: userId,
      });
      const response = await newRental.save();

      await Device.updateMany({ _id: { $in: devices } }, { $set: { rentalId: response._id } });

      res.status(StatusCodes.CREATED).json({ data: response, message: 'Wypożyczenie utworzone pomyślnie' });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd serwera' });
    }
  }

  static async get(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const rental = await Rental.findById(id).populate({
        path: 'devices',
        populate: {
          path: 'warehouseId',
          model: 'Warehouse'
        }
      });;

      if (!rental) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Wypożyczenie nie zostało znalezione' });
        return;
      }

      res.status(StatusCodes.OK).json({ data: rental, message: 'Wypożyczenie pobrane pomyślnie' });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd serwera' });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { clientName, clientCity, clientStreet, clientPostCode, clientPhone, clientEmail, rentalDate, returnDate, devices, inTotal, notes } = req.body;

      if (new Date(rentalDate) > new Date(returnDate)) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Data rozpoczęcia nie może być późniejsza niż data zakończenia',
          errors: {
            rentalDate: 'Data rozpoczęcia nie może być późniejsza niż data zakończenia',
          },
        });
        return;
      }

      const date = new Date();

      if (date > new Date(rentalDate)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Data rozpoczęcia nie może być wcześniejsza niż dzisiejsza data', errors: { rentalDate: 'Data rozpoczęcia nie może być wcześniejsza niż dzisiejsza data' } });
        return;
      }

      if (date > new Date(returnDate)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Data zakończenia nie może być wcześniejsza niż dzisiejsza data', errors: { returnDate: 'Data zakończenia nie może być wcześniejsza niż dzisiejsza data' } });
      }

      const rental = await Rental.findById(id);
      if (!rental) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Wypożyczenie nie zostało znalezione' });
        return;
      }

      const oldDevices = rental.devices || [];

      await Device.updateMany({ _id: { $in: oldDevices } }, { $set: { rentalId: null } });
      await Device.updateMany({ _id: { $in: devices } }, { $set: { rentalId: rental._id } });

      rental.clientName = clientName;
      rental.clientCity = clientCity;
      rental.clientStreet = clientStreet;
      rental.clientPostCode = clientPostCode;
      rental.clientPhone = clientPhone;
      rental.clientEmail = clientEmail;
      rental.rentalDate = rentalDate;
      rental.returnDate = returnDate;
      rental.inTotal = inTotal;
      rental.notes = notes;

      const response = await rental.save();

      res.status(StatusCodes.OK).json({ data: response, message: 'Wypożyczenie zaktualizowane pomyślnie' });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd serwera' });
    }
  }

  static async availableDevices(req: Request, res: Response): Promise<void> {
    try {
      const { id, rentalDate, returnDate } = req.query;
      
      const devices = await Device.find({
        $or: [
          { rentalId: null },
          { rentalId: id }
        ]
      }).populate('warehouseId');

      res.status(StatusCodes.OK).json({ data: devices, message: 'Lista dostępnych urządzeń pobrana pomyślnie' });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd serwera' });
    }
  }
}
