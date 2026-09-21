export default async function handler(req: any, res: any) {
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

    // Forward additional query parameters
    Object.entries(req.query).forEach(([key, val]) => {
      if (key !== 'endpoint' && val !== undefined && val !== null && val !== '') {
        targetUrl.searchParams.append(key, String(val));
      }
    });

    const tmdbRes = await fetch(targetUrl.toString(), {
      headers: {
        Accept: 'application/json'
      }
    });

    if (!tmdbRes.ok) {
      return res.status(tmdbRes.status).json({
        error: `TMDB responded with status ${tmdbRes.status}`
      });
    }

    // Set cache headers for high performance
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1200');
    const data = await tmdbRes.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('TMDB serverless proxy error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
