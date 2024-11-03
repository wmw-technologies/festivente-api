import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import Warehouse from '../models/Warehouse.model';
import WarehouseItem from '../models/WarehouseItem.model';

export default class WarehouseItemController {
  static async list(_: Request, res: Response): Promise<void> {
    try {
      const items = await Warehouse.find();
      console.log("items", items);
      res.status(StatusCodes.OK).json({ data: items, message: 'Warehouse items retrieved successfully' });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, manufacturer, skuNumber, rentalValue, category, description, isSerialTracked, items = [] } = req.body;

      const existingSkuNumber = await Warehouse.findOne({ skuNumber });
      if (existingSkuNumber) {
        res.status(400).json({ message: 'SkuNumber o podanym numerze już istnieje', errors: {} });
        return;
      }

      const _items: Types.ObjectId[] = [];

      console.log("items", items);

      for (const item of items) {
        const response = await WarehouseItem.create(item);
        _items.push(response._id);

        console.log('_items', _items);
      }

      console.log('items', _items);

      const userId = (req as any).userId;
      const response = await Warehouse.create({ name, manufacturer, skuNumber, rentalValue, category, description, isSerialTracked, items: _items, createdBy: userId });

      console.log('response', response);
      // const existName = await Warehouse.findOne({ name });
      // if (existName) {
      //   res.status(400).json({ message: 'Takie urzadzenie już istnieje w magazynie' });
      //   return;
      // }

      // const newItem = new WarehouseItem({
      //   name,
      //   manufacturer,
      //   model,
      //   quantity,
      //   serialNumbers,
      //   skuNumber,
      //   rentalValue,
      //   location,
      //   warrantyEndDate,
      //   category,
      //   description,
      //   status,
      //   addedBy,
      // });

      // await newItem.save();
      res.status(StatusCodes.CREATED).json({ message: 'Urządzenie dodane do magazynu', data: response });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }

  static async get(req: Request, res: Response): Promise<void> {
    // try {
    //   const { id } = req.params;
    //   const item = await WarehouseItem.findById(id);
    //   if (!item) {
    //     res.status(StatusCodes.NOT_FOUND).json({ message: 'Warehouse item not found' });
    //     return;
    //   }
    //   res.status(StatusCodes.OK).json({ data: item, message: 'Warehouse item retrieved successfully' });
    // } catch (err) {
    //   res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    // }
  }

  static async update(req: Request, res: Response): Promise<void> {
    // try {
    //   const { id } = req.params;
    //   const updatedData = req.body;
    //   const updatedItem = await WarehouseItem.findByIdAndUpdate(id, updatedData, { new: true });
    //   if (!updatedItem) {
    //     res.status(StatusCodes.NOT_FOUND).json({ message: 'Warehouse item not found' });
    //     return;
    //   }
    //   res.status(StatusCodes.OK).json({ message: 'Warehouse item updated successfully', data: updatedItem });
    // } catch (err) {
    //   res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    // }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    // try {
    //   const { id } = req.params;
    //   const deletedItem = await WarehouseItem.findByIdAndDelete(id);
    //   if (!deletedItem) {
    //     res.status(StatusCodes.NOT_FOUND).json({ message: 'Warehouse item not found' });
    //     return;
    //   }
    //   res.status(StatusCodes.OK).json({ message: 'Warehouse item deleted successfully' });
    // } catch (err) {
    //   res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    // }
  }
}
