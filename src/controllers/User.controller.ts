import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import User from '../models/User.model';
import Role from '../models/Role.model';
import { StatusCodes } from 'http-status-codes';

export default class UserController {
  static async me(req: any, res: Response): Promise<void> {
    try {
      const user = await User.findById(req.userId, { password: 0 }).populate('role');

      res.json({ message: 'User fetched', data: user });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }

  static async list(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, perPage = 9999, sort = '_id', order = 'ASC' } = req.query;

      const totalRows = await User.countDocuments();
      const response = await User.find(
        {},
        { password: 0 },
        {
          skip: (parseInt(page as string) - 1) * parseInt(perPage as string),
          limit: parseInt(perPage as string),
        }
      )
        .populate('role')
        .sort({ [sort as string]: order === 'ASC' ? 1 : -1 });

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

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { first_name, last_name, email, password, confirm_password, role } = req.body;

      if (password !== confirm_password) {
        res.status(400).json({ errors: { confirm_password: 'Passwords do not match' }, message: 'Passwords do not match' });
        return;
      }

      const emailLowerCase = typeof email === 'string' ? email.toLowerCase() : '';

      const existingUser = await User.findOne({ email: emailLowerCase });
      if (existingUser) {
        res.status(400).json({ errors: { email: 'User already exists' }, message: 'User already exists' });
        return;
      }

      const existingRole = await Role.findById(role);

      if (!existingRole) {
        res.status(400).json({ errors: { role: 'Role does not exist' }, message: 'Role does not exist' });
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
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { first_name, last_name, email, phone, password, confirm_password, role } = req.body;

      if (password !== confirm_password) {
        res.status(400).json({ errors: { confirm_password: 'Passwords do not match' }, message: 'Passwords do not match' });
        return;
      }

      const user = await User.findById(id);

      if (!user) {
        res.status(400).json({ message: 'User does not exist' });
        return;
      }

      const userEmailLowerCase = user.email.toLocaleLowerCase();
      const emailLowerCase = typeof email === 'string' ? email.toLowerCase() : '';

      if (userEmailLowerCase !== emailLowerCase) {
        res.status(400).json({ errors: { email: 'Nie możesz zmienić emaila' }, message: 'Email cannot be changed' });
        return;
      }

      const existingRole = await Role.findById(role);

      if (!existingRole) {
        res.status(400).json({ errors: { role: 'Role does not exist' }, message: 'Role does not exist' });
        return;
      }

      const response = await User.findByIdAndUpdate(id, { first_name, last_name, phone, role }, { new: true });

      res.status(200).json({ message: 'User updated', data: response });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }

  static async updatePassword(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { password, confirm_password } = req.body;

      if (password !== confirm_password) {
        res.status(400).json({ errors: { confirm_password: 'Passwords do not match' }, message: 'Passwords do not match' });
        return;
      }

      const user = await User.findById(id);

      if (!user) {
        res.status(400).json({ message: 'User does not exist' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const response = await User.findByIdAndUpdate(id, { password: passwordHash }, { new: true });

      res.status(200).json({ message: 'Hasło użytkownika zostało zaktualizwane', data: response });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }

  static async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const response = await User.findById(id, { password: 0 }).populate('role');

      res.status(200).json({ message: 'User fetched', data: response });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }
}
