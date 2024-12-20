import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Rental from '../models/Rental.model';
import Device from '../models/Device.model';
import Service from '../models/Service.model';

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

      response.forEach((item) => {
        const status = item.rentalDate > new Date() ? 'Scheduled' : item.returnDate > new Date() ? 'In Progress' : item.isPaid ? 'Completed Paid' : 'Complated Not Paid';
        item.set('status', status, { strict: false });
      });

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
      const { clientName, clientCity, clientStreet, clientPostCode, clientPhone, clientEmail, rentalDate, returnDate, devices, inTotal, notes, paymentForm, isPaid, discount } = req.body;

      if (new Date(rentalDate) > new Date(returnDate)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Data rozpoczęcia nie może być późniejsza niż data zakończenia', errors: { rentalDate: 'Data rozpoczęcia nie może być późniejsza niż data zakończenia' } });
        return;
      }

      const MINIMUM_RENTAL_MS = 3600 * 1000; // 1 hour

      if (new Date(rentalDate) > new Date(new Date(returnDate).getTime() - MINIMUM_RENTAL_MS)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Wypożycznie musi trwać przynajmniej 1 godzinę', errors: { rentalDate: 'Wypożycznie musi trwać przynajmniej 1 godzinę' } });
        return;
      }

      const date = new Date();

      if (date > new Date(rentalDate)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'Data rozpoczęcia nie może być wcześniejsza niż dzisiejsza data', errors: { rentalDate: 'Data rozpoczęcia nie może być wcześniejsza niż dzisiejsza data' } });
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
        paymentForm,
        isPaid,
        discount,
        createdBy: userId,
      });
      const response = await newRental.save();

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
          model: 'Warehouse',
        },
      });

      
      if (!rental) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Wypożyczenie nie zostało znalezione' });
        return;
      }
      
      const status = rental.rentalDate > new Date() ? 'Scheduled' : rental.returnDate > new Date() ? 'In Progress' : 'Completed';
      rental.set('status', status, { strict: false });

      res.status(StatusCodes.OK).json({ data: rental, message: 'Wypożyczenie pobrane pomyślnie' });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd serwera' });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { clientName, clientCity, clientStreet, clientPostCode, clientPhone, clientEmail, rentalDate, returnDate, devices, inTotal, notes, paymentForm, isPaid, discount } = req.body;

      const rental = await Rental.findById(id);
      if (!rental) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Wypożyczenie nie zostało znalezione' });
        return;
      }

      const status = rental.rentalDate > new Date() ? 'Scheduled' : rental.returnDate > new Date() ? 'In Progress' : 'Completed';

      if (status === 'Completed') {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Nie można edytować zakończonego wypożyczenia' });
        return;
      }

      if (status === 'In Progress' && new Date(rentalDate) < new Date()) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Nie można edytować wypożyczenia w trakcie trwania' });
        return;
      }

      if (new Date(rentalDate) > new Date(returnDate)) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Data rozpoczęcia nie może być późniejsza niż data zakończenia',
          errors: {
            rentalDate: 'Data rozpoczęcia nie może być późniejsza niż data zakończenia',
          },
        });
        return;
      }

      const MINIMUM_RENTAL_MS = 3600 * 1000; // 1 hour

      if (new Date(rentalDate) > new Date(new Date(returnDate).getTime() - MINIMUM_RENTAL_MS)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Wypożycznie musi trwać przynajmniej 1 godzinę', errors: { rentalDate: 'Wypożycznie musi trwać przynajmniej 1 godzinę' } });
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
      rental.devices = devices;
      rental.paymentForm = paymentForm;
      rental.isPaid = isPaid;
      rental.discount = discount;

      const response = await rental.save();

      res.status(StatusCodes.OK).json({ data: response, message: 'Wypożyczenie zaktualizowane pomyślnie' });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd serwera' });
    }
  }

  static async availableDevices(req: Request, res: Response): Promise<void> {
    try {
      const { rentalDate, returnDate } = req.query;

      const rentals = await Rental.find({
        $or: [
          {
            rentalDate: {
              $gte: rentalDate,
              $lt: returnDate,
            },
          },
          {
            returnDate: {
              $gt: rentalDate,
              $lte: returnDate,
            },
          },
        ],
      });

      const services = await Service.find({
        $or: [
          {
            rentalDate: {
              $gte: rentalDate,
              $lt: returnDate,
            },
          },
          {
            returnDate: {
              $gt: rentalDate,
              $lte: returnDate,
            },
          },
        ],
      });

      // let excludedDevices: string[] = [];

      // if (id) {
      //   const rental = await Rental.findById(id);

      //   if (rental) {
      //     const rentalDevices = rental.devices.map((device) => device._id.toString());

      //     excludedDevices = [...rentalDevices];
      //   }
      // }

      const unavailableDevicesRentals = rentals
        .map((rental) => rental.devices)
        .flat()
        .map((device) => device._id)
        // .filter((device) => !excludedDevices.includes(device._id.toString()));

      const unavailableDevicesServices = services
        .map((service) => service.device)
        .flat()
        .map((device) => device._id);

      const unavailableDevices = [...unavailableDevicesServices, ...unavailableDevicesRentals];
      const availableDevices = await Device.find({ _id: { $nin: unavailableDevices } }).populate('warehouseId');

      res.status(StatusCodes.OK).json({ data: availableDevices, message: 'Lista dostępnych urządzeń pobrana pomyślnie' });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd serwera' });
    }
  }
}
