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
    items: {
      type: Array<mongoose.Schema.Types.ObjectId>,
      required: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
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
  rentalValue: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, { message: 'Must be a valid PLN amount (e.g., 99 or 999.99)' })
    .transform((val) => parseFloat(val))
    .refine((val) => val >= 0, { message: 'Amount must be positive' })
    .refine((val) => val <= 100000, { message: 'Amount must be less than or equal to 100,000 PLN' }),
  category: z.string().optional(),
  description: z.string().optional(),
  isSerialTracked: z.boolean().optional(),
  items: z.array(
    z.object({
      // serialNumber: z.string().min(1).optional(),
      location: z.string().min(1),
      description: z.string().optional()
    })
  )
});