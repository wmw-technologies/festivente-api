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
        .populate('devices')
        .populate('servicePerson')
        .sort({ [sort as string]: order === 'ASC' ? 1 : -1 });

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
      const { returnDate, serviceDate, servicePerson, devices } = req.body;

      const existingDevices = await Device.find({ _id: { $in: devices } });
      if (existingDevices.length !== devices.length) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Niektóre urządzenia nie istnieją' });
        return;
      }

      const existingEmployees = await Employee.find({ _id: { $in: servicePerson } });
      if (existingEmployees.length !== servicePerson.length) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Niektórzy pracownicy nie istnieją' });
        return;
      }

      console.log('servicePerson', returnDate, serviceDate, servicePerson, devices);

      const service = new Service({ returnDate, serviceDate, servicePerson, devices });
      const response = await service.save();

      res.status(StatusCodes.CREATED).json({ data: response, message: 'Serwis utworzony pomyślnie' });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd serwera' });
    }
  }

  static async get(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const service = await Service.findById(id).populate('devices').populate('servicePerson');

      if (!service) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Serwis nie został znaleziony' });
        return;
      }

      res.status(StatusCodes.OK).json({ data: service, message: 'Serwis pobrany pomyślnie' });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd serwera' });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, returnDate, serviceDate, servicePerson, devices } = req.body;

      const service = await Service.findById(id);
      if (!service) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Serwis nie został znaleziony' });
        return;
      }

      const existingDevices = await Device.find({ _id: { $in: devices } });
      if (existingDevices.length !== devices.length) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Niektóre urządzenia nie istnieją' });
        return;
      }

      const existingEmployees = await Employee.find({ _id: { $in: servicePerson } });
      if (existingEmployees.length !== servicePerson.length) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Niektórzy pracownicy nie istnieją' });
        return;
      }

      service.status = status;
      service.returnDate = returnDate;
      service.serviceDate = serviceDate;
      service.servicePerson = servicePerson;
      service.devices = devices;

      const response = await service.save();

      res.status(StatusCodes.OK).json({ data: response, message: 'Serwis zaktualizowany pomyślnie' });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd serwera' });
    }
  }
}

export default ServiceController;
