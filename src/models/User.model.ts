import mongoose from 'mongoose';
import * as z from 'zod';

const schema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: false,
    },
    last_name: {
      type: String,
      required: false,
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
    password: {
      type: String,
      required: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', schema);

export const zodSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(8),
});
