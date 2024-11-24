import mongoose from 'mongoose';
const BASE_URL = process.env.BASE_URL || 'http://';

const AccessSchema = new mongoose.Schema({
  count: { type: Number, default: 0 },
  lastAccessed: { type: Date },
});

const URLSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
      set(value) {
        // If no protocol is provided, prepend http://
        if (!/^https?:\/\//i.test(value)) value = `${BASE_URL}${value}`;
        return value;
      },
      match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, 'Please enter a valid URL'],
    },
    shortenUrl: {
      type: String,
      required: true,
    },
    alias: {
      type: String,
      unique: true,
      sparse: true,
    },
    accesses: {
      type: AccessSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

URLSchema.index({ originalUrl: 1 });
URLSchema.index({ shortenUrl: 1 });
export default mongoose.models.Url || mongoose.model('Url', URLSchema);
