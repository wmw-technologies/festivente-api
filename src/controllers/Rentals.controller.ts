import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Rental from '../models/Rentals.model';
import Device from '../models/Device';

export default class RentalsController {
  static async list(_: Request, res: Response): Promise<void> {
    try {
      const rentals = await Rental.find().populate('devices');
      res.status(StatusCodes.OK).json({ data: rentals, message: 'Lista wypożyczeń pobrana pomyślnie' });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd serwera' });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate, companyName, phone, issuedBy, receivedBy, price, discount, devices } = req.body;

      if (new Date(startDate) > new Date(endDate)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Data rozpoczęcia nie może być późniejsza niż data zakończenia' });
        return;
      }

      const unavailableDevices = await Device.find({ _id: { $in: devices }, rentalId: { $ne: null } });
      if (unavailableDevices.length > 0) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Niektóre urządzenia są już wypożyczone',
          unavailableDevices,
        });
        return;
      }

      const rental = new Rental({
        startDate,
        endDate,
        companyName,
        phone,
        issuedBy,
        receivedBy,
        price,
        discount,
        devices,
      });
      const response = await rental.save();

      await Device.updateMany({ _id: { $in: devices } }, { $set: { rentalId: response._id } });

      res.status(StatusCodes.CREATED).json({ data: response, message: 'Wypożyczenie utworzone pomyślnie' });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd serwera' });
    }
  }

  static async get(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const rental = await Rental.findById(id).populate('devices');

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
      const { startDate, endDate, companyName, phone, issuedBy, receivedBy, price, discount, devices, ended } = req.body;

      if (new Date(startDate) > new Date(endDate)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Data rozpoczęcia nie może być późniejsza niż data zakończenia' });
        return;
      }

      const rental = await Rental.findById(id);
      if (!rental) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Wypożyczenie nie zostało znalezione' });
        return;
      }

      if (ended) {
        await Device.updateMany({ _id: { $in: rental.devices } }, { $set: { rentalId: null } });
      } else {
        const oldDevices = rental.devices || [];

        await Device.updateMany({ _id: { $in: oldDevices } }, { $set: { rentalId: null } });

        const unavailableDevices = await Device.find({ _id: { $in: devices }, rentalId: { $ne: null } });
        if (unavailableDevices.length > 0) {
          res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Niektóre urządzenia są już wypożyczone',
            unavailableDevices,
          });
          return;
        }

        await Device.updateMany({ _id: { $in: devices } }, { $set: { rentalId: rental._id } });
      }

      rental.startDate = startDate;
      rental.endDate = endDate;
      rental.companyName = companyName;
      rental.phone = phone;
      rental.issuedBy = issuedBy;
      rental.receivedBy = receivedBy;
      rental.price = price;
      rental.discount = discount;
      rental.devices = devices;
      rental.ended = ended;

      const response = await rental.save();

      res.status(StatusCodes.OK).json({ data: response, message: 'Wypożyczenie zaktualizowane pomyślnie' });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd serwera' });
    }
  }

  static async availableDevices(_: Request, res: Response): Promise<void> {
    try {
      const devices = await Device.find({ rentalId: null }).populate('warehouseId');

      res.status(StatusCodes.OK).json({ data: devices, message: 'Lista dostępnych urządzeń pobrana pomyślnie' });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd serwera' });
    }
  }

}
