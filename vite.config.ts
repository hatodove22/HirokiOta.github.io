import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import fs from 'fs';

function serveContentMiddleware() {
  return (req, res, next) => {
    if (!req.url) return next();
    // directory listing endpoint
    if (req.url.startsWith('/__content/list/')) {
      try {
        const type = req.url.replace('/__content/list/', '').split('?')[0];
        const base = type === 'papers' ? './content/papers' : type === 'projects' ? './content/projects' : type === 'news' ? './content/news' : null;
        if (!base) return next();
        const abs = path.resolve(__dirname, base);
        const items = fs
          .readdirSync(abs, { withFileTypes: true })
          .filter((d) => d.isDirectory())
          .map((d) => d.name)
          .sort();
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ items }));
        return;
      } catch {
        return next();
      }
    }
    if (!req.url.startsWith('/content/')) return next();
    const localPath = path.resolve(__dirname, `.${req.url}`);
    try {
      const stat = fs.statSync(localPath);
      if (!stat.isFile()) return next();
      const ext = path.extname(localPath).toLowerCase();
      const type = ext === '.json'
        ? 'application/json; charset=utf-8'
        : ext === '.md'
        ? 'text/markdown; charset=utf-8'
        : ext === '.txt'
        ? 'text/plain; charset=utf-8'
        : ext === '.png'
        ? 'image/png'
        : ext === '.jpg' || ext === '.jpeg'
        ? 'image/jpeg'
        : ext === '.webp'
        ? 'image/webp'
        : 'application/octet-stream';
      res.setHeader('Content-Type', type);
      fs.createReadStream(localPath).pipe(res);
      return;
    } catch {
      return next();
    }
  };
}

const adminRewritePlugin = {
  name: 'admin-rewrite',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (!req.url) return next();
      if (/^\/admin(?:\/?(?:\?.*)?)?$/.test(req.url)) {
        req.url = '/admin/index.html';
      }
      next();
    });
    server.middlewares.use(serveContentMiddleware());
  },
  configurePreviewServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (!req.url) return next();
      if (/^\/admin(?:\/?(?:\?.*)?)?$/.test(req.url)) {
        req.url = '/admin/index.html';
      }
      next();
    });
    server.middlewares.use(serveContentMiddleware());
  },
};

export default defineConfig({
  plugins: [react(), adminRewritePlugin],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      'vaul@1.1.2': 'vaul',
      'sonner@2.0.3': 'sonner',
      'recharts@2.15.2': 'recharts',
      'react-resizable-panels@2.1.7': 'react-resizable-panels',
      'react-hook-form@7.55.0': 'react-hook-form',
      'react-day-picker@8.10.1': 'react-day-picker',
      'next-themes@0.4.6': 'next-themes',
      'lucide-react@0.487.0': 'lucide-react',
      'input-otp@1.4.2': 'input-otp',
      'figma:asset/37d3f31165fb6b41b77513c4d8e0d1b581053602.png': path.resolve(__dirname, './src/assets/37d3f31165fb6b41b77513c4d8e0d1b581053602.png'),
      'embla-carousel-react@8.6.0': 'embla-carousel-react',
      'cmdk@1.1.1': 'cmdk',
      'class-variance-authority@0.7.1': 'class-variance-authority',
      '@radix-ui/react-tooltip@1.1.8': '@radix-ui/react-tooltip',
      '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
      '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
      '@radix-ui/react-tabs@1.1.3': '@radix-ui/react-tabs',
      '@radix-ui/react-switch@1.1.3': '@radix-ui/react-switch',
      '@radix-ui/react-slot@1.1.2': '@radix-ui/react-slot',
      '@radix-ui/react-slider@1.2.3': '@radix-ui/react-slider',
      '@radix-ui/react-separator@1.1.2': '@radix-ui/react-separator',
      '@radix-ui/react-select@2.1.6': '@radix-ui/react-select',
      '@radix-ui/react-scroll-area@1.2.3': '@radix-ui/react-scroll-area',
      '@radix-ui/react-radio-group@1.2.3': '@radix-ui/react-radio-group',
      '@radix-ui/react-progress@1.1.2': '@radix-ui/react-progress',
      '@radix-ui/react-popover@1.1.6': '@radix-ui/react-popover',
      '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
      '@radix-ui/react-menubar@1.1.6': '@radix-ui/react-menubar',
      '@radix-ui/react-label@2.1.2': '@radix-ui/react-label',
      '@radix-ui/react-hover-card@1.1.6': '@radix-ui/react-hover-card',
      '@radix-ui/react-dropdown-menu@2.1.6': '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-dialog@1.1.6': '@radix-ui/react-dialog',
      '@radix-ui/react-context-menu@2.2.6': '@radix-ui/react-context-menu',
      '@radix-ui/react-collapsible@1.1.3': '@radix-ui/react-collapsible',
      '@radix-ui/react-checkbox@1.1.4': '@radix-ui/react-checkbox',
      '@radix-ui/react-avatar@1.1.3': '@radix-ui/react-avatar',
      '@radix-ui/react-aspect-ratio@1.1.2': '@radix-ui/react-aspect-ratio',
      '@radix-ui/react-alert-dialog@1.1.6': '@radix-ui/react-alert-dialog',
      '@radix-ui/react-accordion@1.2.3': '@radix-ui/react-accordion',
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
  },
  server: {
    port: 3000,
    host: true,
    open: true,
  },
});
