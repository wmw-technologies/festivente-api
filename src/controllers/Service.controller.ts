import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Service from '../models/Service.model';
import Device from '../models/Device.model';
import Employee from '../models/Employee.model';

class ServiceController {
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, perPage = 9999, sort = '_id', order = 'ASC' } = req.query;
      const totalRows = await Service.countDocuments();

      const response = await Service.find(
        {},
        {},
        {
          skip: (parseInt(page as string) - 1) * parseInt(perPage as string),
          limit: parseInt(perPage as string),
        }
      )
        .populate({
          path: 'device',
          populate: {
            path: 'warehouseId',
            model: 'Warehouse',
          }
        })
        .populate('servicePerson')
        .sort({ [sort as string]: order === 'ASC' ? 1 : -1 });

      response.forEach((item) => {
        const status = item.returnDate && !item.serviceDate ? 'Accepted' : item.serviceDate! <= new Date() ? 'Completed' : 'In Progress';
        item.set('status', status, { strict: false });
      });

      res.status(StatusCodes.OK).json({
        data: {
          items: response,
          totalRows,
        },
        message: 'Lista serwisów pobrana pomyślnie',
      });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd serwera' });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { returnDate, serviceDate, repairPrice, servicePerson, device, description } = req.body;

      const existingDevice = await Device.find({ _id: device });
      if (!existingDevice) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Urządzenie nie istnieje' });
        return;
      }

      if (serviceDate && returnDate && new Date(returnDate) > new Date(serviceDate)) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Data rozpoczęcia nie może być późniejsza niż data zakończenia',
          errors: {
            returnDate: 'Data rozpoczęcia nie może być późniejsza niż data zakończenia',
          },
        });
        return;
      }

      const existingEmployees = await Employee.find({ _id: servicePerson });
      if (!existingEmployees) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Pracownik nie istnieje' });
        return;
      }

      const existingService = await Service.find({
        $or: [
          { device: device, serviceDate: null },
          {
            device: device,
            rentalDate: {
              $gte: serviceDate,
              $lt: returnDate,
            },
          },
          {
            serviceDate: {
              $gt: serviceDate,
              $lte: returnDate,
            },
          },
        ],
      });

      if (existingService.length > 0) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Urządzenie jest już w serwisie', errors: { device: 'Urządzenie jest już w serwisie' } });
        return;
      }

      const service = new Service({ returnDate, serviceDate, repairPrice, servicePerson, device, description });
      const response = await service.save();

      res.status(StatusCodes.CREATED).json({ data: response, message: 'Serwis utworzony pomyślnie' });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd serwera' });
    }
  }

  static async get(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const service = await Service.findById(id)
        .populate('servicePerson')
        .populate({
          path: 'device',
          populate: {
            path: 'warehouseId',
            model: 'Warehouse',
          },
        });

      if (!service) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Serwis nie został znaleziony' });
        return;
      }

      const status = service.returnDate && !service.serviceDate ? 'Accepted' : service.serviceDate! <= new Date() ? 'Completed' : 'In Progress';
      service.set('status', status, { strict: false });

      res.status(StatusCodes.OK).json({ data: service, message: 'Serwis pobrany pomyślnie' });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd serwera' });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { returnDate, serviceDate, repairPrice, servicePerson, device, description } = req.body;

      const service = await Service.findById(id);
      if (!service) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Serwis nie został znaleziony' });
        return;
      }

      const status = service.returnDate && !service.serviceDate ? 'Accepted' : service.serviceDate! <= new Date() ? 'Completed' : 'In Progress';

      if (status === 'Completed') {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Nie można edytować zakończonego serwisu' });
        return;
      }

      if (serviceDate && returnDate && new Date(returnDate) > new Date(serviceDate)) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Data rozpoczęcia nie może być późniejsza niż data zakończenia',
          errors: {
            returnDate: 'Data rozpoczęcia nie może być późniejsza niż data zakończenia',
          },
        });
        return;
      }

      const existingDevices = await Device.find({ _id: device });
      if (!existingDevices) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Urządzenie nie istnieje' });
        return;
      }

      const existingEmployees = await Employee.find({ _id: servicePerson });
      if (!existingEmployees) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Pracownik nie istnieje' });
        return;
      }

      service.returnDate = returnDate;
      service.serviceDate = serviceDate;
      service.servicePerson = servicePerson;
      service.device = device;
      service.description = description;
      service.repairPrice = repairPrice;

      const response = await service.save();

      res.status(StatusCodes.OK).json({ data: response, message: 'Serwis zaktualizowany pomyślnie' });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd serwera' });
    }
  }
}

export default ServiceController;
