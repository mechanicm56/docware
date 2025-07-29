import mongoose from 'mongoose';

export interface IFile extends mongoose.Document {
  filename: string;
  path: string;
  status: 'pending' | 'scanned';
  uploadedAt: Date;
  scannedAt: Date | null;
  result: 'clean' | 'infected' | null;
}

const fileSchema = new mongoose.Schema<IFile>({
  filename: String,
  path: String,
  status: { type: String, enum: ['pending', 'scanned'], default: 'pending' },
  uploadedAt: { type: Date, default: Date.now },
  scannedAt: { type: Date, default: null },
  result: { type: String, enum: ['clean', 'infected', null], default: null }
});

export default mongoose.model<IFile>('File', fileSchema);
