import mongoose from 'mongoose';
import * as z from 'zod';

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    manufacturer: {
      type: String,
      required: false,
    },
    skuNumber: {
      type: String,
      required: true,
      unique: true,
    },
    rentalValue: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    isSerialTracked: {
      type: Boolean,
      required: true,
    },
    status: {
      type: String,
      enum: ['Available', 'Out of stock'],
      default: 'Out of stock',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    devices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Warehouse', schema);

export const zodSchema = z.object({
  name: z.string().min(3).max(64),
  manufacturer: z.string().optional(),
  skuNumber: z.string().min(1),
  rentalValue: z.string().transform((val) => parseFloat(val)),
  category: z.string().optional(),
  description: z.string().optional(),
  isSerialTracked: z.boolean().optional(),
  devices: z.array(
    z.object({
      serialNumber: z.string().min(1).optional(),
      location: z.string().min(1),
      description: z.string().optional(),
    })
  ),
});
