import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import File from './models/File';
import { consumeQueue } from './queue';
import axios from 'axios';
import path from 'path';

dotenv.config();
mongoose.connect(process.env.MONGO_URI!);

const DANGEROUS_KEYWORDS = ['rm -rf', 'eval', 'bitcoin'];

function containsMalware(content: string): boolean {
  return DANGEROUS_KEYWORDS.some(keyword => content.includes(keyword));
}

consumeQueue(async (fileId: string) => {
  const file = await File.findById(fileId);
  if (!file) return;

  const ext = path.extname(file.path).toLowerCase();
  let content = '';

  if (ext === '.pdf' || ext === '.docx' || ext === '.txt') {
    try {
      content = fs.readFileSync(file.path, 'utf-8').toLowerCase();
    } catch {
      content = ''; // Binary files may fail, assume clean
    }
  }

  await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 2000));

  const isInfected = containsMalware(content);
  file.status = 'scanned';
  file.result = isInfected ? 'infected' : 'clean';
  file.scannedAt = new Date();
  await file.save();

  if (isInfected && process.env.WEBHOOK_URL) {
    try {
      await axios.post(process.env.WEBHOOK_URL, {
        text: `🚨 Infected file detected: ${file.filename}`
      });
    } catch (err: any) {
      console.error('Webhook failed:', err.message);
    }
  }

  console.log(`${file.filename} scanned: ${file.result}`);
});
