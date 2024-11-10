import mongoose from 'mongoose';

const rentalSchema = new mongoose.Schema(
  {
    clientName: {
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
    clientPhone: {
      type: String,
      required: true,
    },
    clientEmail: {
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
    inTotal: {
      type: Number,
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
      required: true,
    },
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

export default mongoose.model('Rental', rentalSchema);
