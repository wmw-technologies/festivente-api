import mongoose from 'mongoose';
import * as z from 'zod';

const schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: false,
    },
    position: {
      type: String,
      required: false,
    },
    dailyRate: {
      type: Number,
      required: true,
    },
    overtime: {
      first: {
        type: Number,
        required: true,
      },
      second: {
        type: Number,
        required: true,
      },
      third: {
        type: Number,
        required: true,
      }
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Employee', schema);

export const zodSchema = z.object({
  firstName: z.string().min(3).max(64),
  lastName: z.string().min(3).max(64),
  email: z.string().email().optional(),
  phone: z.string().min(9).max(16).optional().or(z.literal('')),
  position: z.string(),
  dailyRate: z.string().transform((val) => parseFloat(val)),
  overtime: z.object({
    first: z.number().min(0).max(10),
    second: z.number().min(0).max(10),
    third: z.number().min(0).max(10)
  })
});
