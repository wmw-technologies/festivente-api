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
    location: {
      type: String,
      required: true,
    },
    budget: {
      type: String,
      required: true,
    },
    assignedEmployees: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: false,
    },
    estimatedHours: {
      type: String,
      required: false,
    },
    actualHours: {
      type: String,
      required: false,
    },
    notes: {
      type: String,
      required: false,
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
  date: z.string(),
  description: z.string().max(256).optional(),
  location: z.string().min(3).max(64),
  budget: z.number().min(0),
  assignedEmployees: z.array(z.string()).min(1),
  estimatedHours: z.string().optional(),
  actualHours: z.string().optional(),
  notes: z.string().max(256).optional(),
});
