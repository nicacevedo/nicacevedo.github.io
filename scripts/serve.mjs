/**
 * Minimal static server for the built site.
 *
 * Tests run against this rather than `astro preview` because it reproduces the
 * two GitHub Pages behaviours that matter: a directory resolves to its
 * index.html, and an unknown path returns 404.html with a 404 status.
 *
 * Usage: node scripts/serve.mjs [port]
 */
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('../dist', import.meta.url)));
const PORT = Number(process.argv[2] ?? process.env.PORT ?? 4321);

const TYPES = new Map(
  Object.entries({
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.webmanifest': 'application/manifest+json; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
  }),
);

async function resolveFile(pathname) {
  const clean = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  const target = join(ROOT, clean);
  if (!target.startsWith(ROOT + sep) && target !== ROOT) return null;

  const candidates = clean.endsWith('/')
    ? [join(target, 'index.html')]
    : [target, join(target, 'index.html')];
  for (const candidate of candidates) {
    try {
      const info = await stat(candidate);
      if (info.isFile()) return { path: candidate, size: info.size };
    } catch {
      /* try the next candidate */
    }
  }
  return null;
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  const found = await resolveFile(url.pathname);

  if (!found) {
    const fallback = await resolveFile('/404.html');
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
    if (fallback) createReadStream(fallback.path).pipe(res);
    else res.end('Not found');
    return;
  }

  res.writeHead(200, {
    'content-type': TYPES.get(extname(found.path)) ?? 'application/octet-stream',
    'content-length': found.size,
    'cache-control': 'no-store',
  });
  createReadStream(found.path).pipe(res);
}).listen(PORT, () => {
  console.log(`serving dist/ on http://localhost:${PORT}`);
});
