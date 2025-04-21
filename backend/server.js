import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import pkg from 'pg';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import pdf2image from './pdf2image.js';
import invokeClaude from './bedrockClaude.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5000;
const { Pool } = pkg;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL setup
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

// Ensure table exists
await pool.query(`
  CREATE TABLE IF NOT EXISTS portfolios (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    resume_url TEXT,
    video_url TEXT,
    projects TEXT[],
    parseData TEXT
  );
`);

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// POST portfolio
app.post('/api/portfolio', upload.fields([{ name: 'resume' }, { name: 'video' }]), async (req, res) => {
  try {
    const { name, email, projects } = req.body;
    const resumeUrl = req.files?.resume ? `/uploads/${req.files.resume[0].filename}` : null;
    const videoUrl = req.files?.video ? `/uploads/${req.files.video[0].filename}` : null;
    const parsedProjects = projects ? JSON.parse(projects) : [];

    const outputImagesDir = await pdf2image(req.files.resume[0].filename);

    // Read all files from the output directory
    const files = fs.readdirSync(outputImagesDir);

    const filesData = files.map(file => {
      const filePath = path.join(outputImagesDir, file);
      const imageBuffer = fs.readFileSync(filePath);
      const base64String = imageBuffer.toString('base64');
      return {
        "type": "image",
        "source": {
          "type": "base64",
          "media_type": "image/jpeg",
          "data": `${base64String}`
        }
      };
    });

    // const input = { id: result.rows[0].id, resume_url: base64url };
    const message = await invokeClaude(filesData); // Optional
    const parseData = message.content[0].text;

    const result = await pool.query(
      'INSERT INTO portfolios (name, email, resume_url, video_url, projects, parseData) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [name, email, resumeUrl, videoUrl, parsedProjects, parseData]
    );

    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error('Error creating portfolio:', err);
    res.status(500).json({ error: 'Failed to create portfolio', details: err.message });
  }
});

// GET portfolio
app.get('/api/portfolio/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM portfolios WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Portfolio not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching portfolio:', err);
    res.status(500).json({ error: 'Failed to fetch portfolio', details: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));