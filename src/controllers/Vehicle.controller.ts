import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Vehicle from '../models/Vehicle.model';

export default class VehicleController {
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, perPage = 9999, sort = '_id', order = 'ASC' } = req.query;

      const totalRows = await Vehicle.countDocuments();

      const vehicles = await Vehicle.find()
        .skip((parseInt(page as string) - 1) * parseInt(perPage as string))
        .limit(parseInt(perPage as string))
        .sort({ [sort as string]: order === 'ASC' ? 1 : -1 });

      res.status(StatusCodes.OK).json({
        data: {
          items: vehicles,
          totalRows,
        },
        message: 'Lista pojazdów pobrana pomyślnie',
      });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd podczas pobierania listy pojazdów' });
    }
  }

  static async get(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const vehicle = await Vehicle.findById(id);

      if (!vehicle) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Pojazd nie został znaleziony' });
        return;
      }

      res.status(StatusCodes.OK).json({ data: vehicle, message: 'Pojazd pobrany pomyślnie' });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd podczas pobierania pojazdu' });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { registrationNumber, deviceType, pricePerKm, inspectionDate, insuranceDate, description } = req.body;

      const existingVehicle = await Vehicle.findOne({ registrationNumber });
      if (existingVehicle) {
        res.status(StatusCodes.CONFLICT).json({ message: 'Pojazd z takim numerem rejestracyjnym już istnieje' });
        return;
      }

      const vehicle = new Vehicle({ registrationNumber, deviceType, pricePerKm, inspectionDate, insuranceDate, description });

      const response = await vehicle.save();

      res.status(StatusCodes.CREATED).json({
        data: response,
        message: 'Pojazd został pomyślnie utworzony',
      });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd serwera' });
    }
  }
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { registrationNumber, deviceType, pricePerKm, inspectionDate, insuranceDate, description } = req.body;

      const vehicle = await Vehicle.findById(id);
      if (!vehicle) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Pojazd nie został znaleziony' });
        return;
      }

      if (registrationNumber) {
        const existingVehicle = await Vehicle.findOne({ registrationNumber });
        if (existingVehicle && existingVehicle._id.toString() !== id) {
          res.status(StatusCodes.CONFLICT).json({ message: 'Pojazd z takim numerem rejestracyjnym już istnieje' });
          return;
        }
        vehicle.registrationNumber = registrationNumber;
      }

      vehicle.deviceType = deviceType;
      vehicle.pricePerKm = pricePerKm;
      vehicle.inspectionDate = inspectionDate;
      vehicle.insuranceDate = insuranceDate;
      vehicle.description = description;

      const updatedVehicle = await vehicle.save();

      res.status(StatusCodes.OK).json({
        data: updatedVehicle,
        message: 'Pojazd został zaktualizowany pomyślnie',
      });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Błąd serwera' });
    }
  }
}
