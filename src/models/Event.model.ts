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
    city: {
      type: String,
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
  eventName: z
    .string()
    .min(3, { message: 'Nazwa wydarzenia musi mieć co najmniej 3 znaki' })
    .max(64, { message: 'Nazwa wydarzenia może mieć maksymalnie 64 znaki' }),
  city: z
    .string()
    .min(3, { message: 'Miasto musi mieć co najmniej 3 znaki' })
    .max(64, { message: 'Miasto może mieć maksymalnie 64 znaki' }),
  location: z
    .string()
    .min(3, { message: 'Miejsce musi mieć co najmniej 3 znaki' })
    .max(64, { message: 'Miejsce może mieć maksymalnie 64 znaki' }),
  date: z.string().datetime({ message: 'Nieprawidłowa data' }),
  clientName: z
    .string()
    .min(3, { message: 'Nazwa klienta musi mieć co najmniej 3 znaki' })
    .max(64, { message: 'Nazwa klienta może mieć maksymalnie 64 znaki' }),
  clientEmail: z.string().email({ message: 'Nieprawidłowy adres e-mail' }),
  clientPhone: z
    .string()
    .min(9, { message: 'Numer telefonu musi mieć co najmniej 9 znaków' })
    .max(16, { message: 'Numer telefonu może mieć maksymalnie 16 znaków' }),
  description: z.string().max(256, { message: 'Opis może mieć maksymalnie 256 znaków' }).optional(),
  budget: z
    .number({ message: 'Wartość musi być liczbą' })
    .refine((val) => val >= 0, { message: 'Kwota musi być dodatnia' })
    .refine((val) => val <= 100000, { message: 'Kwota musi być mniejsza lub równa 100 000 PLN' }),
  assignedEmployees: z.array(z.string(), { message: 'Musi być przypisany przynajmniej jeden pracownik' }).min(1),
  estimatedHours: z
    .any()
    .optional(),
  actualHours: z
    .any()
    .optional(),
  notes: z.string().max(256, { message: 'Notatki mogą mieć maksymalnie 256 znaków' }).optional()
});
