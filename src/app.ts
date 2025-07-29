import express from 'express';
import multer from 'multer';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import File from './models/File';
import cors from "cors";
import { enqueueFile, connectQueue } from './queue';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI!);
connectQueue();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const allowed = ['.pdf', '.docx', '.jpg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  }
});

// POST /upload
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Invalid file type or size.' });

  const newFile = await File.create({
    filename: req.file.originalname,
    path: req.file.path,
    status: 'pending',
    uploadedAt: new Date(),
    scannedAt: null,
    result: null
  });

  await enqueueFile(String(newFile._id));
  res.json({ message: 'File uploaded and scanning initiated.' });
});

// GET /files
// app.get('/files', async (_, res) => {
//   const files = await File.find().sort({ uploadedAt: -1 });
//   res.json(files);
// });

app.get('/files', async (req, res) => {
  try {
    const status = req.query.status as string | undefined;
    const result = req.query.result as string | undefined;

    const query: any = {};

    if (status && status !== 'all') query.status = status;
    if (result && result !== 'all') {
      query.result = result === 'scanning' ? null : result;
    }

    const files = await File.find(query).sort({ uploadedAt: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});


app.listen(3000, () => console.log('Server running at http://localhost:3000'));
