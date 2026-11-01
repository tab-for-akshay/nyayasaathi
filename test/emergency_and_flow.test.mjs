// Tests for the emergency path and the full ask() flow with a mocked model.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as c from '../src/core.mjs';
globalThis.__NYAYA_SECRETS__ = { GROQ: 'test-key' };
const w = await import('../site/worker.mjs');
let calls = 0, script = [];
globalThis.fetch = async (url, init) => { calls++; const next = script.shift(); if (!next) throw new Error('unexpected network call to ' + url); return new Response(JSON.stringify({ choices: [{ message: { content: next } }] }), { status: 200 }); };

const EMERG = ['I want to kill myself', 'my husband beats me every day', 'He threatened to kill me tonight', 'मैं आत्महत्या करना चाहता हूँ', 'पति रोज़ मारपीट करता है', 'मला जीव द्यायचा आहे', 'नवरा मला मारहाण करत आहे', 'mujhe maar dalega', 'there was an acid attack on my sister'];
test('emergency words are detected in English, Hindi, Marathi and Hinglish', () => { for (const q of EMERG) assert.equal(c.isEmergency(q), true, q); });
test('ordinary questions are not treated as emergencies', () => { for (const q of ['How do I file an RTI?', 'मेरी सैलरी नहीं मिली', 'माझे भाडे करार', 'cheque bounce notice', 'online fraud 20000']) assert.equal(c.isEmergency(q), false, q); });
test('emergency path returns the fixed message with 112, 181, 14416 and makes NO model call', async () => {
  for (const [q, lang] of [['I want to end my life', 'en'], ['मैं आत्महत्या करना चाहता हूँ', 'hi'], ['मला जीव द्यायचा आहे', 'mr']]) {
    calls = 0; script = [];
    const r = await w.ask(q, 'auto');
    assert.equal(r.type, 'emergency'); assert.equal(r.lang, lang); assert.equal(calls, 0);
    for (const n of ['112', '181', '14416']) assert.ok(r.text.includes(n), lang + ' missing ' + n);
    assert.equal(r.text, c.EMERGENCY_MESSAGE[lang]);
  }
});
test('a model answer with an invented section/helpline is replaced by the checked KB text', async () => {
  calls = 0; script = ['{"ids":["consumer_complaint"]}', 'Under section 420 call 1800-11-4000 for a refund.', 'Still: section 12 and 1800114000.'];
  const r = await w.ask('My new phone is defective and the shop will not refund', 'en');
  assert.equal(r.type, 'answer'); assert.equal(r.answer_source, 'kb_fallback'); assert.equal(r.guard.ok, false);
  assert.ok(!r.text.includes('420') && !r.text.includes('1800'));
  assert.ok(r.text.includes('1915'));
});
test('a corrective retry that removes the invented number is accepted', async () => {
  script = ['{"ids":["consumer_complaint"]}', 'Call 1800-11-4000.', 'Call the National Consumer Helpline 1915, then file on e-Jagriti within two years (CPA s.69).'];
  const r = await w.ask('refund refused for defective product', 'en');
  assert.equal(r.answer_source, 'model'); assert.equal(r.guard.ok, true); assert.ok(r.guard_retry);
});
test('a clean model answer passes and cites KB sources', async () => {
  script = ['{"ids":["rti_apply"]}', 'You can ask the PIO for information (RTI Act s.6). Fee Rs 10 for Central offices; reply within 30 days (s.7).'];
  const r = await w.ask('How do I file an RTI?', 'en');
  assert.equal(r.answer_source, 'model'); assert.deepEqual(r.entries.map(e => e.id), ['rti_apply']);
  assert.ok(r.entries[0].links.some(l => l.url.startsWith('https://rtionline.gov.in')));
  assert.match(r.disclaimer, /not legal advice/);
});
test('no matching entry → says so and points to legal aid, no answer call', async () => {
  calls = 0; script = ['{"ids":[]}'];
  const r = await w.ask('How do I patent my invention?', 'en');
  assert.equal(r.type, 'no_match'); assert.equal(calls, 1); assert.ok(r.text.includes('15100'));
});
test('router ids that are not in the KB are ignored', () => {
  const kb = { entries: [{ id: 'a' }, { id: 'b' }] };
  assert.deepEqual(c.parseRouter(kb, '{"ids":["a","zzz","b","a"]}'), ['a', 'b']);
  assert.equal(c.parseRouter(kb, 'nonsense'), null);
});
test('language detection: English, Hindi, Marathi', () => {
  assert.equal(c.detectLang('my salary'), 'en'); assert.equal(c.detectLang('मेरी सैलरी नहीं मिली, क्या करूँ?'), 'hi'); assert.equal(c.detectLang('माझा पगार मिळाला नाही'), 'mr');
});
