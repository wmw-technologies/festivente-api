import mongoose from 'mongoose';

const warehouseItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    manufacturer: {
      type: String,
      required: false,
    },
    model: {
      type: String,
      required: false,
    },
    quantity: {
      type: Number,
      required: true,
    },
    serialNumbers: {
      type: [String],
      required: true,
    },
    skuNumber: {
      type: String,
      required: true,
      unique: true,
    },
    rentalValue: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: false,
    },
    warrantyEndDate: {
      type: Date,
      required: false,
    },
    category: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      default: 'available', // Default status
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('WarehouseItem', warehouseItemSchema);