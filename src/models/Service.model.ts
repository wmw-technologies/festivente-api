import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ['In Service', 'Repaired', 'Returned', 'Awaiting Parts'],
    },
    returnDate: {
      type: Date,
      required: false,
    },
    serviceDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    servicePerson: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Employee',
        },
      ],
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

export default mongoose.model('Service', serviceSchema);