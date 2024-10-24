import { Request, Response } from 'express';
import Role from '../models/Role.model';

export default class RoleController {
  static async create(req: Request, res: Response) {
    try {
      const { name, permissions } = req.body;
      const response = await Role.create({ name, permissions });

      res.status(201).json({ message: 'Role created', data: response });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async list(_: Request, res: Response): Promise<void> {
    try {
      const response = await Role.find();

      res.status(200).json({ data: response, message: 'Udało się pobrać listę użytkowników :)' });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
