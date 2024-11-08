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
      // enum: ['Available', 'Out of stock'],
      // default: 'Out of stock',
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
  // {
  //   startDate: {
  //     type: Date,
  //     required: true,
  //   },
  //   endDate: {
  //     type: Date,
  //     required: true,
  //   },
  //   companyName: {
  //     type: String,
  //     required: true,
  //   },
  //   phone: {
  //     type: String,
  //     required: true,
  //   },
  //   issuedBy: {
  //     type: String,
  //     required: false,
  //   },
  //   receivedBy: {
  //     type: String,
  //     required: false,
  //   },
  //   price: {
  //     type: Number,
  //     required: true,
  //   },
  //   ended: {
  //     type: Boolean,
  //     default: false,
  //   },
  //   devices: [
  //     {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: 'Device',
  //     },
  //   ],
  // },
  {
    timestamps: true,
  }
);

export default mongoose.model('Rental', rentalSchema);
