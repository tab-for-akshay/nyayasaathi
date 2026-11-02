
// ---------- Worker ----------
const SECRETS = __SECRETS__; // injected at deploy time only; never committed
const MODELS = [
  { name: 'openai/gpt-oss-120b', url: 'https://api.groq.com/openai/v1/chat/completions', key: 'GROQ', extra: { reasoning_effort: 'low' } },
  { name: 'openai/gpt-oss-20b', url: 'https://api.groq.com/openai/v1/chat/completions', key: 'GROQ', extra: { reasoning_effort: 'low' } },
  { name: 'gemini-3.5-flash-lite', url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', key: 'GEMINI', extra: {} },
  // Red-team fix (2 Nov 2026): a free route on its own quota for when the Groq/Gemini free quotas are used up.
  { name: 'mercury-3', url: 'https://api.inceptionlabs.ai/v1/chat/completions', key: 'INCEPTION', extra: {}, minTokens: 3000 }
];
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

// Per-visitor limit (red-team fix, 2 Nov 2026). Counts in the site's KV store when bound (shared by every
// server instance), else in this instance's memory.
const RL = new Map();
async function rateLimited(request, env, max = 30, windowMs = 10 * 60 * 1000) {
  const ip = (request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'anon').split(',')[0].trim();
  const slot = Math.floor(Date.now() / windowMs);
  if (env && env.DATA && env.DATA.get) {
    try {
      const k = 'rl:' + ip + ':' + slot; const n = parseInt(await env.DATA.get(k) || '0', 10) + 1;
      await env.DATA.put(k, String(n), { expirationTtl: Math.max(60, Math.ceil(windowMs / 1000) * 2) });
      return n > max;
    } catch (e) { /* fall through to memory */ }
  }
  const k = ip + ':' + slot; const n = (RL.get(k) || 0) + 1; RL.set(k, n);
  if (RL.size > 5000) RL.delete(RL.keys().next().value);
  return n > max;
}

async function chat(messages, { maxTokens = 1400, jsonMode = false, fast = false } = {}) {
  const tries = [];
  const order = fast ? [MODELS[1], MODELS[0], MODELS[2], MODELS[3]] : MODELS; // router: small model first, saves the big model's quota
  for (const m of order) {
    const key = SECRETS[m.key]; if (!key) { tries.push(m.name + ': no key'); continue; }
    const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), 25000); const t0 = Date.now();
    try {
      const body = { model: m.name, messages, temperature: 0.1, max_tokens: Math.max(maxTokens, m.minTokens || 0), ...m.extra };
      if (jsonMode) body.response_format = { type: 'json_object' };
      const r = await fetch(m.url, { method: 'POST', signal: ctl.signal, headers: { authorization: 'Bearer ' + key, 'content-type': 'application/json' }, body: JSON.stringify(body) });
      const j = await r.json().catch(() => ({}));
      const text = j?.choices?.[0]?.message?.content || '';
      if (!r.ok || !text.trim()) { tries.push(`${m.name}: ${r.status} ${(j?.error?.message || 'empty').slice(0, 80)}`); continue; }
      return { text, model: m.name, ms: Date.now() - t0, tries };
    } catch (e) { tries.push(`${m.name}: ${String(e).slice(0, 60)}`); }
    finally { clearTimeout(timer); }
  }
  return { text: '', model: null, tries };
}

export async function ask(q, langIn) {
  const query = String(q || '').trim().slice(0, 800);
  const lang = LANGS.includes(langIn) ? langIn : detectLang(query);
  const base = { lang, disclaimer: STR.disclaimer[lang], free_help: freeHelp(KB), built_by: 'Built by Tab, an AI assistant, for team lead Akshay Wagh.' };
  if (!query) return { ...base, type: 'error', text: '' };
  if (isEmergency(query)) { // fixed message, no model call; related KB entries shown as-is
    const rel = keywordRetrieve(KB, query, 2).map(h => publicEntry(KB.entries.find(e => e.id === h.id), true));
    return { ...base, type: 'emergency', text: EMERGENCY_MESSAGE[lang], numbers: EMERGENCY_NUMBERS, entries: rel, model: null };
  }
  const kwHits = keywordRetrieve(KB, query);
  const routed = await chat(routerPrompt(KB, query), { maxTokens: 1000, jsonMode: true, fast: true });
  const routerIds = routed.model ? parseRouter(KB, routed.text) : null;
  const ids = combineIds(routerIds, kwHits, KB);
  if (!ids.length) return { ...base, type: 'no_match', text: STR.nomatch[lang], entries: [], covered: KB.entries.map(e => ({ id: e.id, title: e.title })), model: routed.model, retrieval: { router: routerIds, keyword: kwHits } };
  const entries = ids.map(id => KB.entries.find(e => e.id === id));
  const out = await chat(answerPrompt(entries, query, lang), { maxTokens: 1600 });
  const allIds = KB.entries.map(e => e.id);
  let text = cleanModelText(out.text, allIds), g = { ok: false, problems: [{ kind: 'no_model_answer', value: out.tries.join(' | ') }] }, used = 'model';
  if (text) g = guard(text, entries, KB, { query });
  let retried = false;
  if (text && !g.ok) { // one corrective retry, then the deterministic KB fallback
    retried = true;
    const msgs = answerPrompt(entries, query, lang); msgs.push({ role: 'assistant', content: text }, { role: 'user', content: retryNote(g.problems) });
    const out2 = await chat(msgs, { maxTokens: 1600 });
    const t2 = cleanModelText(out2.text, allIds);
    if (t2) { const g2 = guard(t2, entries, KB, { query }); if (g2.ok) { text = t2; g = { ...g2, first_draft_problems: g.problems }; } }
  }
  if (!g.ok) { text = STR.fallbackNote[lang] + '\n\n' + fallbackAnswer(entries); used = 'kb_fallback'; }
  return { ...base, type: 'answer', text, answer_source: used, entries: entries.map(publicEntry), model: out.model, guard: g, guard_retry: retried, retrieval: { router: routerIds, keyword: kwHits.map(h => h.id) } };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (/\/(worker|core)\.m?js$/.test(url.pathname) || url.pathname.startsWith('/src/')) return new Response('Not found', { status: 404 });
    if (url.pathname === '/api/health') return json({ ok: true, kb_entries: KB.entries.length, kb_checked_on: KB.checked_on, models: MODELS.map(m => m.name), keys: { groq: !!SECRETS.GROQ, gemini: !!SECRETS.GEMINI, inception: !!SECRETS.INCEPTION } });
    if (url.pathname === '/api/kb') return json({ checked_on: KB.checked_on, note: KB.note, entries: KB.entries.map(e => ({ ...publicEntry(e), facts: e.facts, steps: e.steps })) });
    if (url.pathname === '/api/ask') {
      if (request.method !== 'POST') return json({ error: 'POST {q, lang}' }, 405);
      if (await rateLimited(request, env)) return json({ type: 'error', text: 'Too many questions from your network in a few minutes. Please wait and try again. For help now call the NALSA legal aid helpline 15100.' }, 429);
      let body = {}; try { body = await request.json(); } catch {}
      try { return json(await ask(body.q, body.lang)); } catch (e) { return json({ type: 'error', text: 'Something went wrong. For help now call the NALSA legal aid helpline 15100.', error: String(e).slice(0, 120) }, 500); }
    }
    return env.ASSETS.fetch(request);
  }
};
