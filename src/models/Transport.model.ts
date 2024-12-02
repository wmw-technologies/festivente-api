import mongoose from 'mongoose';
import * as z from 'zod';

const transportSchema = new mongoose.Schema(
  {
    vehicleDetails: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Vehicle',
        },
      ],   
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
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
    notes: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: true,
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
  vehicleType: z.string().min(3).max(64),
  vehicleDetails: z.object({
    brand: z.string().min(3).max(64),
    model: z.string().min(3).max(64),
    registrationNumber: z.string().min(3).max(64),
  }),
  driver: z.string(),
  event: z.string(),
  departureTime: z.string().datetime(),
  arrivalTime: z.string().datetime().optional().nullable(),
  departureLocation: z.string().min(3).max(64),
  destinationLocation: z.string().min(3).max(64),
  notes: z.string().max(256).optional(),
});
