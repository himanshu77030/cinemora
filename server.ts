import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const rootDir = process.cwd();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory cache for server-side TMDB proxy
  const serverCache = new Map<string, { timestamp: number; data: any }>();
  const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasTmdbKey: Boolean(process.env.TMDB_API_KEY)
    });
  });

  // Secure TMDB Proxy endpoint - keeps API key hidden on server
  app.get('/api/tmdb', async (req: Request, res: Response) => {
    try {
      const apiKey = process.env.TMDB_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: 'TMDB_API_KEY is not configured on the server',
          fallback: true
        });
      }

      const endpoint = req.query.endpoint as string;
      if (!endpoint) {
        return res.status(400).json({ error: 'Missing required "endpoint" query parameter' });
      }

      // Build target TMDB URL
      const targetUrl = new URL(`https://api.themoviedb.org/3${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`);
      targetUrl.searchParams.append('api_key', apiKey);
      targetUrl.searchParams.append('include_adult', 'false');

      // Forward query parameters
      Object.entries(req.query).forEach(([key, val]) => {
        if (key !== 'endpoint' && val !== undefined && val !== null && val !== '') {
          targetUrl.searchParams.append(key, String(val));
        }
      });

      const cacheKey = targetUrl.toString();
      const cached = serverCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return res.json(cached.data);
      }

      const tmdbRes = await fetch(targetUrl.toString(), {
        headers: {
          Accept: 'application/json'
        }
      });

      if (!tmdbRes.ok) {
        return res.status(tmdbRes.status).json({
          error: `TMDB responded with status ${tmdbRes.status}`,
          statusText: tmdbRes.statusText
        });
      }

      const data = await tmdbRes.json();
      serverCache.set(cacheKey, { timestamp: Date.now(), data });
      return res.json(data);
    } catch (err) {
      console.error('Server TMDB proxy error:', err);
      return res.status(500).json({ error: 'Internal server error while contacting TMDB' });
    }
  });

  // Serve public static assets (e.g. google verification file, robots.txt, sitemap.xml)
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cinemora server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
