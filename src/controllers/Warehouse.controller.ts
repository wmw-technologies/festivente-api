import { Request, Response } from 'express';
import WarehouseItem from '../models/Warehouse.model';
import { StatusCodes } from 'http-status-codes';

export default class WarehouseItemController {

  static async list(_: Request, res: Response): Promise<void> {
    try {
      const items = await WarehouseItem.find();
      res.status(StatusCodes.OK).json({ data: items, message: 'Warehouse items retrieved successfully' });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, manufacturer, model, quantity, serialNumbers, skuNumber, rentalValue, location, warrantyEndDate, category, description, status, addedBy,
      } = req.body;

      const existskuNumber = await WarehouseItem.findOne({skuNumber});
      if(existskuNumber){
        res.status(400).json({ message: 'skuNumber o podanym numerze już istnieje' });
        return;
      }
     const existName = await WarehouseItem.findOne({name});
     if(existName){
          res.status(400).json({ message: 'Takie urzadzenie już istnieje w magazynie' });
        return;
     }
      const newItem = new WarehouseItem({
        name, manufacturer, model, quantity, serialNumbers, skuNumber, rentalValue, location, warrantyEndDate, category, description, status, addedBy,
      });

      await newItem.save();
      res.status(StatusCodes.CREATED).json({ message: 'Warehouse item created successfully', data: newItem });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }

  static async get(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const item = await WarehouseItem.findById(id);
      if (!item) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Warehouse item not found' });
        return;
      }
      res.status(StatusCodes.OK).json({ data: item, message: 'Warehouse item retrieved successfully' });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedData = req.body;

      const updatedItem = await WarehouseItem.findByIdAndUpdate(id, updatedData, { new: true });
      if (!updatedItem) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Warehouse item not found' });
        return;
      }
      res.status(StatusCodes.OK).json({ message: 'Warehouse item updated successfully', data: updatedItem });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deletedItem = await WarehouseItem.findByIdAndDelete(id);
      if (!deletedItem) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Warehouse item not found' });
        return;
      }
      res.status(StatusCodes.OK).json({ message: 'Warehouse item deleted successfully' });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }
}