import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import Warehouse from '../models/Warehouse.model';
import Device from '../models/Device.model';

export default class WarehouseController {
  static async list(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, perPage = 9999, sort = '_id', order = 'ASC' } = req.query;
      const totalRows = await Warehouse.countDocuments();
      const response = await Warehouse.find(
        {},
        {},
        {
          skip: (parseInt(page as string) - 1) * parseInt(perPage as string),
          limit: parseInt(perPage as string),
        }
      ).sort({ [sort as string]: order === 'ASC' ? 1 : -1 });

      res.status(StatusCodes.OK).json({
        data: {
          items: response,
          totalRows,
        },
        message: 'Warehouse items retrieved successfully',
      });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, manufacturer, skuNumber, rentalValue, category, description, isSerialTracked, devices = [] } = req.body;

      const existingSkuNumber = await Warehouse.findOne({ skuNumber });
      if (existingSkuNumber) {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: 'SkuNumber o podanym numerze już istnieje', errors: { skuNumber: 'SkuNumber o podanym numerze już istnieje' } });
        return;
      }

      for (let i = 0; i < devices.length; i++) {
        if (isSerialTracked) {
          for (let j = i + 1; j < devices.length; j++) {
            if (devices[i].serialNumber === devices[j].serialNumber) {
              res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                message: 'Urządzenia nie mogą mieć takiego samego numeru seryjnego',
                errors: {
                  [`devices.${i}.serialNumber`]: 'Urządzenia nie mogą mieć takiego samego numeru seryjnego',
                },
              });
              return;
            }
          }

          const existingItem = await Device.findOne({ serialNumber: devices[i].serialNumber });
          if (existingItem) {
            res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
              message: 'Urządzenie o podanym numerze seryjnym już istnieje',
              errors: {
                [`devices.${i}.serialNumber`]: 'Urządzenie o podanym numerze seryjnym już istnieje',
              },
            });
            return;
          }
        }
      }

      const userId = (req as any).userId;
      const newWarehouse = new Warehouse({ name, manufacturer, skuNumber, rentalValue, category, description, isSerialTracked, createdBy: userId });
      const _devices: Types.ObjectId[] = [];

      for (let i = 0; i < devices.length; i++) {
        const item = await Device.create({ ...devices[i], warehouseId: newWarehouse._id, rentalId: null });
        _devices.push(item._id);
      }

      newWarehouse.devices = _devices;
      newWarehouse.status = _devices.length > 0 ? 'Available' : 'Out of stock';
      const response = await newWarehouse.save();

      res.status(StatusCodes.CREATED).json({ message: 'Urządzenie dodane do magazynu', data: response });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }

  static async get(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const item = await Warehouse.findById(id).populate('createdBy', { password: 0 }).populate('devices');

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
      const { name, manufacturer, skuNumber, rentalValue, category, description, isSerialTracked, devices = [] } = req.body;
      const existingSkuNumber = await Warehouse.findOne({ skuNumber });

      const existingWarehouse = await Warehouse.findById(id);
      if (!existingWarehouse) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Warehouse item not found' });
        return;
      }

      if (existingSkuNumber && existingSkuNumber._id.toString() !== id) {
        res.status(400).json({ message: 'SkuNumber o podanym numerze już istnieje', errors: { skuNumber: 'SkuNumber o podanym numerze już istnieje' } });
        return;
      }

      for (let i = 0; i < devices.length; i++) {
        if (isSerialTracked) {
          for (let j = i + 1; j < devices.length; j++) {
            if (devices[i].serialNumber === devices[j].serialNumber) {
              res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                message: 'Urządzenia nie mogą mieć takiego samego numeru seryjnego',
                errors: {
                  [`devices.${i}.serialNumber`]: 'Urządzenia nie mogą mieć takiego samego numeru seryjnego',
                },
              });
              return;
            }
          }

          const existingDevice = await Device.findOne({ serialNumber: devices[i].serialNumber });
          if (existingDevice && existingDevice._id.toString() !== devices[i]._id) {
            res.status(400).json({
              message: 'Urządzenie o podanym numerze seryjnym już istnieje',
              errors: {
                [`devices.${i}.serialNumber`]: 'Urządzenie o podanym numerze seryjnym już istnieje',
              },
            });
            return;
          }
        }
      }

      const _devices: Types.ObjectId[] = [];
      const exisitingDevices = existingWarehouse.devices;

      for (let i = 0; i < exisitingDevices.length; i++) {
        const device = devices.find((item: any) => item._id === exisitingDevices[i].toString());

        if (device) {
          await Device.findByIdAndUpdate(exisitingDevices[i], { ...device, warehouseId: existingWarehouse._id }, { new: true });
        } else {
          await Device.findByIdAndDelete(exisitingDevices[i]);
        }
      }

      for (let i = 0; i < devices.length; i++) {
        if (!devices[i]._id) {
          const newItem = await Device.create({ ...devices[i], warehouseId: existingWarehouse._id, rentalId: null });
          _devices.push(newItem._id);
        } else {
          _devices.push(devices[i]._id);
        }
      }

      const updatedItem = await Warehouse.findByIdAndUpdate(
        id,
        {
          name,
          manufacturer,
          skuNumber,
          rentalValue,
          category,
          description,
          isSerialTracked,
          devices: _devices,
          status: _devices.length > 0 ? 'Available' : 'Out of stock',
        },
        { new: true }
      );

      res.status(StatusCodes.OK).json({ message: 'Warehouse item updated successfully', data: updatedItem });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
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
