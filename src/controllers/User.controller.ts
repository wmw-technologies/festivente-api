import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import User from '../models/User.model';
import Role from '../models/Role.model';

export default class UserController {
  static async me(req: any, res: Response): Promise<void> {
    try {
      const user = await User.findById(req.userId, { password: 0 }).populate('role');

      res.json({ message: 'User fetched', data: user });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { first_name, last_name, email, password, confirm_password, role } = req.body;

      if (password !== confirm_password) {
        res.status(400).json({ errors: { confirm_password: 'Passwords do not match' } });
        return;
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ errors: { email: 'User already exists' } });
        return;
      }

      const existingRole = await Role.findOne({ name: role });

      if (!existingRole) {
        res.status(400).json({ errors: { role: 'Role does not exist' } });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        role: existingRole._id,
      });

      await newUser.save();

      res.status(201).json({ message: 'User created' });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async list(_: Request, res: Response): Promise<void> {
    try {
      const response = await User.find({}, { password: 0 }).populate('role');

      res.status(200).json({ data: response, message: 'Udało się pobrać listę użytkowników :)' });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
