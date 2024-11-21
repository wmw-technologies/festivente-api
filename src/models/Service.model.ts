import mongoose from 'mongoose';
import * as z from 'zod';

const serviceSchema = new mongoose.Schema(
  {
    returnDate: {
      type: Date,
      required: true,
    },
    serviceDate: {
      type: Date,
      required: false,
    },
    repairPrice: {
      type: Number,
      required: false,
    },
    servicePerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: false,
    },
    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      required: true,
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

export default mongoose.model('Service', serviceSchema);

export const zodSchema = z.object({
  returnDate: z.string().datetime(),
  serviceDate: z.string().datetime().optional(),
  repairPrice: z.number().min(0).optional(),
  servicePerson: z.string().optional(),
  device: z.string(),
  description: z.string().max(256).optional(),
});
