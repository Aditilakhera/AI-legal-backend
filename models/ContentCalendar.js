import mongoose from 'mongoose';

const ContentCalendarSchema = new mongoose.Schema({
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'SocialAgentWorkspace', required: true },
  sourceFileUrl: { type: String },
  fileType: { type: String, enum: ['CSV', 'XLSX', 'XLS'] },
  totalRows: { type: Number, default: 0 },
  excelUrl: { type: String },
  status: { type: String, enum: ['pending', 'generated', 'published', 'failed'], default: 'pending' },
  parsedStatus: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' }
}, { timestamps: true });

export default mongoose.models.ContentCalendar || mongoose.model('ContentCalendar', ContentCalendarSchema);
