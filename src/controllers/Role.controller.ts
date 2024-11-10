import { Request, Response } from 'express';
import Role from '../models/Role.model';
import { StatusCodes } from 'http-status-codes';

export default class RoleController {
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, perPage = 9999, sort = '_id', order = 'ASC' } = req.query;
      const totalRows = await Role.countDocuments();
      const response = await Role.find(
        {},
        {},
        {
          skip: (parseInt(page as string) - 1) * parseInt(perPage as string),
          limit: parseInt(perPage as string),
        }
      ).sort({ [sort as string]: order === 'ASC' ? 1 : -1 });

      res.status(200).json({
        data: {
          items: response,
          totalRows,
        },
        message: 'Udało się pobrać listę użytkowników :)',
      });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, permissions } = req.body;

      const existingRole = await Role.findOne({ name });
      if (existingRole) {
        res.status(400).json({ message: 'Rola o podanej nazwie już istnieje' });
        return;
      }

      const response = await Role.create({ name, permissions });

      res.status(201).json({ message: 'Udało się stworzyć nową rolę', data: response });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, permissions } = req.body;

      const existingRole = await Role.findOne({ name });
      if (existingRole && existingRole._id.toString() !== id) {
        res.status(400).json({ message: 'Role already exists' });
        return;
      }

      const response = await Role.findByIdAndUpdate(id, { name, permissions }, { new: true });

      res.status(200).json({ message: 'Rola została zakutalizowana', data: response });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }

  static async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const response = await Role.findById(id);

      res.status(200).json({ message: 'Udało się pobrać rolę', data: response });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }
}
