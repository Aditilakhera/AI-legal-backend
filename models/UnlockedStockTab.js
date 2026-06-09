import mongoose from 'mongoose';

const unlockedStockTabSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    symbol: { type: String, required: true, uppercase: true, trim: true, index: true },
    tab: { type: String, required: true, index: true }, // e.g. 'intraday', 'news', 'historical', 'advisory', 'research', 'graham-analysis', 'kiyosaki-analysis'
    createdAt: { type: Date, default: Date.now }
});

// Compound index to quickly look up stock tab unlock status per user
unlockedStockTabSchema.index({ userId: 1, symbol: 1, tab: 1 }, { unique: true });

// TTL index: auto-delete unlock records after 24 hours (86400 seconds)
// This ensures users aren't double-charged within a session window,
// but pay for fresh analysis after the 24-hour window expires.
unlockedStockTabSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export default mongoose.model('UnlockedStockTab', unlockedStockTabSchema);
