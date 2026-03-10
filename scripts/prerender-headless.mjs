/**
 * Headless-browser prerender: after Vite build, serve dist, load each route in
 * Puppeteer, wait for React to render, then overwrite each route's index.html
 * with the full rendered HTML (meta tags + body content) for SEO.
 *
 * Build runs this automatically: npm run build
 *
 * For prerendered pages to show real data (not "Failed to load"), the API must
 * be running during the build. /api requests are proxied to PRERENDER_API_TARGET
 * (default http://localhost:3000). Start the backend before running build.
 *
 * Chrome is required for full prerender. If missing, the script skips gracefully
 * and the build still has meta-only HTML from vite-prerender-plugin.
 * To install Chrome for Puppeteer: npx puppeteer browsers install chrome
 * Or use system Chrome (set PUPPETEER_EXECUTABLE_PATH if needed).
 */

import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';
import { launch } from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', 'dist');
const PORT = 4321;
const API_TARGET = process.env.PRERENDER_API_TARGET || 'http://localhost:3000';

const BASE_ROUTES = [
  '/',
  '/buyCars',
  '/sellCars',
  '/resell-market-price',
  '/reviews',
  '/contact',
  '/payments',
  '/why-kyawkyar/rigorous-quality-inspection',
  '/why-kyawkyar/swift-processing',
  '/why-kyawkyar/clean-history',
  '/showroom-installment',
];

const LANGUAGES = ['my', 'en'];

const ROUTES = LANGUAGES.flatMap(lang => 
  BASE_ROUTES.map(route => route === '/' ? `/${lang}` : `/${lang}${route}`)
);

function serveFile(filePath) {
  return fs.promises.readFile(filePath).catch(() => null);
}

function resolveRequest(pathname) {
  if (!pathname || pathname === '/') return path.join(DIST, 'index.html');
  const decoded = decodeURIComponent(pathname);
  const safe = path.normalize(decoded).replace(/^(\.\.(\/|\\))+/, '').replace(/\\/g, '/').replace(/^\/+/, '');
  const candidate = path.join(DIST, safe || 'index.html');
  const resolved = path.resolve(candidate);
  const relative = path.relative(DIST, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return path.join(DIST, 'index.html');
  return resolved;
}

function proxyToApi(req, res) {
  const url = new URL(req.url || '/', `http://localhost`);
  const targetUrl = `${API_TARGET}${url.pathname}${url.search}`;
  const parsed = new URL(targetUrl);
  const isHttps = parsed.protocol === 'https:';
  const opts = {
    hostname: parsed.hostname,
    port: parsed.port || (isHttps ? 443 : 80),
    path: parsed.pathname + parsed.search,
    method: req.method,
    headers: { ...req.headers, host: parsed.host },
  };
  const requestModule = isHttps ? https : http;
  const proxyReq = requestModule.request(opts, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });
  proxyReq.on('error', (err) => {
    console.warn(`Prerender API proxy error (is backend running on ${API_TARGET}?):`, err.message);
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Bad Gateway', message: 'API unreachable during prerender' }));
  });
  req.pipe(proxyReq, { end: true });
}

const server = http.createServer(async (req, res) => {
  const pathname = new URL(req.url || '/', `http://localhost`).pathname;

  if (pathname.startsWith('/api')) {
    proxyToApi(req, res);
    return;
  }

  let filePath = resolveRequest(pathname);
  const stat = await fs.promises.stat(filePath).catch(() => null);
  if (stat && stat.isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  const content = await serveFile(filePath);
  if (!content) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  const ext = path.extname(filePath);
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.ico': 'image/x-icon',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
  };
  res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
  res.end(content);
});

async function run() {
  await new Promise((resolve) => server.listen(PORT, resolve));
  const base = `http://localhost:${PORT}`;

  let browser;
  try {
    browser = await launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      channel: process.env.PUPPETEER_EXECUTABLE_PATH ? undefined : 'chrome',
    });
  } catch (err) {
    server.close();
    console.warn(
      'Headless prerender skipped (Chrome not available). Build still has meta tags from vite-prerender-plugin.\n' +
        'For full HTML prerender: install Chrome, or run `npx puppeteer browsers install chrome`, or set PUPPETEER_EXECUTABLE_PATH.'
    );
    console.warn(err.message);
    process.exit(0);
  }

  for (const route of ROUTES) {
    const url = `${base}${route === '/' ? '' : route}`;
    const page = await browser.newPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.waitForSelector('#root > *', { timeout: 15000 }).catch(() => {});
      const html = await page.content();
      const outPath = route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, route.slice(1), 'index.html');
      await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
      await fs.promises.writeFile(outPath, html, 'utf-8');
      console.log(`Prerendered: ${route}`);
    } catch (err) {
      console.warn(`Prerender failed for ${route}:`, err.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.close();
  console.log('Headless prerender done.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
