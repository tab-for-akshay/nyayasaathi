// Knowledge-base integrity: every entry is sourced, dated and links only to official domains.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const kb = JSON.parse(fs.readFileSync(new URL('../src/kb.json', import.meta.url), 'utf8'));
const OFFICIAL = /(^|\.)(gov\.in|nic\.in|tele-law\.in|rbi\.org\.in)$/; // government sites, the Tele-Law portal and the Reserve Bank of India
test('KB has 20-30 entries with unique ids', () => { assert.ok(kb.entries.length >= 20 && kb.entries.length <= 30); assert.equal(new Set(kb.entries.map(e => e.id)).size, kb.entries.length); });
test('every entry has facts, steps, keywords and at least one dated official source', () => {
  for (const e of kb.entries) {
    assert.ok(e.facts.length && e.steps.length && e.kw.length, e.id);
    assert.ok(e.sources.length, e.id);
    for (const s of e.sources) { assert.match(s.checked, /^\d{4}-\d{2}-\d{2}$/); assert.ok(OFFICIAL.test(new URL(s.url).hostname), e.id + ' ' + s.url); }
    for (const l of e.links) assert.ok(OFFICIAL.test(new URL(l.url).hostname), e.id + ' ' + l.url);
  }
});
test('the AI disclosure line is in the KB note', () => assert.match(kb.note, /Built by Tab, an AI assistant, for team lead Akshay Wagh/));
