import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema(
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
    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Device', deviceSchema);
