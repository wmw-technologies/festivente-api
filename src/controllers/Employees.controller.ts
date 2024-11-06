import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import Employee from '../models/Employee.model';

export default class EmployeesController {
  static async list(_: Request, res: Response): Promise<void> {
    try {
      const response = await Employee.find();
      res.status(StatusCodes.OK).json({ data: response, message: 'Udało się pobrać dane' });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { firstName, lastName, email, phone, position, dailyRate } = req.body;

      const existingEmail = await Employee.findOne({ email });
      if (existingEmail) {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: 'Pracownik o podanym email już istnieje', errors: { email: 'Pracownik o podanym email już istnieje' } });
        return;
      }

      const newEmployee = new Employee({ firstName, lastName, email, phone, position, dailyRate });
      const response = await newEmployee.save();

      res.status(StatusCodes.CREATED).json({ message: 'Pracownik został dodany', data: response });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }

  static async get(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const item = await Employee.findById(id);

      if (!item) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Pracownik nie znaleziony' });
        return;
      }

      res.status(StatusCodes.OK).json({ data: item, message: 'Pobrano dane' });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { firstName, lastName, email, phone, position, dailyRate } = req.body;

      const employee = await Employee.findById(id);

      if (!employee) {
        res.status(400).json({ message: 'Employee does not exist' });
        return;
      }

      const existingEmail = await Employee.findOne({ email });

      if (existingEmail && existingEmail._id.toString() !== id) {
        res.status(400).json({ message: 'Employee with this email already exists', errors: { email: 'Employee with this email already exists' } });
        return;
      }

      const updatedItem = await Employee.findByIdAndUpdate(id, { firstName, lastName, email, phone, position, dailyRate }, { new: true });

      res.status(StatusCodes.OK).json({ message: 'Employee updated successfully', data: updatedItem });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }
}
