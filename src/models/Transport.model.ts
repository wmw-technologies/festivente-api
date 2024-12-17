import mongoose from 'mongoose';
import * as z from 'zod';

const transportSchema = new mongoose.Schema(
  {
    vehicles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
      },
    ],
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    arrivalTime: {
      type: Date,
      required: false,
    },
    departureLocation: {
      type: String,
      required: true,
    },
    destinationLocation: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    notes: {
      type: String,
      required: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Transport', transportSchema);

export const zodSchema = z.object({
  vehicles: z.array(z.string()).min(1),
  event: z.string(),
  departureTime: z.string().datetime(),
  arrivalTime: z.string().datetime().optional().nullable(),
  departureLocation: z.string().min(3).max(64),
  destinationLocation: z.string().min(3).max(64),
  phoneNumber: z.string().optional(),
  notes: z.string().max(256).optional(),
});
