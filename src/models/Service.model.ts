import mongoose from 'mongoose';
import * as z from 'zod';

const serviceSchema = new mongoose.Schema(
  {
    returnDate: {
      type: Date,
      required: false,
    },
    serviceDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    description: {
      type: String,
      required: false,
    },
    repairPrice: {
      type: Number,
      required: false,
    },
    servicePerson: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Employee',
      },
    ],
    devices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
      },
    ],
    status: {
      type: String,
      required: false,
      enum: ['In Service', 'Repaired', 'Returned', 'Awaiting Parts'],
      default: 'In Service',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Service', serviceSchema);

export const zodSchema = z.object({
  returnDate: z.any().optional().nullable(),
  serviceDate: z.string().datetime(),
  servicePerson: z.array(z.string()).optional(),
  devices: z.array(z.string()).min(1),
  repairPrice: z.number().min(0).optional(),
  description: z.string().max(256).optional(),
});
