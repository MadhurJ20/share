import mongoose from 'mongoose';

const URLSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
      
    },
    shortenUrl: {
      type: String,
      required: true,
      
    },
    alias: {
      type: String,
      unique: true,
    },
    accesses: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.models.Url || mongoose.model('Url', URLSchema);
