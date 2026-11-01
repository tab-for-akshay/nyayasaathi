// Tests for the "no invented law" guard. Run: node --test
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as c from '../src/core.mjs';
const kb = JSON.parse(fs.readFileSync(new URL('../src/kb.json', import.meta.url), 'utf8'));
const E = id => kb.entries.filter(e => e.id === id);

test('accepts an answer that only uses KB sections, fees, days and sites', () => {
  const g = c.guard('Write to the PIO (RTI Act s.6). Fee Rs 10, BPL pays nothing (rule 5). Reply in 30 days, 48 hours for life or liberty (s.7). Online: rtionline.gov.in', E('rti_apply'), kb);
  assert.equal(g.ok, true, JSON.stringify(g.problems));
});
test('blocks a section number that is not in the retrieved entries', () => {
  const g = c.guard('You can also use Section 8 of the RTI Act.', E('rti_apply'), kb);
  assert.equal(g.ok, false); assert.ok(g.problems.some(p => p.kind === 'section' && p.value === '8'));
});
test('blocks an invented helpline number', () => {
  const g = c.guard('Call the consumer helpline 1800-11-4000.', E('consumer_complaint'), kb);
  assert.equal(g.ok, false); assert.ok(g.problems.some(p => p.kind === 'number_or_helpline'));
});
test('blocks a real helpline that belongs to a different entry (not retrieved)', () => {
  const g = c.guard('Call 1930 to file an RTI.', E('rti_apply'), kb);
  assert.equal(g.ok, false); assert.ok(g.problems.some(p => p.value === '1930'));
});
test('blocks a website that is not in the KB', () => {
  const g = c.guard('See rtiindia.org for templates.', E('rti_apply'), kb);
  assert.equal(g.ok, false); assert.ok(g.problems.some(p => p.kind === 'website'));
});
test('catches Devanagari digits and Hindi/Marathi section words', () => {
  assert.equal(c.guard('धारा ४२० के तहत', E('fir_zero'), kb).ok, false);
  assert.equal(c.guard('कलम 173 नुसार कोणत्याही पोलीस ठाण्यात', E('fir_zero'), kb).ok, true);
  assert.equal(c.guard('हेल्पलाइन १९३० पर कॉल करें', E('cyber_fraud'), kb).ok, true);
});
test('Indian digit grouping is read as one number', () => {
  assert.equal(c.guard('Maharashtra income limit Rs 3,00,000 a year.', E('legal_aid'), kb).ok, true);
  assert.equal(c.guard('Maharashtra income limit Rs 4,00,000 a year.', E('legal_aid'), kb).ok, false);
});
test('numbers the person typed may be repeated back, sections may not', () => {
  assert.equal(c.guard('You lost Rs 20000. Call 1930 now.', E('cyber_fraud'), kb, { query: 'I lost 20000 in a UPI fraud' }).ok, true);
  assert.equal(c.guard('Section 420 applies.', E('cyber_fraud'), kb, { query: 'is this section 420?' }).ok, false);
});
test('every helpline, section and number used anywhere in the KB passes against its own entry', () => {
  for (const e of kb.entries) {
    const text = [...e.facts, ...e.steps].join('\n');
    const g = c.guard(text, [e], kb);
    assert.equal(g.ok, true, e.id + ' ' + JSON.stringify(g.problems));
  }
});
