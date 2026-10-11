// Production build for estherbtpsy.com: indexable HTML, prerendered content, robots and sitemap.
import { execSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { chromium } from 'playwright';

const SITE = 'https://estherbtpsy.com';
const OUT = resolve('dist-prod');

execSync(`npx vite build --outDir ${OUT} --emptyOutDir`, { stdio: 'inherit' });

for (const file of readdirSync(OUT).filter((f) => f.endsWith('.html'))) {
  const path = join(OUT, file);
  let html = readFileSync(path, 'utf8').replace(/\s*<meta name="robots" content="noindex, nofollow">/, '');
  if (file === 'index.html') {
    html = html.replace(
      '<meta property="og:type" content="website">',
      `<link rel="canonical" href="${SITE}/">\n  <meta property="og:type" content="website">\n  <meta property="og:url" content="${SITE}/">\n  <meta property="og:image" content="${SITE}/assets/session.jpg">`
    );
  }
  writeFileSync(path, html);
}

writeFileSync(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
const today = new Date().toISOString().slice(0, 10);
const urls = ['/', '/accessibility.html', '/privacy.html'];
writeFileSync(join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);

// Prerender the rendered page into #root so search engines and no-JS visitors get the full text.
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png' };
const server = createServer((req, res) => {
  const p = join(OUT, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
  if (!p.startsWith(OUT) || !existsSync(p)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': TYPES[extname(p)] || 'application/octet-stream' });
  res.end(readFileSync(p));
}).listen(0);
const port = server.address().port;
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ reducedMotion: 'reduce', viewport: { width: 1280, height: 900 } });
await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });
const rendered = await page.evaluate(() => document.getElementById('root').innerHTML);
await browser.close();
server.close();

const indexPath = join(OUT, 'index.html');
writeFileSync(indexPath, readFileSync(indexPath, 'utf8').replace('<div id="root"></div>', `<div id="root">${rendered}</div>`));
console.log(`prerendered ${rendered.length} chars into index.html`);
