import mongoose from 'mongoose';
const BASE_URL = process.env.BASE_URL || 'http://';

const AccessSchema = new mongoose.Schema({
  count: { type: Number, default: 0 },
  lastAccessed: { type: [Date], default: [] },
});

const URLSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      unique: true,
      required: true,
      set(value) {
        // If no protocol is provided, prepend http://
        if (!/^https?:\/\//i.test(value)) value = `${BASE_URL}${value}`;
        return value;
      },
      // match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, 'Please enter a valid URL'],
    },
    shortenUrl: {
      type: String,
      unique: true,
      required: true,
    },
    alias: {
      type: String,
      unique: true,
      sparse: true,
    },
    accesses: {
      type: AccessSchema,
      default: () => ({
        count: 0,
        lastAccessed: [new Date()],
      }),
    },
    expirationDate: { type: Date, default: undefined },
    scheduledDate: { type: Date, default: null },
  },
  { timestamps: true, }
);

URLSchema.index({ originalUrl: 1 });
URLSchema.index({ shortenUrl: 1 });
export default mongoose.models.Url || mongoose.model('Url', URLSchema);
