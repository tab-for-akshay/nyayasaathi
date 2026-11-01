
globalThis.__NYAYA_SECRETS__ = { GROQ: process.env.NS_GROQ, GEMINI: process.env.NS_GEM };
const w = await import('../site/worker.mjs');
const qs = JSON.parse(process.argv[2]);
const res = await Promise.all(qs.map(async ([q, l]) => { const t0 = Date.now(); const r = await w.ask(q, l); return { q, ms: Date.now() - t0, type: r.type, lang: r.lang, model: r.model, src: r.answer_source, guard: r.guard, ids: (r.entries || []).map(e => e.id), retrieval: r.retrieval, text: r.text }; }));
console.log(JSON.stringify(res, null, 1));
