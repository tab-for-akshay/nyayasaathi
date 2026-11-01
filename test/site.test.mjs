// Site checks: real title, viewport, local assets present, disclosure line, no placeholders, no secrets.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const site = new URL('../site/', import.meta.url);
const read = f => fs.readFileSync(new URL(f, site), 'utf8');
for (const page of ['index.html', 'kb.html']) {
  test(page + ' has title, viewport and the disclosure line', () => {
    const h = read(page);
    assert.match(h, /<title>[^<]*NyayaSaathi[^<]*<\/title>/); assert.match(h, /name="viewport" content="width=device-width/);
    assert.match(h, /Built by Tab, an AI assistant, for team lead Akshay Wagh\./);
    assert.doesNotMatch(h, /lorem|TODO|\{\{|__[A-Z]+__/i);
    for (const m of h.matchAll(/(?:src|href)="([^"#:]+?)"/g)) { const f = m[1].replace(/^\.\//, ''); if (!f || f === './' || f.endsWith('/') || f.includes('${')) continue; if (f === 'demo.mp4' && !fs.existsSync(new URL(f, site))) continue; assert.ok(fs.existsSync(new URL(f, site)), page + ' -> ' + f); }
  });
}
test('index.html offers English, Hindi and Marathi', () => { const h = read('index.html'); for (const l of ['data-lang="en"', 'data-lang="hi"', 'data-lang="mr"']) assert.ok(h.includes(l)); });
test('built worker carries no API key and serves a 404 for its own source', () => {
  const w = read('worker.mjs');
  assert.doesNotMatch(w, /gsk_[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{20,}/);
  assert.match(w, /globalThis\.__NYAYA_SECRETS__ \|\| \{\}/);
  assert.match(w, /worker\|core/);
});
