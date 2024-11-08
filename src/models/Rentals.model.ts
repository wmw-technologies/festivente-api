import mongoose from 'mongoose';

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
    ended: {
      type: Boolean,
      default: false,
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
