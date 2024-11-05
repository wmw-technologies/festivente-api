import mongoose from 'mongoose';
import * as z from 'zod';

const rentalSchema = new mongoose.Schema(
    {
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        companyName: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        issuedBy: {
            type: String,
            required: false,
        },
        receivedBy: {
            type: String,
            required: false,
        },
        price: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            default: 0,
        },
        ended: {
            type: Boolean,
            default: false,
        },
        /* warehouseID: [
         {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'Warehouse',
         },
         ],*/
        devices: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Device',
            },
        ],
    },
    {
        timestamps: true,
    }
);
/*
rentalSchema.pre('save', function (next) {
    if (this.startDate > this.endDate) {
      return next(new Error("Data rozpoczęcia nie może być późniejsza niż data zakończenia."));
    }
    next();
  });
  */
export default mongoose.model('Rental', rentalSchema);
/*
// Zod: Walidacja daty
export const rentalZodSchema = z
  .object({
    rentalNumber: z.number().optional(),
    startDate: z.string().transform((val) => new Date(val)),
    endDate: z.string().transform((val) => new Date(val)),
    companyName: z.string().min(3),
    phone: z.string().min(10),
    issuedBy: z.string().min(3),
    receivedBy: z.string().min(3),
    price: z.string().transform((val) => parseFloat(val)),
    discount: z.number().optional().default(0),
    warehouseID: z.array(
      z.object({
          name: z.string().min(3).max(64),
          manufacturer: z.string().optional(),
          skuNumber: z.string().min(1),
          rentalValue: z.string().transform((val) => parseFloat(val)),
          category: z.string().optional(),
          description: z.string().optional(),
          isSerialTracked: z.boolean().optional(),
          devices: z.array(
              z.object({
                _id: z.string().optional(),
                serialNumber: z.string().min(1).optional(),
                location: z.string().min(1),
                description: z.string().optional()
              })
            ),
      })
    ),
  })
  .refine((data) => data.startDate < data.endDate, {
    message: "Data rozpoczęcia nie może być późniejsza niż data zakończenia.",
    path: ["startDate"],
  });*/