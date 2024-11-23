import mongoose from 'mongoose';
import * as z from 'zod';

const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    clientEmail: {
      type: String,
      required: false,
    },
    clientPhone: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    assignedEmployees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
      },
    ],
    status: {
      type: String,
      required: false,
    },
    estimatedHours: {
      type: Number,
      required: false,
    },
    actualHours: {
      type: Number,
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

export default mongoose.model('Event', eventSchema);

export const zodSchema = z.object({
  eventName: z.string().min(3).max(64),
  clientName: z.string().min(3).max(64),
  clientEmail: z.string().email(),
  clientPhone: z.string().min(9).max(16),
  date: z.string().datetime(),
  description: z.string().max(256).optional(),
  location: z.string().min(3).max(64),
  budget: z
    .number()
    .refine((val) => val >= 0, { message: 'Amount must be positive' })
    .refine((val) => val <= 100000, { message: 'Amount must be less than or equal to 100,000 PLN' }),
  assignedEmployees: z.array(z.string()).min(1),
  estimatedHours: z.number().optional(),
  actualHours: z.number().optional(),
  notes: z.string().max(256).optional(),
});
