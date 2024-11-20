import mongoose from "mongoose";
import * as z from 'zod';

const carsSchema = new mongoose.Schema(
 {
    registrationNumber: {
        type: String,
        required: true,
        unique: true,
      },
    deviceType: {
        type: String,
        required: true,
    },
    pricePerKm: {
        type: Number,
        required: true,
    },
    inspectionDate: {
        type: Date,
        required: true,
    },
    insuranceDate: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
 },
 {
    timestamps: true, 
 }
 
);

export default mongoose.model('Vehicle', carsSchema);

export const zodSchema = z.object({
    registrationNumber: z.string().min(5).max(15),
    deviceType: z.string().min(1).max(15),
    pricePerKm: z.number().min(0),
    insuranceDate: z.string().datetime(),
    inspectionDate: z.string().datetime(),
    description: z.string().max(256).optional(),
  });