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
  if (req.url === '/api/save-projects' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      fs.writeFileSync(path.resolve('public/projects.json'), body);
      res.statusCode = 200;
      res.end('Saved');
    });
  } else if (req.url === '/api/save-content' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      fs.writeFileSync(path.resolve('public/content.json'), body);
      res.statusCode = 200;
      res.end('Saved');
    });
  } else if (req.url === '/api/upload-image' && req.method === 'POST') {
    const rawHeader = req.headers['x-filename'] || '';
    const filename = rawHeader ? decodeURIComponent(rawHeader) : `upload_${Date.now()}.jpg`;
    const uploadDir = path.resolve('public/uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, filename);
    const fileStream = fs.createWriteStream(filePath);
    req.pipe(fileStream);
    req.on('end', () => {
      res.statusCode = 200;
      res.end(`/uploads/${filename}`);
    });
  } else {
    next();
  }
}
