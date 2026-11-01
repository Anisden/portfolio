import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: '/portfolio/',
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        project: path.resolve(__dirname, 'project.html'),
        distinction: path.resolve(__dirname, 'distinction.html'),
        admin: path.resolve(__dirname, 'admin.html'),
      }
    }
  },
  plugins: [
    {
      name: 'admin-save-api',
      configureServer(server) {
        server.middlewares.use(adminApiMiddleware);
      },
      configurePreviewServer(server) {
        server.middlewares.use(adminApiMiddleware);
      }
    }
  ]
});

function adminApiMiddleware(req, res, next) {
  // Allow CORS for local admin requests from any origin/port
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-lang, x-filename');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const urlPath = (req.url || '').split('?')[0].replace(/^\/portfolio/, '');
  const lang = req.headers['x-lang'] || '';
  const suffix = lang && lang !== 'fr' ? `_${lang}` : '';

  if (urlPath === '/api/save-projects' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        fs.writeFileSync(path.resolve(__dirname, `public/projects${suffix}.json`), body, 'utf8');
        if (!suffix) {
          fs.writeFileSync(path.resolve(__dirname, 'public/projects_fr.json'), body, 'utf8');
          const frProjs = JSON.parse(body);
          const mediaFields = ['image', 'video', 'gallery', 'galleryDocs', 'galleryRealisation', 'galleryBefore', 'galleryAfter', 'year', 'region', 'showDistinctionBtn'];
          for (const l of ['en', 'ar']) {
            const pPath = path.resolve(__dirname, `public/projects_${l}.json`);
            if (fs.existsSync(pPath)) {
              const lProjs = JSON.parse(fs.readFileSync(pPath, 'utf8'));
              for (const fp of frProjs) {
                const match = lProjs.find(lp => lp.id === fp.id);
                if (match) {
                  for (const mf of mediaFields) match[mf] = fp[mf];
                } else {
                  lProjs.push({ ...fp });
                }
              }
              lProjs.sort((a, b) => (b.year || 0) - (a.year || 0));
              fs.writeFileSync(pPath, JSON.stringify(lProjs, null, 2), 'utf8');
            }
          }
        }
        res.statusCode = 200;
        res.end('Saved');
      } catch (err) {
        console.error('Error saving projects:', err);
        res.statusCode = 500;
        res.end(err.message);
      }
    });
  } else if (urlPath === '/api/save-content' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        fs.writeFileSync(path.resolve(__dirname, `public/content${suffix}.json`), body, 'utf8');
        if (!suffix) {
          fs.writeFileSync(path.resolve(__dirname, 'public/content_fr.json'), body, 'utf8');
        }
        res.statusCode = 200;
        res.end('Saved');
      } catch (err) {
        console.error('Error saving content:', err);
        res.statusCode = 500;
        res.end(err.message);
      }
    });
  } else if (urlPath === '/api/upload-image' && req.method === 'POST') {
    try {
      const rawHeader = req.headers['x-filename'] || '';
      const filename = rawHeader ? decodeURIComponent(rawHeader) : `upload_${Date.now()}.jpg`;
      const uploadDir = path.resolve(__dirname, 'public/uploads');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      
      const filePath = path.join(uploadDir, filename);
      const fileStream = fs.createWriteStream(filePath);
      req.pipe(fileStream);
      req.on('end', () => {
        res.statusCode = 200;
        res.end(`/uploads/${filename}`);
      });
    } catch (err) {
      console.error('Error uploading image:', err);
      res.statusCode = 500;
      res.end(err.message);
    }
  } else {
    next();
  }
}
