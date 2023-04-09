import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 5000;
const pdfsDir = path.join(__dirname, 'pdfs');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(pdfsDir));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, pdfsDir);
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Routes
app.get('/pdf/:filename', (req: Request, res: Response) => {
  const filepath = path.join(pdfsDir, req.params.filename);
  res.sendFile(filepath);
});

app.get('/pdfs', (req: Request, res: Response) => {
  fs.readdir(pdfsDir, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error reading directory' });
    }
    const pdfNames = files
      .filter((file) => file.endsWith('.pdf'))
      .map((file) => file.slice(0, -4)); // Remove the last 4 characters (i.e., the .pdf extension)
    res.json({ pdfNames });
  });
});

app.post('/uploadPdf/:pdfName', upload.single('pdf'), (req: Request, res: Response) => {
  const { pdfName } = req.params;
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, 'pdfs', `${pdfName}.pdf`);
  fs.rename(tempPath, targetPath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error uploading file' });
    }
    res.json({ message: 'File uploaded successfully' });
  });
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
