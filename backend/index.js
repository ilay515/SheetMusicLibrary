"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const pdfsDir = path_1.default.join(__dirname, 'pdfs');
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static(pdfsDir));
// Multer storage configuration
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, pdfsDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage });
// Routes
app.get('/pdf/:filename', (req, res) => {
    const filepath = path_1.default.join(pdfsDir, req.params.filename);
    res.sendFile(filepath);
});
app.get('/pdfs', (req, res) => {
    fs_1.default.readdir(pdfsDir, (err, files) => {
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
app.post('/uploadPdf/:pdfName', upload.single('pdf'), (req, res) => {
    const { pdfName } = req.params;
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const tempPath = req.file.path;
    const targetPath = path_1.default.join(__dirname, 'pdfs', `${pdfName}.pdf`);
    fs_1.default.rename(tempPath, targetPath, (err) => {
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
