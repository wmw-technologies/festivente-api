import mongoose from 'mongoose';
import * as z from 'zod';

const rentalSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
    },
    clientNIP: {
      type: String,
      required: false,
    },
    clientPhone: {
      type: String,
      required: true,
    },
    clientEmail: {
      type: String,
      required: true,
    },
    clientCity: {
      type: String,
      required: true,
    },
    clientStreet: {
      type: String,
      required: true,
    },
    clientPostCode: {
      type: String,
      required: true,
    },
    rentalDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      required: true,
    },
    paymentForm: {
      type: String,
      required: true,
    },
    isPaid: {
      type: Boolean,
      required: true,
    },
    discount: {
      type: Number,
      required: false,
    },
    devices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
      },
    ],
    inTotal: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      required: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Rental', rentalSchema);

export const zodSchema = z.object({
  clientName: z.string().min(1, 'Nazwa klienta jest wymagana'),
  clientNIP: z.string().optional(),
  clientPhone: z.string().min(1, 'Numer telefonu jest wymagany'),
  clientEmail: z.string().email('Nieprawidłowy adres e-mail'),
  clientCity: z.string().min(1, 'Miasto jest wymagane'),
  clientStreet: z.string().min(1, 'Ulica jest wymagana'),
  clientPostCode: z.string().regex(/^\d{2}-\d{3}$/, 'Kod pocztowy musi być w formacie XX-XXX'),
  rentalDate: z.string().datetime(),
  returnDate: z.string().datetime(),
  paymentForm: z.string({ message: 'Wprowadź forme płatności' }).min(1),
  isPaid: z.boolean(),
  devices: z.array(z.string()).min(1, 'W wypożyczeniu musi być przynajmniej jedno urządzenie'),
  inTotal: z
    .number()
    .refine((val) => val >= 0, { message: 'Amount must be positive' })
    .refine((val) => val <= 100000, { message: 'Amount must be less than or equal to 100,000 PLN' }),
  discount: z.union([z.number().int().min(0, 'Minimum 0%').max(100, 'Maksimum 100%'), z.nan()]).optional(),
  notes: z.string().optional()
});
