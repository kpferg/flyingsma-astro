#!/usr/bin/env node
/**
 * Internal link checker.
 *
 * Walks the built site and verifies every root-relative href resolves to a
 * page that actually exists. Catches the class of bug where a link or a
 * redirect points at a route that was renamed or never existed — invisible
 * from inside the site, and not something the build will complain about.
 *
 * Redirect stubs are ordinary pages in the output, so their targets get
 * checked too.
 *
 * Usage:  npm run check:links          (checks ./dist)
 *         node scripts/check-links.mjs <dir>
 *
 * Exits 1 if anything is broken, so it can gate a deploy.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative } from 'path';

const DIST = process.argv[2] || 'dist';

if (!existsSync(DIST)) {
  console.error(`No build found at "${DIST}". Run \`npm run build\` first.`);
  process.exit(1);
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (entry.endsWith('.html')) out.push(p);
  }
  return out;
}

/**
 * A path resolves if the build has a matching directory index or file.
 * Trailing slashes are ignored, matching `trailingSlash: 'ignore'` in
 * astro.config.mjs, and any #hash or ?query is dropped first.
 */
function resolves(urlPath) {
  const clean = urlPath.replace(/[?#].*$/, '').replace(/\/$/, '');
  if (clean === '' || clean === '/') return existsSync(join(DIST, 'index.html'));
  const rel = clean.replace(/^\//, '');
  return (
    existsSync(join(DIST, rel, 'index.html')) ||
    existsSync(join(DIST, `${rel}.html`)) ||
    existsSync(join(DIST, rel))
  );
}

const pages = walk(DIST);
const broken = new Map(); // target -> Set of pages linking to it
const targets = new Set();

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const from = '/' + relative(DIST, file).replace(/index\.html$/, '').replace(/\/$/, '');
  for (const match of html.matchAll(/href="(\/[^"#][^"]*|\/)"/g)) {
    const target = match[1];
    if (target.startsWith('//')) continue; // protocol-relative, i.e. external
    targets.add(target);
    if (!resolves(target)) {
      if (!broken.has(target)) broken.set(target, new Set());
      broken.get(target).add(from || '/');
    }
  }
}

console.log(`Checked ${pages.length} pages, ${targets.size} distinct internal link targets.`);

if (broken.size === 0) {
  console.log('No broken internal links.');
  process.exit(0);
}

console.error(`\n${broken.size} broken link target${broken.size === 1 ? '' : 's'}:\n`);
for (const [target, sources] of [...broken].sort()) {
  const list = [...sources].sort();
  const shown = list.slice(0, 6).join(', ');
  const more = list.length > 6 ? ` (+${list.length - 6} more)` : '';
  console.error(`  ${target}`);
  console.error(`      linked from: ${shown}${more}\n`);
}
process.exit(1);
