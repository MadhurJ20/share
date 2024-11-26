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
        if (!/^https?:\/\//i.test(value)) value = `http://${value}`;
        return value;
      },
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
    expirationDate: {
      type: Date,
      default: undefined
    },
    scheduledDate: {
      type: Date,
      default: null
    },
  },
  { timestamps: true }
);

// TTL index on expirationDate, expires after the date specified in the field
URLSchema.index({ expirationDate: 1 }, { expireAfterSeconds: 0 });

// Pre-save hook to limit expirationDate
URLSchema.pre('save', function (next) {
  const TWO_YEARS = 2 * 365 * 24 * 60 * 60 * 1000; // Milliseconds
  const now = new Date();

  if (this.expirationDate) {
    // If expirationDate is set, check if it's more than 2 years from now
    if (this.expirationDate > new Date(now.getTime() + TWO_YEARS)) {
      this.expirationDate = new Date(now.getTime() + TWO_YEARS);
    }
  }

  next();
});

URLSchema.index({ originalUrl: 1 });
URLSchema.index({ shortenUrl: 1 });

export default mongoose.models.Url || mongoose.model('Url', URLSchema);
