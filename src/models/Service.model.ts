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
    servicePerson: [
      {
        type: mongoose.Schema.Types.ObjectId,
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
  servicePerson: z.array(z.string()).min(1),
  devices: z.array(z.string()).min(1),
});
