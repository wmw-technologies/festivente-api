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
        .populate('device')
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
      const { returnDate, serviceDate, repairPrice, servicePerson, device, description } = req.body;

      console.log({ returnDate, serviceDate, repairPrice, servicePerson, device, description });

      const existingDevice = await Device.find({ _id: device });
      if (!existingDevice) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Urządzenie nie istnieje' });
        return;
      }

      const existingEmployees = await Employee.find({ _id: servicePerson });
      if (!existingEmployees) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Pracownik nie istnieje' });
        return;
      }

      const service = new Service({ returnDate, serviceDate, repairPrice, servicePerson, device, description });
      const response = await service.save().catch((err) => {
        console.log("erro", err)
      });

      res.status(StatusCodes.CREATED).json({ data: response, message: 'Serwis utworzony pomyślnie' });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd serwera' });
    }
  }

  static async get(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const service = await Service.findById(id).populate('servicePerson')
      .populate({
        path: 'device',
        populate: {
          path: 'warehouseId',
          model: 'Warehouse'
        },
      });

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
      const { returnDate, serviceDate, repairPrice, servicePerson, device, description } = req.body;

      const service = await Service.findById(id);
      if (!service) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Serwis nie został znaleziony' });
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
