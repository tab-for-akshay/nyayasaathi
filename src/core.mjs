// NyayaSaathi core logic — pure functions, no network. Shared by the Worker and the tests.
// Built by Tab, an AI assistant, for team lead Akshay Wagh.

export const LANGS = ['en', 'hi', 'mr'];

// ---------- text helpers ----------
const DEV_DIGITS = { '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9' };
export function asciiDigits(s) { return String(s || '').replace(/[०-९]/g, d => DEV_DIGITS[d]); }
export function norm(s) { return ' ' + asciiDigits(s).toLowerCase().replace(/[“”"'’`]/g, '').replace(/\s+/g, ' ').trim() + ' '; }

// ---------- language ----------
const MR_MARKERS = new Set(['आहे', 'आहेत', 'नाही', 'नाहीत', 'मला', 'माझ्या', 'माझा', 'माझी', 'माझे', 'माझं', 'मी', 'काय', 'कसे', 'कशी', 'कसा', 'करू', 'केला', 'केली', 'झाले', 'झाला', 'झाली', 'तक्रार', 'पाहिजे', 'करावी', 'करायची', 'करायचे', 'मिळेल', 'देत', 'घेत', 'आम्ही', 'तुम्ही', 'कुठे', 'नवरा', 'पगार', 'भाडे', 'आणि', 'किंवा', 'आता', 'मालक']);
export function detectLang(text) {
  const t = String(text || '');
  if (!/[\u0900-\u097F]/.test(t)) return 'en';
  const words = t.split(/[\s,.?!।]+/);
  let mr = 0; for (const w of words) if (MR_MARKERS.has(w)) mr++;
  return mr > 0 ? 'mr' : 'hi';
}

// ---------- emergency path (no model call) ----------
const EMERGENCY_TERMS = [
  // English
  'suicide', 'suicidal', 'kill myself', 'killing myself', 'end my life', 'take my life', 'want to die', 'wanna die', 'hang myself', 'self harm', 'self-harm',
  'will kill me', 'going to kill me', 'gonna kill me', 'threatening to kill', 'threatened to kill', 'threat to my life', 'life is in danger', 'my life is at risk',
  'beating me', 'beats me', 'beat me', 'hits me', 'hit me', 'slapped me', 'is hitting me', 'hitting me now', 'attacking me', 'being beaten', 'he is beating', 'raped', 'rape ', 'kidnapped', 'acid attack', 'locked me in',
  // Hinglish (Latin script)
  'aatmahatya', 'atmahatya', 'khudkushi', 'marna chahta', 'marna chahti', 'jaan de dunga', 'jaan de dungi', 'jaan se maar', 'maar dalega', 'maar dalenge', 'maar daalega', 'mujhe maar raha', 'marta hai', 'maarta hai', 'peet-ta', 'peetta hai', 'peet raha', 'pit raha', 'balatkar', 'jeev denar',
  // Hindi
  'आत्महत्या', 'खुदकुशी', 'ख़ुदकुशी', 'मरना चाहता', 'मरना चाहती', 'जान दे दूंगा', 'जान दे दूंगी', 'जान दे दूँगा', 'जान दे दूँगी', 'जान से मार', 'मार डालेगा', 'मार डालेंगे', 'मार डालूंगा', 'मुझे मार रहा', 'मुझे मार रहे', 'पीट रहा', 'पीट रहे', 'मारता है', 'पीटता है', 'मारते हैं', 'पीटते हैं', 'मारपीट', 'बलात्कार', 'जान को खतरा', 'जान को ख़तरा', 'अपहरण', 'तेजाब', 'तेज़ाब',
  // Marathi
  'जीव देणार', 'जीव द्यायचा', 'जीव देईन', 'मरायचं आहे', 'मरायचे आहे', 'मरून जावंसं', 'जीवे मारण्याची', 'जीवे मारेल', 'मारून टाकेल', 'मारून टाकीन', 'मला मारत आहे', 'मला मारतोय', 'मारहाण करत आहे', 'मारहाण', 'मारतो', 'मारते', 'जीवाला धोका', 'अपहरण'
];
export function isEmergency(text) {
  const t = norm(text);
  return EMERGENCY_TERMS.some(w => t.includes(w.toLowerCase()));
}
export const EMERGENCY_MESSAGE = {
  en: 'If you or someone else is in danger right now, please call 112 (police, fire, ambulance – all India emergency number) immediately.\n• Women in distress: Women Helpline 181 (24 hours, toll-free).\n• If you are thinking of ending your life or are in deep distress: Tele-MANAS 14416 (free, confidential, 24x7).\nYou are not alone. Please call now and stay with someone you trust. When you are safe, free legal aid is available on 15100.',
  hi: 'अगर आप या कोई और अभी खतरे में है, तो तुरंत 112 पर कॉल करें (पुलिस, फायर, एम्बुलेंस – पूरे भारत का आपातकालीन नंबर)।\n• संकट में महिलाएँ: महिला हेल्पलाइन 181 (24 घंटे, निःशुल्क)।\n• अगर आप अपनी जान लेने के बारे में सोच रहे हैं या बहुत परेशान हैं: टेली-मानस 14416 (निःशुल्क, गोपनीय, 24x7)।\nआप अकेले नहीं हैं। अभी कॉल करें और किसी भरोसेमंद व्यक्ति के साथ रहें। सुरक्षित होने पर मुफ्त कानूनी सहायता 15100 पर उपलब्ध है।',
  mr: 'तुम्ही किंवा दुसरे कोणी आत्ता धोक्यात असल्यास, लगेच 112 वर कॉल करा (पोलीस, अग्निशमन, रुग्णवाहिका – संपूर्ण भारताचा आपत्कालीन क्रमांक).\n• संकटात असलेल्या महिला: महिला हेल्पलाइन 181 (24 तास, मोफत).\n• तुम्ही जीव देण्याचा विचार करत असाल किंवा खूप त्रासात असाल: टेली-मानस 14416 (मोफत, गोपनीय, 24x7).\nतुम्ही एकटे नाही. आत्ता कॉल करा आणि विश्वासू व्यक्तीसोबत राहा. सुरक्षित झाल्यावर मोफत कायदेशीर मदत 15100 वर मिळते.'
};
export const EMERGENCY_NUMBERS = ['112', '181', '14416', '15100'];

// ---------- UI / fixed strings ----------
export const STR = {
  disclaimer: {
    en: 'This is legal information, not legal advice. For advice on your case, talk to a lawyer – free legal aid is available.',
    hi: 'यह कानूनी जानकारी है, कानूनी सलाह नहीं। अपने मामले में सलाह के लिए वकील से बात करें – मुफ्त कानूनी सहायता उपलब्ध है।',
    mr: 'ही कायदेशीर माहिती आहे, कायदेशीर सल्ला नाही. तुमच्या प्रकरणासाठी वकिलाशी बोला – मोफत कायदेशीर मदत उपलब्ध आहे.'
  },
  nomatch: {
    en: 'Sorry – my checked knowledge base does not cover this question yet, so I will not guess. Please contact free legal aid: call the NALSA helpline 15100 or go to the District Legal Services Authority (DLSA) of your district. You can also get advice by video through Tele-Law at a Common Service Centre.',
    hi: 'क्षमा करें – मेरे जाँचे गए ज्ञानकोश में अभी इस सवाल की जानकारी नहीं है, इसलिए मैं अनुमान नहीं लगाऊँगा। कृपया मुफ्त कानूनी सहायता लें: NALSA हेल्पलाइन 15100 पर कॉल करें या अपने जिले के जिला विधिक सेवा प्राधिकरण (DLSA) से संपर्क करें। आप कॉमन सर्विस सेंटर पर टेली-लॉ से वीडियो पर सलाह भी ले सकते हैं।',
    mr: 'माफ करा – माझ्या तपासलेल्या माहितीसंग्रहात अजून या प्रश्नाची माहिती नाही, म्हणून मी अंदाज लावणार नाही. कृपया मोफत कायदेशीर मदत घ्या: NALSA हेल्पलाइन 15100 वर कॉल करा किंवा तुमच्या जिल्ह्याच्या जिल्हा विधी सेवा प्राधिकरणाशी (DLSA) संपर्क करा. कॉमन सर्व्हिस सेंटरवर टेली-लॉद्वारे व्हिडिओवर सल्लाही मिळू शकतो.'
  },
  fallbackNote: {
    en: 'Showing the checked facts directly from the knowledge base.',
    hi: 'जाँचे गए तथ्य सीधे ज्ञानकोश से दिखाए जा रहे हैं (अंग्रेज़ी में)।',
    mr: 'तपासलेली माहिती थेट माहितीसंग्रहातून दाखवत आहोत (इंग्रजीत).'
  }
};
export const LANG_NAME = { en: 'English', hi: 'Hindi (हिंदी, Devanagari script)', mr: 'Marathi (मराठी, Devanagari script)' };

// ---------- retrieval ----------
export function keywordRetrieve(kb, query, k = 3) {
  const t = norm(query);
  const scored = kb.entries.map(e => {
    let s = 0;
    for (const w of e.kw) { const ww = w.toLowerCase(); if (ww.length < 3 ? t.includes(' ' + ww + ' ') : t.includes(ww)) s += ww.length >= 6 ? 2 : 1; }
    return { id: e.id, score: s };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}
export function routerPrompt(kb, query) {
  const list = kb.entries.map(e => `${e.id}: ${e.title}`).join('\n');
  return [
    { role: 'system', content: 'You route questions from ordinary people in India to entries of a small legal-information knowledge base. Reply with JSON only: {"ids": [up to 3 entry ids from the list, most relevant first]}. Use [] when no entry is clearly relevant. Never invent ids.\nEntries:\n' + list },
    { role: 'user', content: String(query).slice(0, 800) }
  ];
}
export function parseRouter(kb, raw) {
  const valid = new Set(kb.entries.map(e => e.id));
  try {
    const m = String(raw || '').match(/\{[\s\S]*\}/); if (!m) return null;
    const j = JSON.parse(m[0]); if (!Array.isArray(j.ids)) return null;
    return [...new Set(j.ids.filter(x => valid.has(x)))].slice(0, 3);
  } catch { return null; }
}
export function combineIds(routerIds, kwHits) {
  const ids = [];
  for (const id of routerIds || []) if (!ids.includes(id)) ids.push(id);
  for (const h of kwHits || []) if (h.score >= 2 && !ids.includes(h.id)) ids.push(h.id);
  if (routerIds === null && kwHits && kwHits.length && !ids.length) ids.push(kwHits[0].id); // model unavailable: best keyword hit
  return ids.slice(0, 3);
}

// ---------- answer prompt ----------
export function entryContext(e) {
  return `[${e.id}] ${e.title}\nFACTS:\n- ${e.facts.join('\n- ')}\nNEXT STEPS:\n- ${e.steps.join('\n- ')}\nLAW CITED: ${e.sections.join('; ') || 'none'}\nHELPLINES: ${e.helplines.join(', ') || 'none'}`;
}
export function answerPrompt(entries, query, lang) {
  const sys = `You are NyayaSaathi, a careful legal-INFORMATION assistant for ordinary people in India. You answer ONLY from the knowledge-base entries given below, which were checked against official government sources.
Rules:
- Write the whole answer in ${LANG_NAME[lang]}. Keep Act names and section references recognisable (e.g. "RTI Act s.6", "BNSS s.173").
- Use only facts, numbers, section numbers, fees, time limits and helpline numbers that appear in the entries. Never add any other law, section, number, website or helpline.
- Do not draw conclusions the entries do not state. If the entries do not answer the exact point asked (for example a deposit refund, a punishment, a deadline), say clearly that the checked information does not cover that point, share only what the entries do say that is relevant, and suggest free legal aid.
- Write every number with ASCII digits (0-9), exactly as in the entries.
- Simple words, short sentences, warm tone. No legal jargon without explaining it.
- Do not add examples, offices, departments, organisations, websites or procedures that are not named in the entries – not even as "e.g.".
- Never mention the knowledge base, entries or their ids (like [rti_apply] or "cyber fraud entry"); cite the Act and section, or the official helpline/portal, instead.
- Format: 1) one or two short paragraphs explaining the person's rights, citing the Act/section from the entries in brackets; 2) the heading "${{ en: 'Next steps', hi: 'आगे क्या करें', mr: 'पुढील पावले' }[lang]}", then a numbered list of 3-5 steps taken from the entries.
- Do not add a "free help" line or a disclaimer – the app shows both. Do not predict who will win.
- Plain text only, no markdown symbols like ** or #.
Knowledge-base entries:
${entries.map(entryContext).join('\n\n')}`;
  return [{ role: 'system', content: sys }, { role: 'user', content: String(query).slice(0, 800) }];
}

// ---------- the guard: no section number / helpline / number / site that is not in the KB ----------
function numbersIn(s) {
  const t = asciiDigits(s).replace(/(\d),(?=\d{2,3}\b)/g, '$1'); // 3,00,000 -> 300000 (Indian digit grouping)
  return (t.match(/\d+/g) || []);
}
export function allowedNumbers(entries, extra = []) {
  const set = new Set(extra);
  for (const e of entries) {
    for (const piece of [e.title, ...e.facts, ...e.steps, ...e.sections, ...e.helplines])
      for (const n of numbersIn(piece)) set.add(n.replace(/^0+(?=\d)/, ''));
  }
  return set;
}
const SECTION_RE = /(?:\bsections?\b|\bsec\.?|\bs\.|\bu\/s\b|धारा|धारा-|कलम|सेक्शन|नियम|\brule\b)\s*(\d+[a-z]?)/gi;
export function sectionNumbersIn(s) { const out = []; let m; const t = asciiDigits(s); SECTION_RE.lastIndex = 0; while ((m = SECTION_RE.exec(t))) out.push(m[1].toLowerCase()); return out; }
export function allowedSections(entries) {
  const set = new Set();
  for (const e of entries) for (const s of [...e.sections, ...e.facts, ...e.steps].map(String)) for (const n of sectionNumbersIn(s)) set.add(n);
  return set;
}
export function allowedDomains(kb) {
  const set = new Set();
  for (const e of kb.entries) for (const l of [...e.links, ...e.sources]) { try { set.add(new URL(l.url).hostname.replace(/^www\./, '')); } catch {} }
  return set;
}
const DOMAIN_RE = /\b((?:https?:\/\/)?(?:www\.)?([a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:in|com|org|net|gov|io|bot)))\b/gi;
export function guard(answer, entries, kb, opts = {}) {
  const problems = [];
  // numbers the person typed themselves (an amount, a date) may be repeated back; section numbers may not
  const nums = allowedNumbers(entries, [...(opts.extraNumbers || []), ...numbersIn(opts.query || '').map(n => n.replace(/^0+(?=\d)/, ''))]);
  const secs = allowedSections(entries);
  for (const s of sectionNumbersIn(answer)) if (!secs.has(s)) problems.push({ kind: 'section', value: s });
  for (const n of numbersIn(answer)) {
    if (n.length < 2) continue; // list numbering, "1 crore" etc.
    const v = n.replace(/^0+(?=\d)/, '');
    if (!nums.has(v)) problems.push({ kind: n.length >= 3 ? 'number_or_helpline' : 'number', value: n });
  }
  const doms = allowedDomains(kb); let m; DOMAIN_RE.lastIndex = 0;
  while ((m = DOMAIN_RE.exec(String(answer)))) { const h = m[2].toLowerCase().replace(/^www\./, ''); if (!doms.has(h)) problems.push({ kind: 'website', value: h }); }
  return { ok: problems.length === 0, problems };
}

// ---------- deterministic fallback answer (used when the guard fails or no model answers) ----------
export function fallbackAnswer(entries) {
  return entries.map(e => `${e.title}\n${e.facts.map(f => '• ' + f).join('\n')}\nNext steps:\n${e.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`).join('\n\n');
}
export function retryNote(problems) {
  return 'Your previous draft contained these items that are NOT in the knowledge-base entries: ' + problems.map(p => p.kind + ' ' + p.value).join(', ') + '. Rewrite the answer without them, using only numbers, sections and websites that appear in the entries.';
}
export function cleanModelText(s, ids = []) { let t = String(s || ''); for (const id of ids) t = t.split('(' + id + ')').join('').split('[' + id + ']').join('').split(id).join(''); return t.replace(/\*\*|__|^#+\s*/gm, '').replace(/\n{3,}/g, '\n\n').trim(); }

// ---------- free-help block (numbers come from the KB entries) ----------
export function freeHelp(kb) {
  const la = kb.entries.find(e => e.id === 'legal_aid'), tl = kb.entries.find(e => e.id === 'tele_law');
  return { helpline: '15100', legal_aid_link: la.links[0], tele_law_link: tl.links[0], nalsa: { label: 'NALSA', url: 'https://nalsa.gov.in/' } };
}
export function publicEntry(e) { return { id: e.id, title: e.title, sections: e.sections, helplines: e.helplines, links: e.links, sources: e.sources }; }
