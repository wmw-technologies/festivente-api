import mongoose from 'mongoose';
import * as z from 'zod';

const vehicleSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: false,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    pricePerKm: {
      type: Number,
      required: true,
    },
    inspectionDate: {
      type: Date,
      required: false,
    },
    insuranceDate: {
      type: Date,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Vehicle', vehicleSchema);

export const zodSchema = z.object({
  brand: z.string().min(3).max(64),
  model: z.string().max(64).optional(),
  registrationNumber: z.string().min(5).max(15),
  pricePerKm: z.number().min(0),
  insuranceDate: z.string().datetime().optional(),
  inspectionDate: z.string().datetime().optional(),
  description: z.string().max(256).optional(),
});
