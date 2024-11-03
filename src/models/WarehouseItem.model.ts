import mongoose from 'mongoose';

const warehouseItemSchema = new mongoose.Schema(
  {
    serialNumber: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: false,
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

export default mongoose.model('WarehouseItem', warehouseItemSchema);
