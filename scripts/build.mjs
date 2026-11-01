// Build: concatenate core + KB + Worker handler into ONE site/worker.mjs (the host needs a single module).
// Secrets are NOT added here; site/worker.mjs keeps the __SECRETS__ placeholder = {} until deploy.
import fs from 'fs';
const root = new URL('..', import.meta.url);
const core = fs.readFileSync(new URL('src/core.mjs', root), 'utf8').replace(/^export (?=(const|function|async function) )/gm, '');
const kb = fs.readFileSync(new URL('src/kb.json', root), 'utf8');
const handler = fs.readFileSync(new URL('src/worker.src.mjs', root), 'utf8').replace('const SECRETS = __SECRETS__;', 'const SECRETS = globalThis.__NYAYA_SECRETS__ || {};');
const out = `${core}\nconst KB = ${kb};\n${handler}`;
fs.writeFileSync(new URL('site/worker.mjs', root), out);
console.log('wrote site/worker.mjs', out.length, 'bytes');
