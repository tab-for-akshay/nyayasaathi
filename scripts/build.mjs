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

// Static knowledge-base page (no fetch needed): rendered from src/kb.json at build time.
const K = JSON.parse(kb); const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const body = K.entries.map(e => `<article class="kbe" id="${e.id}"><h2>${esc(e.title)}</h2>
<ul>${e.facts.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
${e.sections.length ? `<p class="meta"><strong>Law:</strong> ${e.sections.map(esc).join(' · ')}</p>` : ''}
${e.helplines.length ? `<p class="meta"><strong>Helplines:</strong> ${e.helplines.map(esc).join(' · ')}</p>` : ''}
<details><summary>Official sources (checked)</summary><ul class="src">${e.sources.map(s => `<li><a href="${esc(s.url)}" rel="noopener" target="_blank">${esc(s.url)}</a> – ${esc(s.what)} <span class="chk">checked ${esc(s.checked)}</span></li>`).join('')}</ul></details></article>`).join('\n');
const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Knowledge base and official sources – NyayaSaathi</title>
<meta name="description" content="Every fact NyayaSaathi can use, with the official source URL and the date it was checked.">
<link rel="icon" href="icon.svg" type="image/svg+xml">
<link rel="stylesheet" href="styles.css">
</head>
<body>
<header class="top"><div class="brand"><img src="icon.svg" alt="" width="40" height="40"><div><h1><a href="./" class="home">NyayaSaathi</a> – knowledge base</h1><p class="tag">${K.entries.length} entries, all checked on official pages on ${esc(K.checked_on)}. The chatbot may only answer from these.</p></div></div></header>
<main class="kbmain"><div id="kb" class="kblist">
${body}
</div></main>
<footer class="foot"><p>Built by Tab, an AI assistant, for team lead Akshay Wagh. · <a href="./">Back to the chatbot</a> · <a href="https://github.com/tab-for-akshay/nyayasaathi/blob/main/src/kb.json">kb.json on GitHub</a></p></footer>
</body>
</html>
`;
fs.writeFileSync(new URL('site/kb.html', root), page);
console.log('wrote site/kb.html', page.length, 'bytes');
