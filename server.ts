import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import JSZip from 'jszip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Ensure public media directories exist
const MEDIA_BASE = path.join(__dirname, 'public', 'media');
const DIRS = ['videos', 'images', 'audio', 'thumbnails'].map(d => path.join(MEDIA_BASE, d));
DIRS.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const MANIFEST_PATH = path.join(MEDIA_BASE, 'manifest.json');

// Helper to get or init manifest
function readManifest() {
  try {
    if (fs.existsSync(MANIFEST_PATH)) {
      const data = fs.readFileSync(MANIFEST_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading manifest:', err);
  }
  return {
    version: '1.0.0',
    appName: 'Constitución Dominicana — Experiencia Digital',
    lastUpdated: new Date().toISOString(),
    media: [],
    sectionAssignments: {},
    soundSettings: {
      ambientMusicVolume: 0.35,
      sfxVolume: 0.6,
      isMuted: false,
      selectedTrackId: ''
    }
  };
}

function writeManifest(manifestData: any) {
  manifestData.lastUpdated = new Date().toISOString();
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifestData, null, 2), 'utf-8');
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subfolder = 'images';
    if (file.mimetype.startsWith('video/')) subfolder = 'videos';
    else if (file.mimetype.startsWith('audio/')) subfolder = 'audio';
    else if (req.body.category === 'thumbnails') subfolder = 'thumbnails';
    
    const targetDir = path.join(MEDIA_BASE, subfolder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.toLowerCase().replace(/[^a-z0-9._-]/g, '_');
    const timestamp = Date.now();
    cb(null, `${timestamp}_${cleanName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 150 * 1024 * 1024 } // 150MB limit
});

// Serve static public folder
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/media/manifest', (req: Request, res: Response) => {
  const manifest = readManifest();
  res.json(manifest);
});

app.post('/api/media/upload', upload.single('file'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se envió ningún archivo' });
    }

    const { title, category, assignedTo } = req.body;
    let type = 'image';
    let folder = 'images';
    if (req.file.mimetype.startsWith('video/')) {
      type = 'video';
      folder = 'videos';
    } else if (req.file.mimetype.startsWith('audio/')) {
      type = 'audio';
      folder = 'audio';
    }

    const relativePath = `/media/${folder}/${req.file.filename}`;
    const newMediaItem = {
      id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type,
      title: title || req.file.originalname,
      category: category || 'general',
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: relativePath,
      sizeBytes: req.file.size,
      mimeType: req.file.mimetype,
      assignedTo: assignedTo || null,
      dateAdded: new Date().toISOString()
    };

    const manifest = readManifest();
    manifest.media.push(newMediaItem);

    if (assignedTo && manifest.sectionAssignments) {
      if (!manifest.sectionAssignments[assignedTo]) {
        manifest.sectionAssignments[assignedTo] = {};
      }
      manifest.sectionAssignments[assignedTo].mediaId = newMediaItem.id;
    }

    writeManifest(manifest);

    res.json({
      success: true,
      message: 'Archivo subido e incorporado exitosamente al proyecto',
      media: newMediaItem,
      manifest
    });
  } catch (err: any) {
    console.error('Error uploading file:', err);
    res.status(500).json({ error: err.message || 'Error al procesar la subida' });
  }
});

// Base64 upload endpoint (fallback when multipart formData is blocked by proxy)
app.post('/api/media/upload-base64', (req: Request, res: Response) => {
  try {
    const { filename, base64Data, title, category, assignedTo, mimeType } = req.body;
    if (!base64Data || !filename) {
      return res.status(400).json({ error: 'Faltan datos de archivo' });
    }

    let type = 'image';
    let folder = 'images';
    if (mimeType?.startsWith('video/')) {
      type = 'video';
      folder = 'videos';
    } else if (mimeType?.startsWith('audio/')) {
      type = 'audio';
      folder = 'audio';
    }

    const cleanName = filename.toLowerCase().replace(/[^a-z0-9._-]/g, '_');
    const diskFilename = `${Date.now()}_${cleanName}`;
    const targetDir = path.join(MEDIA_BASE, folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const targetPath = path.join(targetDir, diskFilename);
    const buffer = Buffer.from(base64Data.replace(/^data:[^;]+;base64,/, ''), 'base64');
    fs.writeFileSync(targetPath, buffer);

    const relativePath = `/media/${folder}/${diskFilename}`;
    const newMediaItem = {
      id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type,
      title: title || filename,
      category: category || 'general',
      filename: diskFilename,
      originalName: filename,
      path: relativePath,
      sizeBytes: buffer.length,
      mimeType: mimeType || 'application/octet-stream',
      assignedTo: assignedTo || null,
      dateAdded: new Date().toISOString()
    };

    const manifest = readManifest();
    manifest.media.push(newMediaItem);

    if (assignedTo && manifest.sectionAssignments) {
      if (!manifest.sectionAssignments[assignedTo]) {
        manifest.sectionAssignments[assignedTo] = {};
      }
      manifest.sectionAssignments[assignedTo].mediaId = newMediaItem.id;
    }

    writeManifest(manifest);

    res.json({
      success: true,
      message: 'Archivo subido e incorporado al proyecto',
      media: newMediaItem,
      manifest
    });
  } catch (err: any) {
    console.error('Error in upload-base64:', err);
    res.status(500).json({ error: err.message || 'Error al guardar archivo' });
  }
});

app.post('/api/media/manifest', (req: Request, res: Response) => {
  try {
    const updated = req.body;
    if (!updated || typeof updated !== 'object') {
      return res.status(400).json({ error: 'Payload de manifiesto inválido' });
    }
    writeManifest(updated);
    res.json({ success: true, manifest: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/media/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const manifest = readManifest();
    const itemIndex = manifest.media.findIndex((m: any) => m.id === id);

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Recurso no encontrado' });
    }

    const item = manifest.media[itemIndex];
    const fullPath = path.join(__dirname, 'public', item.path.replace(/^\//, ''));

    // Remove file if exists on disk
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
      } catch (e) {
        console.warn('Could not delete file on disk:', fullPath, e);
      }
    }

    // Clean from assignments
    Object.keys(manifest.sectionAssignments || {}).forEach(secKey => {
      if (manifest.sectionAssignments[secKey]?.mediaId === id) {
        delete manifest.sectionAssignments[secKey].mediaId;
      }
    });

    manifest.media.splice(itemIndex, 1);
    writeManifest(manifest);

    res.json({ success: true, message: 'Recurso eliminado del proyecto', manifest });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ZIP Export Endpoint: exports all code and media
app.get('/api/media/export-project-zip', async (req: Request, res: Response) => {
  try {
    const zip = new JSZip();

    // Helper to recursively add folder to zip while skipping node_modules and .git
    function addDirToZip(sourceDir: string, zipFolder: JSZip) {
      const items = fs.readdirSync(sourceDir);
      for (const item of items) {
        if (item === 'node_modules' || item === '.git' || item === 'dist') continue;
        const fullPath = path.join(sourceDir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          const nestedZip = zipFolder.folder(item);
          if (nestedZip) addDirToZip(fullPath, nestedZip);
        } else {
          const content = fs.readFileSync(fullPath);
          zipFolder.file(item, content);
        }
      }
    }

    addDirToZip(__dirname, zip);

    const buffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'STORE'
    });

    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `constitucion-dominicana-completo-${timestamp}.zip`;

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);
    res.end(buffer);
  } catch (err: any) {
    console.error('Error generating project ZIP:', err);
    res.status(500).json({ error: 'No se pudo generar el archivo ZIP: ' + err.message });
  }
});

// Mount Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
