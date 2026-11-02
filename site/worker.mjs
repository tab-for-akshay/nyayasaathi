// NyayaSaathi core logic — pure functions, no network. Shared by the Worker and the tests.
// Built by Tab, an AI assistant, for team lead Akshay Wagh.

const LANGS = ['en', 'hi', 'mr'];

// ---------- text helpers ----------
const DEV_DIGITS = { '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9' };
function asciiDigits(s) { return String(s || '').replace(/[०-९]/g, d => DEV_DIGITS[d]); }
function norm(s) { return ' ' + asciiDigits(s).toLowerCase().replace(/[“”"'’`]/g, '').replace(/\s+/g, ' ').trim() + ' '; }

// ---------- language ----------
const MR_MARKERS = new Set(['आहे', 'आहेत', 'नाही', 'नाहीत', 'मला', 'माझ्या', 'माझा', 'माझी', 'माझे', 'माझं', 'मी', 'काय', 'कसे', 'कशी', 'कसा', 'करू', 'केला', 'केली', 'झाले', 'झाला', 'झाली', 'तक्रार', 'पाहिजे', 'करावी', 'करायची', 'करायचे', 'मिळेल', 'देत', 'घेत', 'आम्ही', 'तुम्ही', 'कुठे', 'नवरा', 'पगार', 'भाडे', 'आणि', 'किंवा', 'आता', 'मालक']);
function detectLang(text) {
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
  'threatening me', 'threatens me', 'threatened me', 'beating me', 'beats me', 'beat me', 'hits me', 'hit me', 'slapped me', 'is hitting me', 'hitting me now', 'attacking me', 'being beaten', 'he is beating', 'raped', 'rape ', 'kidnapped', 'acid attack', 'locked me in',
  // Hinglish (Latin script)
  'aatmahatya', 'atmahatya', 'khudkushi', 'marna chahta', 'marna chahti', 'jaan de dunga', 'jaan de dungi', 'jaan se maar', 'maar dalega', 'maar dalenge', 'maar daalega', 'mujhe maar raha', 'dhamki', 'dhamaki', 'maar peet', 'maarpeet', 'marpeet', 'marta hai', 'maarta hai', 'peet-ta', 'peetta hai', 'peet raha', 'pit raha', 'balatkar', 'jeev denar',
  // Hindi
  'आत्महत्या', 'खुदकुशी', 'ख़ुदकुशी', 'मरना चाहता', 'मरना चाहती', 'जान दे दूंगा', 'जान दे दूंगी', 'जान दे दूँगा', 'जान दे दूँगी', 'जान से मार', 'मार डालेगा', 'मार डालेंगे', 'मार डालूंगा', 'मुझे मार रहा', 'मुझे मार रहे', 'पीट रहा', 'पीट रहे', 'मारता है', 'पीटता है', 'मारते हैं', 'पीटते हैं', 'मारपीट', 'धमकी', 'धमका रहा', 'धमकाता', 'बलात्कार', 'जान को खतरा', 'जान को ख़तरा', 'अपहरण', 'तेजाब', 'तेज़ाब',
  // Marathi
  'जीव देणार', 'जीव द्यायचा', 'जीव देईन', 'मरायचं आहे', 'मरायचे आहे', 'मरून जावंसं', 'जीवे मारण्याची', 'जीवे मारेल', 'मारून टाकेल', 'मारून टाकीन', 'मला मारत आहे', 'मला मारतोय', 'मारहाण करत आहे', 'मारहाण', 'मारतो', 'मारते', 'धमकी देत', 'धमकावत', 'धमकी दिली', 'जीवाला धोका', 'अपहरण'
];
function isEmergency(text) {
  const t = norm(text);
  return EMERGENCY_TERMS.some(w => t.includes(w.toLowerCase()));
}
const EMERGENCY_MESSAGE = {
  en: 'If you or someone else is in danger right now, please call 112 (police, fire, ambulance – all India emergency number) immediately.\n• Women in distress: Women Helpline 181 (24 hours, toll-free).\n• If you are thinking of ending your life or are in deep distress: Tele-MANAS 14416 (free, confidential, 24x7).\nYou are not alone. Please call now and stay with someone you trust. When you are safe, free legal aid is available on 15100.',
  hi: 'अगर आप या कोई और अभी खतरे में है, तो तुरंत 112 पर कॉल करें (पुलिस, फायर, एम्बुलेंस – पूरे भारत का आपातकालीन नंबर)।\n• संकट में महिलाएँ: महिला हेल्पलाइन 181 (24 घंटे, निःशुल्क)।\n• अगर आप अपनी जान लेने के बारे में सोच रहे हैं या बहुत परेशान हैं: टेली-मानस 14416 (निःशुल्क, गोपनीय, 24x7)।\nआप अकेले नहीं हैं। अभी कॉल करें और किसी भरोसेमंद व्यक्ति के साथ रहें। सुरक्षित होने पर मुफ्त कानूनी सहायता 15100 पर उपलब्ध है।',
  mr: 'तुम्ही किंवा दुसरे कोणी आत्ता धोक्यात असल्यास, लगेच 112 वर कॉल करा (पोलीस, अग्निशमन, रुग्णवाहिका – संपूर्ण भारताचा आपत्कालीन क्रमांक).\n• संकटात असलेल्या महिला: महिला हेल्पलाइन 181 (24 तास, मोफत).\n• तुम्ही जीव देण्याचा विचार करत असाल किंवा खूप त्रासात असाल: टेली-मानस 14416 (मोफत, गोपनीय, 24x7).\nतुम्ही एकटे नाही. आत्ता कॉल करा आणि विश्वासू व्यक्तीसोबत राहा. सुरक्षित झाल्यावर मोफत कायदेशीर मदत 15100 वर मिळते.'
};
const EMERGENCY_NUMBERS = ['112', '181', '14416', '15100'];

// ---------- UI / fixed strings ----------
const STR = {
  disclaimer: {
    en: 'This is legal information, not legal advice. NyayaSaathi is not a lawyer and cannot file a case or represent you; for advice on your case, talk to a lawyer – free legal aid is available. "Checked" dates show when the official source was last verified, not a live check.',
    hi: 'यह कानूनी जानकारी है, कानूनी सलाह नहीं। न्याय साथी वकील नहीं है और आपका केस दायर या आपकी पैरवी नहीं कर सकता; अपने मामले में सलाह के लिए वकील से बात करें – मुफ्त कानूनी सहायता उपलब्ध है। "जाँचा गया" तारीख बताती है कि सरकारी स्रोत आख़िरी बार कब जाँचा गया।',
    mr: 'ही कायदेशीर माहिती आहे, कायदेशीर सल्ला नाही. न्याय साथी वकील नाही आणि तुमचा खटला दाखल करू शकत नाही किंवा तुमची बाजू मांडू शकत नाही; तुमच्या प्रकरणासाठी वकिलाशी बोला – मोफत कायदेशीर मदत उपलब्ध आहे. "तपासले" तारीख सरकारी स्रोत शेवटचा कधी तपासला ते सांगते.'
  },
  nomatch: {
    en: 'I only answer from laws and official pages I have checked, and this question is not one of them yet – so I will not guess. Please contact free legal aid: call the NALSA helpline 15100 or go to the District Legal Services Authority (DLSA) of your district. You can also get advice by video through Tele-Law at a Common Service Centre.',
    hi: 'मैं सिर्फ़ उन्हीं कानूनों और सरकारी पेजों से जवाब देता हूँ जिन्हें मैंने जाँचा है, और यह सवाल अभी उनमें नहीं है – इसलिए मैं अनुमान नहीं लगाऊँगा। कृपया मुफ्त कानूनी सहायता लें: NALSA हेल्पलाइन 15100 पर कॉल करें या अपने जिले के जिला विधिक सेवा प्राधिकरण (DLSA) से संपर्क करें। आप कॉमन सर्विस सेंटर पर टेली-लॉ से वीडियो पर सलाह भी ले सकते हैं।',
    mr: 'मी फक्त तपासलेल्या कायद्यांवरून आणि सरकारी पानांवरून उत्तर देतो, आणि हा प्रश्न अजून त्यात नाही – म्हणून मी अंदाज लावणार नाही. कृपया मोफत कायदेशीर मदत घ्या: NALSA हेल्पलाइन 15100 वर कॉल करा किंवा तुमच्या जिल्ह्याच्या जिल्हा विधी सेवा प्राधिकरणाशी (DLSA) संपर्क करा. कॉमन सर्व्हिस सेंटरवर टेली-लॉद्वारे व्हिडिओवर सल्लाही मिळू शकतो.'
  },
  fallbackNote: {
    en: 'Showing the checked facts directly from the knowledge base.',
    hi: 'जाँचे गए तथ्य सीधे ज्ञानकोश से दिखाए जा रहे हैं (अंग्रेज़ी में)।',
    mr: 'तपासलेली माहिती थेट माहितीसंग्रहातून दाखवत आहोत (इंग्रजीत).'
  }
};
const LANG_NAME = { en: 'English', hi: 'Hindi (हिंदी, Devanagari script)', mr: 'Marathi (मराठी, Devanagari script)' };

// ---------- retrieval ----------
function keywordRetrieve(kb, query, k = 3) {
  const t = norm(query);
  const scored = kb.entries.map(e => {
    let s = 0;
    for (const w of e.kw) { const ww = w.toLowerCase(); if (ww.length < 3 ? t.includes(' ' + ww + ' ') : t.includes(ww)) s += ww.length >= 6 ? 2 : 1; }
    return { id: e.id, score: s };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}
function routerPrompt(kb, query) {
  const list = kb.entries.map(e => `${e.id}: ${e.title}`).join('\n');
  return [
    { role: 'system', content: 'You route questions from ordinary people in India to entries of a small legal-information knowledge base. Reply with JSON only: {"ids": [up to 3 entry ids from the list, most relevant first]}. Use [] when no entry is clearly relevant. Never invent ids.\nEntries:\n' + list },
    { role: 'user', content: String(query).slice(0, 800) }
  ];
}
function parseRouter(kb, raw) {
  const valid = new Set(kb.entries.map(e => e.id));
  try {
    const m = String(raw || '').match(/\{[\s\S]*\}/); if (!m) return null;
    const j = JSON.parse(m[0]); if (!Array.isArray(j.ids)) return null;
    return [...new Set(j.ids.filter(x => valid.has(x)))].slice(0, 3);
  } catch { return null; }
}
function combineIds(routerIds, kwHits, kb) {
  const ids = [];
  for (const id of routerIds || []) if (!ids.includes(id)) ids.push(id);
  for (const h of kwHits || []) if (h.score >= 2 && !ids.includes(h.id)) ids.push(h.id);
  if (routerIds === null && kwHits && kwHits.length && !ids.length) ids.push(kwHits[0].id); // model unavailable: best keyword hit
  // pull in linked entries (e.g. FIR refused -> Zero FIR, RTI -> RTI appeal) so the answer covers the whole escalation ladder
  if (kb && ids.length) for (const id of [...ids]) { const e = kb.entries.find(x => x.id === id); for (const r of (e && e.related) || []) if (ids.length < 3 && !ids.includes(r)) ids.push(r); }
  return ids.slice(0, 3);
}

// ---------- answer prompt ----------
function entryContext(e) {
  return `[${e.id}] ${e.title}\nFACTS:\n- ${e.facts.join('\n- ')}\nNEXT STEPS:\n- ${e.steps.join('\n- ')}\nLAW CITED: ${e.sections.join('; ') || 'none'}\nHELPLINES: ${e.helplines.join(', ') || 'none'}`;
}
function answerPrompt(entries, query, lang) {
  const sys = `You are NyayaSaathi, a careful legal-INFORMATION assistant for ordinary people in India. You answer ONLY from the knowledge-base entries given below, which were checked against official government sources.
Rules:
- Write the whole answer in ${LANG_NAME[lang]}, including headings. ${lang === 'hi' ? 'Write the word for section as "धारा" (e.g. "BNSS धारा 173").' : lang === 'mr' ? 'Write the word for section as "कलम" (e.g. "BNSS कलम 173").' : 'Cite sections like "RTI Act s.6", "BNSS s.173".'}
- If the person cites an old law (CrPC/IPC), use only what the entries say about the new law; do not state old-to-new section equivalents unless an entry states them.
- Use only facts, numbers, section numbers, fees, time limits and helpline numbers that appear in the entries. Never add any other law, section, number, website or helpline.
- Do not draw conclusions the entries do not state. If the entries do not answer the exact point asked (for example a deposit refund, a punishment, a deadline), say clearly that the checked information does not cover that point, share only what the entries do say that is relevant, and suggest free legal aid.
- Write every number with ASCII digits (0-9), exactly as in the entries.
- Simple words, short sentences, warm tone. No legal jargon without explaining it.
- Do not add examples, offices, departments, organisations, websites or procedures that are not named in the entries – not even as "e.g.".
- Never mention the knowledge base, entries or their ids (like [rti_apply] or "cyber fraud entry"); cite the Act and section, or the official helpline/portal, instead.
- Include every time limit, fee and escalation step (e.g. appeals) from the entries that applies to the person's next steps.
- Format: 1) FIRST LINE: the single most important action or right, in one plain sentence (e.g. what to do today, with the fee or deadline). 2) At most 120 words explaining the person's rights, each claim followed by its Act/section in brackets. 3) the heading "${{ en: 'Next steps', hi: 'आगे क्या करें', mr: 'पुढील पावले' }[lang]}", then a numbered list of 3-5 steps taken from the entries.
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
function allowedNumbers(entries, extra = []) {
  const set = new Set(extra);
  for (const e of entries) {
    for (const piece of [e.title, ...e.facts, ...e.steps, ...e.sections, ...e.helplines])
      for (const n of numbersIn(piece)) set.add(n.replace(/^0+(?=\d)/, ''));
  }
  return set;
}
const SECTION_RE = /(?:\bsections?\b|\bsec\.?|\bs\.|\bu\/s\b|धारा|धारा-|कलम|सेक्शन|(?<![\u0900-\u097F])नियम|\brule\b)\s*(\d+[a-z]?)/gi; // "अधिनियम" (Act) is not "नियम" (rule)
function sectionNumbersIn(s) { const out = []; let m; const t = asciiDigits(s); SECTION_RE.lastIndex = 0; while ((m = SECTION_RE.exec(t))) out.push(m[1].toLowerCase()); return out; }
function allowedSections(entries) {
  const set = new Set();
  for (const e of entries) for (const s of [...e.sections, ...e.facts, ...e.steps].map(String)) for (const n of sectionNumbersIn(s)) set.add(n);
  return set;
}
function allowedDomains(kb) {
  const set = new Set();
  for (const e of kb.entries) for (const l of [...e.links, ...e.sources]) { try { set.add(new URL(l.url).hostname.replace(/^www\./, '')); } catch {} }
  return set;
}
const DOMAIN_RE = /\b((?:https?:\/\/)?(?:www\.)?([a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:in|com|org|net|gov|io|bot)))\b/gi;
function guard(answer, entries, kb, opts = {}) {
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
function fallbackAnswer(entries) {
  return entries.map(e => `${e.title}\n${e.facts.map(f => '• ' + f).join('\n')}\nNext steps:\n${e.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`).join('\n\n');
}
function retryNote(problems) {
  return 'Your previous draft contained these items that are NOT in the knowledge-base entries: ' + problems.map(p => p.kind + ' ' + p.value).join(', ') + '. Rewrite the answer without them, using only numbers, sections and websites that appear in the entries.';
}
function cleanModelText(s, ids = []) { let t = String(s || '').replace(/[\u2010-\u2015\u2212]/g, '-').replace(/[\u00a0\u202f\u2007]/g, ' '); for (const id of ids) t = t.split('(' + id + ')').join('').split('[' + id + ']').join('').split(id).join(''); return t.replace(/\*\*|__|^#+\s*/gm, '').replace(/\n{3,}/g, '\n\n').trim(); }

// ---------- free-help block (numbers come from the KB entries) ----------
function freeHelp(kb) {
  const la = kb.entries.find(e => e.id === 'legal_aid'), tl = kb.entries.find(e => e.id === 'tele_law');
  return { helpline: '15100', legal_aid_link: la.links[0], tele_law_link: tl.links[0], nalsa: { label: 'NALSA', url: 'https://nalsa.gov.in/' } };
}
function publicEntry(e, withFacts = false) { const p = { id: e.id, title: e.title, sections: e.sections, helplines: e.helplines, links: e.links, sources: e.sources }; if (withFacts) p.facts = e.facts; return p; }

const KB = {
 "name": "NyayaSaathi knowledge base",
 "checked_on": "2026-11-01",
 "note": "Every fact, section number, fee, helpline and URL below was checked against the official page listed in sources on the date shown. Built by Tab, an AI assistant, for team lead Akshay Wagh.",
 "entries": [
  {
   "id": "rti_apply",
   "title": "Filing an RTI application",
   "kw": [
    "rti",
    "right to information",
    "information",
    "sarkari jankari",
    "soochna",
    "suchna",
    "माहिती",
    "सूचना",
    "जानकारी",
    "माहितीचा अधिकार",
    "सूचना का अधिकार",
    "government office",
    "file status",
    "application status",
    "public authority"
   ],
   "facts": [
    "Any citizen can ask a government office (public authority) for information by writing to its Public Information Officer (PIO), on paper or electronically, in English, Hindi or the official language of the area (RTI Act s.6(1)).",
    "You do not have to give any reason for asking, or personal details other than what is needed to contact you (s.6(2)).",
    "The PIO must reply within 30 days; if the information concerns the life or liberty of a person, within 48 hours (s.7(1)).",
    "For Central Government offices the application fee is Rs 10 (RTI Rules, 2012, rule 3). Applicants below the poverty line pay no application fee and no fee for the information (copies) if they attach a copy of their BPL certificate (rule 5). State offices follow their own State RTI rules for fees.",
    "Central Ministries/Departments and other Central public authorities listed on the portal can be asked online at rtionline.gov.in.",
    "For Central offices the fee can be paid in cash against a proper receipt, by demand draft, banker's cheque or Indian Postal Order (payable to the Accounts Officer), or electronically where the office accepts it (RTI Rules, 2012, rule 6). A personal cheque is not one of the listed modes."
   ],
   "steps": [
    "Write a short, specific question (what document, which period).",
    "Address it to the PIO of the right office, or file online at rtionline.gov.in for Central offices.",
    "Pay the fee (Rs 10 for Central offices) or attach the BPL certificate.",
    "Keep the receipt/registration number and count 30 days.",
    "If there is no reply in 30 days, file a first appeal (see \"RTI appeals\")."
   ],
   "sections": [
    "RTI Act s.6",
    "RTI Act s.7",
    "RTI Rules 2012 rule 3",
    "RTI Rules 2012 rule 5",
    "RTI Rules 2012 rule 6"
   ],
   "helplines": [],
   "links": [
    {
     "label": "RTI Online portal (Central)",
     "url": "https://rtionline.gov.in/"
    },
    {
     "label": "RTI Act, 2005 – India Code",
     "url": "https://indiacode.gov.in/act/37520cf3-5c3f-4c0b-aa4a-5985e6f522bf/details"
    },
    {
     "label": "Section text on India Code (s.6)",
     "url": "https://indiacode.gov.in/items/822280bc-89b4-4a39-aa10-72163b7c22f6"
    }
   ],
   "sources": [
    {
     "url": "https://indiacode.gov.in/items/822280bc-89b4-4a39-aa10-72163b7c22f6",
     "checked": "2026-11-01",
     "what": "s.6 text"
    },
    {
     "url": "https://indiacode.gov.in/items/e4c8f428-480d-4b0d-bd6a-e0e3eac110fa",
     "checked": "2026-11-01",
     "what": "s.7 text: 30 days, 48 hours"
    },
    {
     "url": "https://www.pmindia.gov.in/wp-content/uploads/2017/04/RTIRules_2012_English_0.pdf",
     "checked": "2026-11-01",
     "what": "RTI Rules 2012 rule 3 (fee of rupees ten), rule 5 (BPL exemption)"
    },
    {
     "url": "https://rtionline.gov.in/faq.php",
     "checked": "2026-11-01",
     "what": "portal covers Central Ministries/Departments and Central public authorities"
    },
    {
     "url": "https://www.pmindia.gov.in/wp-content/uploads/2017/04/RTIRules_2012_English_0.pdf",
     "checked": "2026-11-01",
     "what": "rule 6 modes of payment; rule 5 exempts BPL from rule 3 and rule 4 fees"
    }
   ],
   "related": [
    "rti_appeal"
   ]
  },
  {
   "id": "rti_appeal",
   "title": "RTI: no reply or unhappy with the reply (appeals)",
   "kw": [
    "rti appeal",
    "first appeal",
    "second appeal",
    "no reply",
    "information commission",
    "cic",
    "pio not replied",
    "deemed refusal",
    "अपील",
    "अपील कैसे",
    "प्रथम अपील",
    "उत्तर नहीं",
    "उत्तर नाही",
    "अपिल",
    "माहिती आयोग"
   ],
   "facts": [
    "If the PIO does not decide within the time limit, the request is treated as refused (RTI Act s.7(2)).",
    "You can file a first appeal to the officer senior in rank to the PIO in the same office within 30 days of the deadline expiring or of receiving the decision (s.19(1)).",
    "A second appeal lies to the Central Information Commission or the State Information Commission within 90 days from when the first-appeal decision should have been made or was received (s.19(3)).",
    "Late appeals can be admitted if you show sufficient cause for the delay (s.19(1) and s.19(3) provisos)."
   ],
   "steps": [
    "Wait 30 days from filing (or until you get an unsatisfactory reply).",
    "File the first appeal with the First Appellate Authority of the same office (online at rtionline.gov.in for Central offices).",
    "If still unhappy, file a second appeal to the Information Commission within 90 days."
   ],
   "sections": [
    "RTI Act s.7",
    "RTI Act s.19"
   ],
   "helplines": [],
   "links": [
    {
     "label": "RTI Online portal (Central)",
     "url": "https://rtionline.gov.in/"
    },
    {
     "label": "RTI Act, 2005 – India Code",
     "url": "https://indiacode.gov.in/act/37520cf3-5c3f-4c0b-aa4a-5985e6f522bf/details"
    },
    {
     "label": "Section text on India Code (s.19)",
     "url": "https://indiacode.gov.in/items/d4740d94-1ae3-4bb5-b8a8-90f86610e1b7"
    }
   ],
   "sources": [
    {
     "url": "https://indiacode.gov.in/items/d4740d94-1ae3-4bb5-b8a8-90f86610e1b7",
     "checked": "2026-11-01",
     "what": "s.19 text: 30 days first appeal, 90 days second appeal"
    },
    {
     "url": "https://indiacode.gov.in/items/e4c8f428-480d-4b0d-bd6a-e0e3eac110fa",
     "checked": "2026-11-01",
     "what": "s.7(2) deemed refusal"
    },
    {
     "url": "https://rtionline.gov.in/faq.php",
     "checked": "2026-11-01",
     "what": "first appeal only after 30 days if no reply"
    }
   ],
   "related": [
    "rti_apply"
   ]
  },
  {
   "id": "fir_zero",
   "title": "Registering an FIR (including Zero FIR and e-FIR)",
   "kw": [
    "fir",
    "police complaint",
    "zero fir",
    "e-fir",
    "efir",
    "report crime",
    "theft",
    "chori",
    "चोरी",
    "एफआईआर",
    "एफ.आय.आर",
    "पोलीस तक्रार",
    "पुलिस शिकायत",
    "पोलिस",
    "पुलिस",
    "police station",
    "cognizable",
    "gunha",
    "गुन्हा",
    "अपराध",
    "crpc 154",
    "154 crpc",
    "section 154",
    "s.154",
    "धारा 154",
    "कलम 154",
    "crpc"
   ],
   "facts": [
    "Information about a cognizable offence can be given to the officer in charge of ANY police station, irrespective of the area where the offence happened – this is what people call a \"Zero FIR\" (BNSS 2023 s.173(1)).",
    "It can be given orally (it must be written down and read back to you, and you sign it) or by electronic communication; an e-FIR must be signed by you within three days to be taken on record (s.173(1)).",
    "You must be given a copy of the FIR immediately and free of cost (s.173(2)).",
    "If a woman reports certain sexual offences, the information must be recorded by a woman police officer or woman officer (s.173(1), first proviso).",
    "The Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) repealed and replaced the Code of Criminal Procedure, 1973 (BNSS s.531); it is in force from 1 July 2024."
   ],
   "steps": [
    "Go to the nearest police station (any station) or use your State police e-FIR service where available.",
    "Tell what happened, when and where; ask that it be written down and read back.",
    "Sign it and take your free copy of the FIR.",
    "If police refuse, see \"police refused to register my FIR\"."
   ],
   "sections": [
    "BNSS s.173",
    "BNSS s.531"
   ],
   "helplines": [
    "112"
   ],
   "links": [
    {
     "label": "Bharatiya Nagarik Suraksha Sanhita, 2023 – India Code",
     "url": "https://indiacode.gov.in/act/72592ac7-d084-4545-95d3-0c98dc49fac3/details"
    },
    {
     "label": "Section text on India Code (s.173)",
     "url": "https://indiacode.gov.in/items/a0db5735-c3e7-486a-af8c-79e655b828e4"
    }
   ],
   "sources": [
    {
     "url": "https://indiacode.gov.in/items/a0db5735-c3e7-486a-af8c-79e655b828e4",
     "checked": "2026-11-01",
     "what": "s.173(1)-(2) text"
    },
    {
     "url": "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2297624",
     "checked": "2026-11-01",
     "what": "PIB 11 Aug 2026: e-FIR must be signed within three days"
    },
    {
     "url": "https://www.india.gov.in/directory/helpline",
     "checked": "2026-11-01",
     "what": "112 integrated emergency helpline"
    },
    {
     "url": "https://indiacode.gov.in/server/api/core/bitstreams/9de088be-2a40-479b-ade1-058d0d1677b3/content",
     "checked": "2026-11-01",
     "what": "BNSS s.531 repeal of CrPC 1973; India Code record: enforcement date 01-07-2024"
    }
   ],
   "related": [
    "fir_refused"
   ]
  },
  {
   "id": "fir_refused",
   "title": "Police refused to register my FIR",
   "kw": [
    "police refused",
    "refuse fir",
    "not registering",
    "fir not registered",
    "superintendent of police",
    "sp",
    "magistrate complaint",
    "fir nahi",
    "एफआईआर नहीं",
    "तक्रार घेत नाहीत",
    "नकार",
    "पुलिस ने मना",
    "पोलिसांनी नकार",
    "154(3)",
    "156(3)",
    "crpc 156",
    "156 crpc",
    "section 156",
    "refused to file"
   ],
   "facts": [
    "If the officer in charge refuses to record your information, you can send the substance of it in writing, by post, to the Superintendent of Police (SP) concerned (BNSS s.173(4)).",
    "If the SP is satisfied that it discloses a cognizable offence, the SP must investigate or direct an investigation; failing that, you can apply to the Magistrate (s.173(4)).",
    "A Magistrate empowered under BNSS s.210 can order an investigation on your application supported by an affidavit (BNSS s.175(3); the affidavit is the one referred to in s.173(4)).",
    "You can report at any police station, whatever the area where the offence happened, and the informant or victim gets a copy of the FIR at once, free of cost (BNSS s.173(1), s.173(2)).",
    "For some offences punishable with three years or more but less than seven years, the officer in charge may, with permission from an officer not below Deputy Superintendent of Police, first hold a preliminary enquiry, to be finished within fourteen days, to see whether there is a prima facie case (BNSS s.173(3))."
   ],
   "steps": [
    "Write down what happened and that the police station refused to record it (date, time, officer if known).",
    "Send it by post to the Superintendent of Police of the district; keep the postal receipt.",
    "If nothing happens, apply to the Magistrate with an affidavit (BNSS s.175(3)) – free legal aid (DLSA, 15100) can help you draft this."
   ],
   "sections": [
    "BNSS s.173",
    "BNSS s.175"
   ],
   "helplines": [
    "15100"
   ],
   "links": [
    {
     "label": "Bharatiya Nagarik Suraksha Sanhita, 2023 – India Code",
     "url": "https://indiacode.gov.in/act/72592ac7-d084-4545-95d3-0c98dc49fac3/details"
    },
    {
     "label": "Section text on India Code (s.173)",
     "url": "https://indiacode.gov.in/items/a0db5735-c3e7-486a-af8c-79e655b828e4"
    }
   ],
   "sources": [
    {
     "url": "https://indiacode.gov.in/items/a0db5735-c3e7-486a-af8c-79e655b828e4",
     "checked": "2026-11-01",
     "what": "s.173(4) text"
    },
    {
     "url": "https://indiacode.gov.in/server/api/core/bitstreams/9de088be-2a40-479b-ade1-058d0d1677b3/content",
     "checked": "2026-11-01",
     "what": "full BNSS text, s.175(3): Magistrate may order investigation on application with affidavit under s.173(4)"
    }
   ],
   "related": [
    "fir_zero"
   ]
  },
  {
   "id": "arrest_rights",
   "title": "Rights when someone is arrested",
   "kw": [
    "arrest",
    "arrested",
    "custody",
    "detained",
    "bail",
    "police took",
    "giraftar",
    "गिरफ्तार",
    "गिरफ्तारी",
    "अटक",
    "जामीन",
    "ज़मानत",
    "जमानत",
    "हिरासत",
    "कोठडी",
    "lockup",
    "crpc 50",
    "section 41",
    "41a",
    "crpc 57",
    "section 57"
   ],
   "facts": [
    "A person arrested without warrant must be told at once the full particulars of the offence or other grounds for the arrest; if the offence is bailable, the police must tell them they can be released on bail and arrange sureties (BNSS s.47).",
    "The police must immediately inform a relative, friend or other person nominated by the arrested person about the arrest and where they are held, and tell the arrested person about this right (s.48).",
    "Without a Magistrate's special order, a person arrested without warrant cannot be kept in police custody for more than 24 hours, excluding travel time to the Magistrate's court (s.58).",
    "A person in custody is entitled to free legal services (Legal Services Authorities Act s.12(g)).",
    "The Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) repealed and replaced the Code of Criminal Procedure, 1973 (BNSS s.531); it is in force from 1 July 2024."
   ],
   "steps": [
    "Ask the police for the grounds of arrest and whether the offence is bailable.",
    "Make sure a family member or friend has been informed and knows where the person is held.",
    "Contact the District Legal Services Authority or call 15100 for a free lawyer."
   ],
   "sections": [
    "BNSS s.47",
    "BNSS s.48",
    "BNSS s.58",
    "LSA Act s.12",
    "BNSS s.531"
   ],
   "helplines": [
    "15100"
   ],
   "links": [
    {
     "label": "Bharatiya Nagarik Suraksha Sanhita, 2023 – India Code",
     "url": "https://indiacode.gov.in/act/72592ac7-d084-4545-95d3-0c98dc49fac3/details"
    },
    {
     "label": "Section text on India Code (s.47)",
     "url": "https://indiacode.gov.in/items/84ad41ba-cba6-4022-a353-4194fefe89ba"
    }
   ],
   "sources": [
    {
     "url": "https://indiacode.gov.in/items/84ad41ba-cba6-4022-a353-4194fefe89ba",
     "checked": "2026-11-01",
     "what": "s.47 text"
    },
    {
     "url": "https://indiacode.gov.in/items/a448805d-931a-4bfe-91af-8023b591434a",
     "checked": "2026-11-01",
     "what": "s.48 text"
    },
    {
     "url": "https://indiacode.gov.in/server/api/core/bitstreams/9de088be-2a40-479b-ade1-058d0d1677b3/content",
     "checked": "2026-11-01",
     "what": "full BNSS text on India Code, s.58 (24 hours) – the section-level record for s.58 on India Code shows s.59 text, so the full-act text was used"
    },
    {
     "url": "https://indiacode.gov.in/items/9f7ec898-79db-48fb-8b37-36eb851b2b38",
     "checked": "2026-11-01",
     "what": "s.12(g) persons in custody"
    },
    {
     "url": "https://indiacode.gov.in/server/api/core/bitstreams/9de088be-2a40-479b-ade1-058d0d1677b3/content",
     "checked": "2026-11-01",
     "what": "BNSS s.531 repeal of CrPC 1973; India Code record: enforcement date 01-07-2024"
    }
   ],
   "related": [
    "legal_aid"
   ]
  },
  {
   "id": "legal_aid",
   "title": "Free legal aid: who is eligible and how to get it",
   "kw": [
    "free lawyer",
    "legal aid",
    "free legal",
    "lawyer",
    "vakil",
    "वकील",
    "मुफ्त वकील",
    "मोफत वकील",
    "कानूनी सहायता",
    "विधी सेवा",
    "dlsa",
    "nalsa",
    "legal services authority",
    "cannot afford",
    "paise nahi",
    "पैसे नहीं",
    "पैसे नाहीत",
    "15100",
    "legal help"
   ],
   "facts": [
    "You are entitled to free legal services to file or defend a case if you are: a member of a Scheduled Caste or Scheduled Tribe; a victim of trafficking or begar; a woman or a child; a person with disability; a victim of a mass disaster, ethnic violence, caste atrocity, flood, drought, earthquake or industrial disaster; an industrial workman; a person in custody; or below the income limit (Legal Services Authorities Act s.12).",
    "The Act's income figure can be raised by each State. NALSA lists the current income ceiling for Maharashtra as Rs 3,00,000 per year (and less than Rs 5 lakh for Supreme Court cases).",
    "NALSA states that a woman is entitled to free legal aid irrespective of her income.",
    "An affidavit about your income is usually enough to prove income eligibility (s.13(2)); the Authority must also be satisfied that you have a prima facie case (s.13(1)).",
    "Free legal aid is given through the District Legal Services Authority (DLSA) of your district and Taluk Legal Services Committees. NALSA's helpline number is 15100, and you can apply online on nalsa.gov.in (Legal Aid Application)."
   ],
   "steps": [
    "Call the NALSA helpline 15100, or go to the District Legal Services Authority (DLSA) of your district.",
    "Say which category you fall in (woman, SC/ST, worker, low income etc.).",
    "Bring any papers about your problem and, for income, an affidavit.",
    "A panel lawyer is assigned to you free of cost."
   ],
   "sections": [
    "LSA Act s.12",
    "LSA Act s.13"
   ],
   "helplines": [
    "15100"
   ],
   "links": [
    {
     "label": "NALSA – Legal Aid (eligibility, income limits)",
     "url": "https://nalsa.gov.in/legal-aid/"
    },
    {
     "label": "Legal Services Authorities Act, 1987 – India Code",
     "url": "https://indiacode.gov.in/act/253a0a32-48bd-447f-923b-a0eb49d108ee/details"
    },
    {
     "label": "Section text on India Code (s.12)",
     "url": "https://indiacode.gov.in/items/9f7ec898-79db-48fb-8b37-36eb851b2b38"
    }
   ],
   "sources": [
    {
     "url": "https://indiacode.gov.in/items/9f7ec898-79db-48fb-8b37-36eb851b2b38",
     "checked": "2026-11-01",
     "what": "s.12 categories"
    },
    {
     "url": "https://indiacode.gov.in/items/0fadebfd-70e3-4f20-9873-8874f9b21e00",
     "checked": "2026-11-01",
     "what": "s.13 affidavit"
    },
    {
     "url": "https://nalsa.gov.in/legal-aid/",
     "checked": "2026-11-01",
     "what": "State income ceilings (Maharashtra Rs 3,00,000), woman eligible irrespective of income, Rs 5 lakh Supreme Court"
    },
    {
     "url": "https://nalsa.gov.in/",
     "checked": "2026-11-01",
     "what": "NALSA Helpline Number 15100; Legal Aid Application e-service"
    }
   ],
   "related": []
  },
  {
   "id": "lok_adalat",
   "title": "Lok Adalat: settling a dispute by compromise",
   "kw": [
    "lok adalat",
    "compromise",
    "settlement",
    "settle case",
    "लोक अदालत",
    "समझौता",
    "तडजोड",
    "pending case",
    "court fee refund",
    "mediation",
    "national lok adalat",
    "traffic challan"
   ],
   "facts": [
    "Lok Adalats are organised by Legal Services Authorities to settle disputes by compromise (Legal Services Authorities Act s.19).",
    "A Lok Adalat award is treated as a decree of a civil court; where a pending case is settled, the court-fee already paid is refunded (s.21(1)).",
    "The award is final and binding on all parties, and no appeal lies against it (s.21(2)).",
    "NALSA's 2026 schedule lists four National Lok Adalats; the fourth is on 12 December 2026 (ask your DLSA or call 15100 for your district's date)."
   ],
   "steps": [
    "Ask the DLSA (or call 15100) about the next Lok Adalat.",
    "Request that your case or dispute be referred to it.",
    "Only agree to a settlement you are comfortable with – it cannot be appealed."
   ],
   "sections": [
    "LSA Act s.19",
    "LSA Act s.21"
   ],
   "helplines": [
    "15100"
   ],
   "links": [
    {
     "label": "Legal Services Authorities Act, 1987 – India Code",
     "url": "https://indiacode.gov.in/act/253a0a32-48bd-447f-923b-a0eb49d108ee/details"
    },
    {
     "label": "Section text on India Code (s.19)",
     "url": "https://indiacode.gov.in/items/3707012d-58ff-4c99-b3d7-d88879cc7170"
    }
   ],
   "sources": [
    {
     "url": "https://indiacode.gov.in/items/3707012d-58ff-4c99-b3d7-d88879cc7170",
     "checked": "2026-11-01",
     "what": "s.19 text"
    },
    {
     "url": "https://indiacode.gov.in/items/e5e50da5-ca26-4bdd-95d5-05fd83735b71",
     "checked": "2026-11-01",
     "what": "s.21 text"
    },
    {
     "url": "https://cdnbbsr.s3waas.gov.in/s3f8df2e15374e3dc37766e59ac494f0fd/uploads/2026/01/202601221103944766.pdf",
     "checked": "2026-11-01",
     "what": "NALSA 2026 schedule: four National Lok Adalats, fourth on 12 December 2026"
    }
   ],
   "related": [
    "permanent_lok_adalat",
    "prelitigation_mediation"
   ]
  },
  {
   "id": "permanent_lok_adalat",
   "title": "Permanent Lok Adalat (public utility services)",
   "kw": [
    "electricity bill",
    "power bill",
    "water bill",
    "bus",
    "railway",
    "airline",
    "courier",
    "post",
    "telephone",
    "mobile bill",
    "hospital bill",
    "insurance claim",
    "बिजली बिल",
    "बीमा",
    "विमा",
    "वीज बिल",
    "public utility"
   ],
   "facts": [
    "Under the Legal Services Authorities Act, 1987 (LSA Act), LSA Act s.22A(b): 'public utility service' means transport of passengers or goods by air, road or water; postal, telegraph or telephone service; supply of power, light or water to the public; public conservancy or sanitation; service in a hospital or dispensary; insurance service (plus any service a government notifies).",
    "LSA Act s.22C(1): any party may apply to the Permanent Lok Adalat BEFORE the dispute is brought before any court; it has no jurisdiction over an offence that is not compoundable under any law.",
    "LSA Act s.22C(2): after applying, no party may take the same dispute to any court.",
    "LSA Act s.22C(8): if the parties do not agree, the Permanent Lok Adalat itself decides the dispute (if it does not relate to any offence).",
    "LSA Act s.22E: its award is final and binding, is deemed a decree of a civil court, cannot be questioned in any original suit, application or execution proceeding, and can be sent to the civil court to execute.",
    "The jurisdiction of the Permanent Lok Adalats is upto Rs. One Crore. It is a compulsory pre-litigative mechanism for conciliation and settlement of public utility disputes."
   ],
   "steps": [
    "Write a short application to the Permanent Lok Adalat at your District Legal Services Authority (or call 15100 to find it).",
    "Attach the bill/policy/receipts.",
    "Attend the conciliation; if no settlement, it decides.",
    "Do not file the same dispute in a court after applying."
   ],
   "sections": [
    "LSA Act s.22A",
    "LSA Act s.22C",
    "LSA Act s.22E"
   ],
   "helplines": [
    "15100"
   ],
   "links": [
    {
     "label": "NALSA Permanent Lok Adalat page",
     "url": "https://nalsa.gov.in/permanent-lok-adalat/"
    },
    {
     "label": "Legal Services Authorities Act, 1987 – India Code",
     "url": "https://indiacode.gov.in/act/253a0a32-48bd-447f-923b-a0eb49d108ee/details"
    }
   ],
   "sources": [
    {
     "url": "https://cdnbbsr.s3waas.gov.in/s32e45f93088c7db59767efef516b306aa/uploads/2025/04/202504081796627129.pdf",
     "checked": "2026-11-01",
     "what": "LSA Act s.22A(b), s.22C(1),(2),(8), s.22E text"
    },
    {
     "url": "https://nalsa.gov.in/permanent-lok-adalat/",
     "checked": "2026-11-01",
     "what": "NALSA page: jurisdiction up to Rs. One Crore; compulsory pre-litigative mechanism"
    }
   ],
   "related": [
    "lok_adalat",
    "prelitigation_mediation"
   ]
  },
  {
   "id": "prelitigation_mediation",
   "title": "Pre-litigation mediation",
   "kw": [
    "mediation",
    "mediator",
    "settle before court",
    "pre-litigation",
    "out of court settlement",
    "मध्यस्थता",
    "मध्यस्थी",
    "family dispute settlement",
    "property dispute settlement",
    "neighbour dispute"
   ],
   "facts": [
    "Under the Mediation Act, 2023, Mediation Act 2023 s.5(1): before filing any civil or commercial suit or proceeding in any court, the parties may voluntarily and with mutual consent try to settle the dispute by pre-litigation mediation under this Act (commercial disputes of Specified Value follow s.12A of the Commercial Courts Act, 2015).",
    "Mediation Act 2023 s.18(1): mediation must be completed within 120 days from the date fixed for the first appearance before the mediator.",
    "Mediation Act 2023 s.18(2): the parties may agree to extend it by a further period of not more than 60 days."
   ],
   "steps": [
    "Both sides agree to try mediation.",
    "Approach the mediation centre of your District Legal Services Authority or court (call 15100 to locate it).",
    "Attend; it should finish in 120 days (+ up to 60 days if both agree).",
    "If it fails you can still go to court."
   ],
   "sections": [
    "Mediation Act 2023 s.5",
    "Mediation Act 2023 s.18"
   ],
   "helplines": [
    "15100"
   ],
   "links": [
    {
     "label": "Mediation Act, 2023 – Gazette PDF",
     "url": "https://egazette.gov.in/WriteReadData/2023/248775.pdf"
    }
   ],
   "sources": [
    {
     "url": "https://egazette.gov.in/WriteReadData/2023/248775.pdf",
     "checked": "2026-11-01",
     "what": "Mediation Act 2023 s.5(1), s.18(1)-(2) text"
    }
   ],
   "related": [
    "lok_adalat",
    "permanent_lok_adalat"
   ]
  },
  {
   "id": "tele_law",
   "title": "Tele-Law: legal advice by video from a Common Service Centre",
   "kw": [
    "tele-law",
    "tele law",
    "telelaw",
    "csc",
    "common service centre",
    "village",
    "gaon",
    "गाँव",
    "गाव",
    "advice by phone",
    "video call lawyer",
    "टेली-लॉ",
    "टेली लॉ",
    "सल्ला"
   ],
   "facts": [
    "Tele-Law is a Department of Justice programme that connects people with panel lawyers by video/tele-conferencing for legal advice, through Common Service Centres (CSCs), mainly at the gram panchayat level.",
    "A Government press release (PIB, Nov 2021) says the consultation is free for people entitled to free legal aid under Section 12 of the Legal Services Authorities Act, while others paid Rs 30 per consultation."
   ],
   "steps": [
    "Visit your nearest Common Service Centre (CSC) and ask for Tele-Law.",
    "The Village Level Entrepreneur registers you and books a consultation with a panel lawyer.",
    "Or register yourself on tele-law.in."
   ],
   "sections": [
    "LSA Act s.12"
   ],
   "helplines": [],
   "links": [
    {
     "label": "Tele-Law portal",
     "url": "https://www.tele-law.in/"
    }
   ],
   "sources": [
    {
     "url": "https://www.tele-law.in/",
     "checked": "2026-11-01",
     "what": "Tele-Law portal: panel lawyers, CSC centres, advice counts to 30 Sep 2026"
    },
    {
     "url": "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1771423",
     "checked": "2026-11-01",
     "what": "PIB Nov 2021: free for s.12 entitled, Rs 30 others; CSC-based video consultations"
    }
   ],
   "related": []
  },
  {
   "id": "consumer_complaint",
   "title": "Consumer complaint (defective product, bad service, refund)",
   "kw": [
    "consumer",
    "refund",
    "defective",
    "product",
    "service",
    "complaint against company",
    "online shopping",
    "warranty",
    "e-daakhil",
    "edaakhil",
    "e-jagriti",
    "consumer court",
    "उपभोक्ता",
    "ग्राहक",
    "रिफंड",
    "परतावा",
    "खराब",
    "consumer forum",
    "1915",
    "ग्राहक मंच",
    "ग्राहक आयोग"
   ],
   "facts": [
    "First, you can register a grievance with the National Consumer Helpline: toll-free 1915 (8 AM to 8 PM) or WhatsApp +91 8800001915, or online at consumerhelpline.gov.in.",
    "A consumer can file a complaint about goods or services with the District Consumer Commission (Consumer Protection Act 2019 s.35).",
    "Which commission hears your complaint depends on the value paid for the goods or services: up to Rs 50 lakh – District Commission; more than Rs 50 lakh and up to Rs 2 crore – State Commission; more than Rs 2 crore – National Commission (Consumer Protection (Jurisdiction of the District Commission, the State Commission and the National Commission) Rules, 2021, made under s.34). You can file where the opposite party resides or does business, or where you live or work (s.34(2)).",
    "A complaint must normally be filed within two years from when the cause of action arose; delay can be excused for sufficient cause (s.69).",
    "Complaints can be filed online on e-Jagriti (e-jagriti.gov.in), which has integrated the older e-Daakhil filing system."
   ],
   "steps": [
    "Collect the bill/invoice, warranty, screenshots and your messages with the seller.",
    "Try the National Consumer Helpline (1915) first.",
    "If not resolved, file a complaint with the District Consumer Commission online on e-Jagriti.",
    "File within two years."
   ],
   "sections": [
    "CPA s.34",
    "CPA s.35",
    "CPA s.69",
    "CPA Jurisdiction Rules 2021"
   ],
   "helplines": [
    "1915"
   ],
   "links": [
    {
     "label": "National Consumer Helpline",
     "url": "https://consumerhelpline.gov.in/"
    },
    {
     "label": "e-Jagriti (consumer commission filing)",
     "url": "https://e-jagriti.gov.in/"
    },
    {
     "label": "Consumer Protection Act, 2019 – India Code",
     "url": "https://indiacode.gov.in/act/1b6c1754-47b1-411e-9607-1712a9caf368/details"
    },
    {
     "label": "Section text on India Code (s.34)",
     "url": "https://indiacode.gov.in/items/c4a8f150-07c4-4c24-990e-214f83c1c68c"
    }
   ],
   "sources": [
    {
     "url": "https://indiacode.gov.in/items/c4a8f150-07c4-4c24-990e-214f83c1c68c",
     "checked": "2026-11-01",
     "what": "s.34 text"
    },
    {
     "url": "https://indiacode.gov.in/items/da5b95cd-d5e7-49b6-8c3a-b7a28266b13a",
     "checked": "2026-11-01",
     "what": "s.35 text"
    },
    {
     "url": "https://indiacode.gov.in/items/f2c38f98-2e6c-4d75-af6f-f35ecddefb25",
     "checked": "2026-11-01",
     "what": "s.69 two years"
    },
    {
     "url": "https://consumerhelpline.gov.in/",
     "checked": "2026-11-01",
     "what": "Toll Free 1915 (8AM to 8PM), WhatsApp +918800001915, link to e-Jagriti"
    },
    {
     "url": "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2190535",
     "checked": "2026-11-01",
     "what": "PIB: e-Jagriti integrates OCMS, e-Daakhil, NCDRC CMS and CONFONET"
    },
    {
     "url": "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1786342",
     "checked": "2026-11-01",
     "what": "PIB 30 Dec 2021: Jurisdiction Rules 2021 – District up to Rs 50 lakh, State Rs 50 lakh to Rs 2 crore, National above Rs 2 crore"
    }
   ],
   "related": []
  },
  {
   "id": "cyber_fraud",
   "title": "Online fraud and cybercrime reporting",
   "kw": [
    "cyber",
    "online fraud",
    "upi fraud",
    "scam",
    "otp fraud",
    "hacked",
    "money debited",
    "fraud call",
    "sextortion",
    "fake",
    "cybercrime",
    "1930",
    "सायबर",
    "साइबर",
    "धोखाधड़ी",
    "फसवणूक",
    "ऑनलाइन फ्रॉड",
    "पैसे कट गए",
    "पैसे गेले",
    "hack"
   ],
   "facts": [
    "The National Cyber Crime Helpline 1930 is toll-free and works 24x7 to help victims of cybercrime, especially financial fraud.",
    "All types of cybercrime can be reported on the National Cyber Crime Reporting Portal, https://cybercrime.gov.in, run under the Indian Cyber Crime Coordination Centre (I4C) of the Ministry of Home Affairs.",
    "For money lost to fraud, report as quickly as possible: the Government says over Rs 3431 crore has been saved in more than 9.94 lakh complaints through quick reporting."
   ],
   "steps": [
    "Call 1930 immediately if money was taken – speed matters.",
    "Report on cybercrime.gov.in and note the acknowledgement number.",
    "Tell your bank at once and keep screenshots, transaction IDs and phone numbers."
   ],
   "sections": [],
   "helplines": [
    "1930"
   ],
   "links": [
    {
     "label": "National Cyber Crime Reporting Portal",
     "url": "https://cybercrime.gov.in/"
    }
   ],
   "sources": [
    {
     "url": "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2085609",
     "checked": "2026-11-01",
     "what": "PIB: 1930 toll-free 24x7; cybercrime.gov.in; Rs 3431 crore saved in 9.94 lakh complaints"
    },
    {
     "url": "https://www.india.gov.in/directory/helpline",
     "checked": "2026-11-01",
     "what": "1930 - Cyber Crime Helpline"
    }
   ],
   "related": [
    "bank_complaint"
   ]
  },
  {
   "id": "domestic_violence",
   "title": "Domestic violence: protection, residence and money relief",
   "kw": [
    "domestic violence",
    "husband beats",
    "in-laws",
    "sasural",
    "ससुराल",
    "सासर",
    "dowry harassment",
    "घरेलू हिंसा",
    "कौटुंबिक हिंसाचार",
    "मारहाण",
    "पति मारता",
    "नवरा मारतो",
    "protection order",
    "thrown out of house",
    "shared household",
    "abuse at home",
    "protection officer",
    "498a",
    "498 a",
    "cruelty",
    "dahej",
    "दहेज",
    "हुंडा"
   ],
   "facts": [
    "Domestic violence includes physical, sexual, verbal and emotional, and economic abuse, including harassment for dowry (Protection of Women from Domestic Violence Act 2005 s.3).",
    "The woman, a Protection Officer, or any other person on her behalf can apply to the Magistrate for relief (s.12).",
    "The Magistrate can pass a protection order stopping the respondent from committing violence, entering her workplace, trying to contact her in any form, or selling or using shared assets and bank accounts (including her stridhan) without leave (s.18).",
    "A residence order can stop her being thrown out of the shared household, whether or not she owns it (s.19).",
    "The Magistrate can order monetary relief for expenses and losses, such as lost earnings and medical expenses (s.20).",
    "The Women Helpline 181 is toll-free and works 24 hours. Women are entitled to free legal aid.",
    "Cruelty by a husband or his relatives is also a crime: punishable with imprisonment of up to three years and a fine (Bharatiya Nyaya Sanhita 2023 s.85; \"cruelty\" is defined in s.86 and includes harassment for dowry). The BNS repealed the Indian Penal Code (BNS s.358). You can report it to the police."
   ],
   "steps": [
    "If you are in danger now, call 112.",
    "Call the Women Helpline 181 for support and referral.",
    "Contact the Protection Officer or a DLSA lawyer (15100) to file an application to the Magistrate under s.12."
   ],
   "sections": [
    "PWDVA s.3",
    "PWDVA s.12",
    "PWDVA s.18",
    "PWDVA s.19",
    "PWDVA s.20",
    "BNS s.85",
    "BNS s.86",
    "BNS s.358"
   ],
   "helplines": [
    "181",
    "112",
    "15100"
   ],
   "links": [
    {
     "label": "Domestic Violence Act, 2005 – India Code",
     "url": "https://indiacode.gov.in/act/4311e86f-7d98-40b6-8a80-2195278207cb/details"
    },
    {
     "label": "Women Helpline 181 – Ministry of WCD",
     "url": "https://wcd.gov.in/offerings/women--helpline--scheme"
    },
    {
     "label": "Section text on India Code (s.3)",
     "url": "https://indiacode.gov.in/items/c5b4f170-a132-4a40-ae56-506018e6ddaf"
    },
    {
     "label": "Bharatiya Nyaya Sanhita, 2023 s.85 – India Code",
     "url": "https://indiacode.gov.in/items/9790a4a7-0e3b-4063-bfed-017a3de6cb2b"
    }
   ],
   "sources": [
    {
     "url": "https://indiacode.gov.in/items/c5b4f170-a132-4a40-ae56-506018e6ddaf",
     "checked": "2026-11-01",
     "what": "s.3 definition"
    },
    {
     "url": "https://indiacode.gov.in/items/4869d8d8-3c9e-44e1-af08-bbe31448afbd",
     "checked": "2026-11-01",
     "what": "s.12"
    },
    {
     "url": "https://indiacode.gov.in/items/f4d8e413-b55c-4f77-8fc3-db5e3c25cc95",
     "checked": "2026-11-01",
     "what": "s.18"
    },
    {
     "url": "https://indiacode.gov.in/items/426e4bf8-cab6-4c4e-a170-f43d1f4833e2",
     "checked": "2026-11-01",
     "what": "s.19"
    },
    {
     "url": "https://indiacode.gov.in/items/74193c8f-d40a-4525-b64b-149246ec23d1",
     "checked": "2026-11-01",
     "what": "s.20"
    },
    {
     "url": "https://wcd.gov.in/offerings/women--helpline--scheme",
     "checked": "2026-11-01",
     "what": "Women Helpline 181, toll-free 24 hours"
    },
    {
     "url": "https://nalsa.gov.in/legal-aid/",
     "checked": "2026-11-01",
     "what": "woman entitled to free legal aid irrespective of income"
    },
    {
     "url": "https://wcd.gov.in/offerings/women--helpline--scheme",
     "checked": "2026-11-01",
     "what": "181"
    },
    {
     "url": "https://indiacode.gov.in/items/9790a4a7-0e3b-4063-bfed-017a3de6cb2b",
     "checked": "2026-11-01",
     "what": "BNS s.85 cruelty by husband/relative: up to 3 years and fine (text checked in full BNS PDF)"
    },
    {
     "url": "https://indiacode.gov.in/items/b364dd91-5b18-4bd4-87ce-e907b22a3f07",
     "checked": "2026-11-01",
     "what": "BNS s.86 cruelty defined (includes dowry harassment)"
    },
    {
     "url": "https://indiacode.gov.in/server/api/core/bitstreams/9a436cb9-d2e9-44fc-a0d4-9576650f970f/content",
     "checked": "2026-11-01",
     "what": "full BNS text: s.85, s.86, s.358 repeal of IPC"
    }
   ],
   "related": [
    "legal_aid"
   ]
  },
  {
   "id": "workplace_harassment",
   "title": "Sexual harassment at the workplace (POSH)",
   "kw": [
    "sexual harassment",
    "workplace harassment",
    "posh",
    "boss harassing",
    "office harassment",
    "internal committee",
    "icc",
    "local committee",
    "यौन उत्पीड़न",
    "लैंगिक छळ",
    "कार्यस्थल",
    "कामाच्या ठिकाणी",
    "office mein",
    "manager"
   ],
   "facts": [
    "Every employer must set up an Internal Committee to hear sexual harassment complaints (POSH Act 2013 s.4).",
    "Where an establishment has fewer than ten workers, or the complaint is against the employer, the District Officer's Local Committee hears it (s.6).",
    "A woman can make a written complaint to the Internal Committee (or the Local Committee) within three months of the incident, or of the last incident in a series; members must help her write it if she cannot (s.9)."
   ],
   "steps": [
    "Write down dates, what happened and any witnesses or messages.",
    "Complain in writing to your Internal Committee within three months.",
    "If there is no Internal Committee or the harasser is the employer, go to the Local Committee via the District Officer.",
    "You can also get a free lawyer through DLSA (15100)."
   ],
   "sections": [
    "POSH Act s.4",
    "POSH Act s.6",
    "POSH Act s.9"
   ],
   "helplines": [
    "15100",
    "181"
   ],
   "links": [
    {
     "label": "POSH Act, 2013 – India Code",
     "url": "https://indiacode.gov.in/act/a6ffa80b-6388-474f-ad11-3634b3a1e94a/details"
    },
    {
     "label": "Section text on India Code (s.4)",
     "url": "https://indiacode.gov.in/items/b9a522ed-6600-408e-aa9c-76d6a84dc86d"
    }
   ],
   "sources": [
    {
     "url": "https://indiacode.gov.in/items/b9a522ed-6600-408e-aa9c-76d6a84dc86d",
     "checked": "2026-11-01",
     "what": "s.4"
    },
    {
     "url": "https://indiacode.gov.in/items/49008b88-c849-4013-8b4e-634ede7f7a41",
     "checked": "2026-11-01",
     "what": "s.6"
    },
    {
     "url": "https://indiacode.gov.in/items/6967ac76-85a2-4909-aee7-397a6912b4b8",
     "checked": "2026-11-01",
     "what": "s.9: three months"
    }
   ],
   "related": []
  },
  {
   "id": "senior_maintenance",
   "title": "Senior citizens and parents: maintenance from children",
   "kw": [
    "senior citizen",
    "old parents",
    "maintenance parents",
    "children not caring",
    "son not giving money",
    "elder",
    "old age",
    "बुजुर्ग",
    "वृद्ध",
    "ज्येष्ठ नागरिक",
    "आई वडील",
    "माता पिता",
    "पोटगी",
    "भरण पोषण",
    "14567",
    "property gift to son"
   ],
   "facts": [
    "A senior citizen or parent who cannot maintain themselves from their own earnings or property can apply for maintenance against their adult children; a childless senior citizen can apply against a relative who has sufficient means and is in possession of, or would inherit, their property (Maintenance and Welfare of Parents and Senior Citizens Act 2007 s.4).",
    "The application is made to the Maintenance Tribunal by the senior citizen, or by a person or organisation they authorise; the Tribunal can also act on its own (s.5).",
    "The Tribunal can order a monthly allowance; the maximum is set by the State Government and cannot exceed Rs 10,000 per month (s.9).",
    "If a senior citizen gifted or transferred property on the condition of being looked after and the person fails to do so, the Tribunal can declare the transfer void at the senior citizen's option (s.23).",
    "Elderline 14567 is the national helpline number for senior citizens."
   ],
   "steps": [
    "Call Elderline 14567 for help and guidance.",
    "Apply to the Maintenance Tribunal for your area under s.5 (you, or a person/organisation you authorise).",
    "Ask the DLSA (15100) for a free lawyer if needed."
   ],
   "sections": [
    "MWPSC Act s.4",
    "MWPSC Act s.5",
    "MWPSC Act s.9",
    "MWPSC Act s.23"
   ],
   "helplines": [
    "14567",
    "15100"
   ],
   "links": [
    {
     "label": "Senior Citizens Act, 2007 – India Code",
     "url": "https://indiacode.gov.in/act/6cf2de2e-d2f6-4286-a5a2-97c89df01ceb/details"
    },
    {
     "label": "Section text on India Code (s.4)",
     "url": "https://indiacode.gov.in/items/40bf285c-5467-4b99-b572-046c2a5322c9"
    }
   ],
   "sources": [
    {
     "url": "https://indiacode.gov.in/items/40bf285c-5467-4b99-b572-046c2a5322c9",
     "checked": "2026-11-01",
     "what": "s.4"
    },
    {
     "url": "https://indiacode.gov.in/items/0f974ae6-b7c5-4c7f-8a59-99721608dd36",
     "checked": "2026-11-01",
     "what": "s.5"
    },
    {
     "url": "https://indiacode.gov.in/items/8bd73b8b-ac3b-4bf9-9844-3f8572a0cea7",
     "checked": "2026-11-01",
     "what": "s.9: max Rs 10,000/month"
    },
    {
     "url": "https://indiacode.gov.in/items/2efb17eb-dde1-4b2e-b058-fdb371bfbc95",
     "checked": "2026-11-01",
     "what": "s.23"
    },
    {
     "url": "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1759358",
     "checked": "2026-11-01",
     "what": "PIB: Elder Line, unique number 14567"
    }
   ],
   "related": []
  },
  {
   "id": "maintenance_family",
   "title": "Maintenance for wife, children or parents (BNSS s.144)",
   "kw": [
    "maintenance",
    "wife maintenance",
    "alimony",
    "husband not paying",
    "child support",
    "kharcha",
    "खर्चा",
    "गुजारा भत्ता",
    "भरण-पोषण",
    "पोटगी",
    "नवरा पैसे देत नाही",
    "पति खर्च नहीं देता",
    "separated",
    "crpc 125",
    "125 crpc",
    "section 125",
    "धारा 125",
    "कलम 125"
   ],
   "facts": [
    "If a person with sufficient means neglects or refuses to maintain his wife who cannot maintain herself, his child who cannot maintain itself, or his father or mother who cannot maintain themselves, a Magistrate of the first class can order a monthly allowance (BNSS 2023 s.144(1)).",
    "The Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) repealed and replaced the Code of Criminal Procedure, 1973 (BNSS s.531); it is in force from 1 July 2024."
   ],
   "steps": [
    "Collect proof of the relationship and of the other person's income if you can.",
    "File an application before the Magistrate – a free DLSA lawyer can do this for you (15100)."
   ],
   "sections": [
    "BNSS s.144",
    "BNSS s.531"
   ],
   "helplines": [
    "15100"
   ],
   "links": [
    {
     "label": "Bharatiya Nagarik Suraksha Sanhita, 2023 – India Code",
     "url": "https://indiacode.gov.in/act/72592ac7-d084-4545-95d3-0c98dc49fac3/details"
    },
    {
     "label": "Section text on India Code (s.144)",
     "url": "https://indiacode.gov.in/items/96c76add-8812-48dd-9798-7adc7f12c7ea"
    }
   ],
   "sources": [
    {
     "url": "https://indiacode.gov.in/items/96c76add-8812-48dd-9798-7adc7f12c7ea",
     "checked": "2026-11-01",
     "what": "s.144(1) text"
    },
    {
     "url": "https://indiacode.gov.in/server/api/core/bitstreams/9de088be-2a40-479b-ade1-058d0d1677b3/content",
     "checked": "2026-11-01",
     "what": "BNSS s.531 repeal of CrPC 1973; India Code record: enforcement date 01-07-2024"
    }
   ],
   "related": []
  },
  {
   "id": "wages_unpaid",
   "title": "Unpaid or late wages",
   "kw": [
    "salary not paid",
    "wages",
    "unpaid salary",
    "employer not paying",
    "pagar",
    "पगार",
    "वेतन",
    "मजदूरी",
    "तनख्वाह",
    "salary late",
    "minimum wage",
    "labour",
    "mazdoor",
    "मजदूर",
    "कामगार",
    "last salary after resign",
    "code on wages"
   ],
   "facts": [
    "The four Labour Codes, including the Code on Wages 2019, were made effective from 21 November 2025, replacing 29 older labour laws.",
    "Wages must be paid on time: daily workers at the end of the shift, weekly workers before the weekly holiday, fortnightly workers within two days after the fortnight, and monthly workers before the 7th of the next month; if you are removed, dismissed, retrenched or you resign, wages are due within two working days (Code on Wages s.17).",
    "You (or your registered trade union, or the Inspector-cum-Facilitator) can file a claim before the authority appointed under the Code within three years; it can order compensation of up to ten times the claim and should try to decide within three months (s.45)."
   ],
   "steps": [
    "Keep proof of work and pay (attendance, messages, bank entries, appointment letter).",
    "Ask the employer in writing for the dues.",
    "File a claim before the authority appointed under the Code on Wages for claims (s.45), within three years.",
    "Industrial workmen are eligible for free legal aid (15100)."
   ],
   "sections": [
    "Code on Wages s.17",
    "Code on Wages s.45",
    "LSA Act s.12"
   ],
   "helplines": [
    "15100"
   ],
   "links": [
    {
     "label": "Code on Wages, 2019 – India Code",
     "url": "https://indiacode.gov.in/act/20bf2ac3-5d54-4e1a-a06b-e4f19ad582bc/details"
    },
    {
     "label": "Section text on India Code (s.17)",
     "url": "https://indiacode.gov.in/items/b9485c36-2ab6-4c6f-9de0-37455777b6f0"
    }
   ],
   "sources": [
    {
     "url": "https://indiacode.gov.in/items/b9485c36-2ab6-4c6f-9de0-37455777b6f0",
     "checked": "2026-11-01",
     "what": "s.17 time limits"
    },
    {
     "url": "https://indiacode.gov.in/items/8e663893-07ab-4bcc-8958-e312e97bf59b",
     "checked": "2026-11-01",
     "what": "s.45: 3 years, 10x compensation, 3 months"
    },
    {
     "url": "https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2192463",
     "checked": "2026-11-01",
     "what": "PIB: four Labour Codes effective from 21st November 2025"
    }
   ],
   "related": []
  },
  {
   "id": "cheque_bounce",
   "title": "Cheque bounce",
   "kw": [
    "cheque bounce",
    "cheque dishonour",
    "bounced cheque",
    "check bounce",
    "insufficient funds",
    "चेक बाउंस",
    "धनादेश",
    "चेक अनादर",
    "138"
   ],
   "facts": [
    "If a cheque given to pay a debt or liability bounces for insufficient funds, the drawer commits an offence, punishable with up to two years' imprisonment, or a fine of up to twice the cheque amount, or both (Negotiable Instruments Act s.138).",
    "This applies only if: the cheque was presented within six months of its date or within its validity period, whichever is earlier; the payee sent a written demand notice within thirty days of learning it bounced; and the drawer did not pay within fifteen days of receiving that notice (s.138 proviso).",
    "The complaint must be made in writing within one month of the date the cause of action arises (after the 15 days end); late complaints can be allowed for sufficient cause (s.142)."
   ],
   "steps": [
    "Keep the bounced cheque and the bank's return memo.",
    "Send a written demand notice within 30 days of the bank's information.",
    "If not paid within 15 days of the notice, file a complaint in court within one month."
   ],
   "sections": [
    "NI Act s.138",
    "NI Act s.142"
   ],
   "helplines": [
    "15100"
   ],
   "links": [
    {
     "label": "Negotiable Instruments Act, 1881 – India Code",
     "url": "https://indiacode.gov.in/act/747448ca-9071-4fd0-befe-5f418341070b/details"
    },
    {
     "label": "Section text on India Code (s.138)",
     "url": "https://indiacode.gov.in/items/64a9a186-103f-46ff-b528-9894e1de534f"
    }
   ],
   "sources": [
    {
     "url": "https://indiacode.gov.in/items/64a9a186-103f-46ff-b528-9894e1de534f",
     "checked": "2026-11-01",
     "what": "s.138 text"
    },
    {
     "url": "https://indiacode.gov.in/items/1c79cd03-af0f-4ca6-8820-b5a68414a927",
     "checked": "2026-11-01",
     "what": "s.142 one month"
    }
   ],
   "related": []
  },
  {
   "id": "tenancy_maharashtra",
   "title": "Renting a home in Maharashtra: written, registered agreement",
   "kw": [
    "rent",
    "tenant",
    "landlord",
    "rent agreement",
    "leave and licence",
    "leave and license",
    "eviction",
    "deposit",
    "kiraya",
    "किराया",
    "भाडे",
    "भाडेकरू",
    "घरमालिक",
    "मकान मालिक",
    "किरायेदार",
    "rental",
    "flat on rent",
    "pune",
    "mumbai"
   ],
   "facts": [
    "In Maharashtra, any leave-and-licence or rent agreement made after the Maharashtra Rent Control Act 1999 came in must be in writing and registered under the Registration Act 1908 (Maharashtra Rent Control Act s.55(1)).",
    "Getting it registered is the landlord's responsibility; if there is no written registered agreement, the tenant's version of the terms prevails unless proved otherwise (s.55(2)).",
    "A landlord who breaks this rule can be punished with up to three months' imprisonment, a fine up to Rs 5,000, or both (s.55(3)).",
    "Rent laws are State laws: outside Maharashtra, your State's own rent law applies."
   ],
   "steps": [
    "Insist on a written agreement and its registration (the landlord is responsible).",
    "Keep rent receipts / bank transfer records and the deposit receipt.",
    "For disputes, get free advice through DLSA (15100) or Tele-Law."
   ],
   "sections": [
    "Maharashtra Rent Control Act s.55"
   ],
   "helplines": [
    "15100"
   ],
   "links": [
    {
     "label": "Maharashtra Rent Control Act s.55 – India Code",
     "url": "https://indiacode.gov.in/items/481833de-882e-474e-b57b-9afe9a8017f8"
    }
   ],
   "sources": [
    {
     "url": "https://indiacode.gov.in/items/481833de-882e-474e-b57b-9afe9a8017f8",
     "checked": "2026-11-01",
     "what": "s.55 text"
    }
   ],
   "related": []
  },
  {
   "id": "bank_complaint",
   "title": "Complaint against a bank, NBFC or payment app (RBI Ombudsman)",
   "kw": [
    "bank complaint",
    "bank not responding",
    "rbi",
    "ombudsman",
    "loan",
    "credit card",
    "atm",
    "upi failed",
    "bank charges",
    "nbfc",
    "बैंक शिकायत",
    "बँक तक्रार",
    "लोकपाल",
    "14448",
    "wrong debit",
    "bank"
   ],
   "facts": [
    "First complain to the bank/NBFC/payment company itself, with proof.",
    "If it rejects the complaint, or does not reply within 30 days (or the time set by RBI/NPCI/card network rules, whichever is higher), you can complain under the RBI Integrated Ombudsman Scheme.",
    "Online complaints go to the centralised portal https://cms.rbi.org.in; RBI's toll-free number 14448 gives information 24x7 by IVRS, with contact centre staff from 8 AM to 10 PM."
   ],
   "steps": [
    "Write to your bank and keep the complaint number.",
    "Wait 30 days or until it rejects your complaint.",
    "File on cms.rbi.org.in, attaching your bank complaint."
   ],
   "sections": [],
   "helplines": [
    "14448"
   ],
   "links": [
    {
     "label": "RBI Complaint Management System",
     "url": "https://cms.rbi.org.in/"
    },
    {
     "label": "RBI Ombudsman FAQs",
     "url": "https://www.rbi.org.in/CommonPerson/english/Scripts/FAQs.aspx?Id=3407"
    }
   ],
   "sources": [
    {
     "url": "https://www.rbi.org.in/CommonPerson/english/Scripts/FAQs.aspx?Id=3407",
     "checked": "2026-11-01",
     "what": "RBI FAQ: approach entity first, 30 days, cms.rbi.org.in, 14448 IVRS 24x7, 8 AM–10 PM"
    }
   ],
   "related": []
  },
  {
   "id": "helplines_women_child",
   "title": "Helplines for women and children (181, 1098)",
   "kw": [
    "women helpline",
    "181",
    "child helpline",
    "1098",
    "child abuse",
    "child in danger",
    "child labour",
    "missing child",
    "महिला हेल्पलाइन",
    "चाइल्ड हेल्पलाइन",
    "बाल",
    "मुलं",
    "बच्चा",
    "eve teasing",
    "stalking"
   ],
   "facts": [
    "Women Helpline 181 is a toll-free, 24-hour service for women seeking support and information, run under the Ministry of Women and Child Development.",
    "Child Helpline 1098 is the national child helpline of the Ministry of Women and Child Development (under Mission Vatsalya).",
    "In any emergency, 112 connects to police, fire and health services."
   ],
   "steps": [
    "Call 181 (women) or 1098 (children).",
    "In immediate danger call 112."
   ],
   "sections": [],
   "helplines": [
    "181",
    "1098",
    "112"
   ],
   "links": [
    {
     "label": "Women Helpline 181",
     "url": "https://wcd.gov.in/offerings/women--helpline--scheme"
    },
    {
     "label": "Child Helpline 1098",
     "url": "https://www.wcd.gov.in/child/child-helpline"
    }
   ],
   "sources": [
    {
     "url": "https://wcd.gov.in/offerings/women--helpline--scheme",
     "checked": "2026-11-01",
     "what": "181 toll-free 24 hours; page also lists ERSS 112 and CHL 1098"
    },
    {
     "url": "https://www.wcd.gov.in/child/child-helpline",
     "checked": "2026-11-01",
     "what": "Child Helpline 1098"
    },
    {
     "url": "https://www.india.gov.in/directory/helpline",
     "checked": "2026-11-01",
     "what": "112 Integrated Helpline (ERSS)"
    }
   ],
   "related": []
  },
  {
   "id": "mental_health",
   "title": "Mental health support (Tele-MANAS 14416)",
   "kw": [
    "stress",
    "depression",
    "anxiety",
    "mental health",
    "counselling",
    "tension",
    "तनाव",
    "नैराश्य",
    "मानसिक",
    "tele-manas",
    "telemanas",
    "14416",
    "sad",
    "lonely"
   ],
   "facts": [
    "Tele-MANAS gives free, confidential, round-the-clock mental health support through the toll-free helpline 14416 (Ministry of Health and Family Welfare)."
   ],
   "steps": [
    "Call 14416 any time – it is free and confidential.",
    "If someone is in immediate danger, call 112."
   ],
   "sections": [],
   "helplines": [
    "14416",
    "112"
   ],
   "links": [
    {
     "label": "Tele-MANAS",
     "url": "https://telemanas.mohfw.gov.in/home"
    }
   ],
   "sources": [
    {
     "url": "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2321522",
     "checked": "2026-11-01",
     "what": "PIB: free, confidential, round-the-clock support through toll-free helpline 14416"
    }
   ],
   "related": []
  }
 ]
};

// ---------- Worker ----------
const SECRETS = globalThis.__NYAYA_SECRETS__ || {}; // injected at deploy time only; never committed
const MODELS = [
  { name: 'openai/gpt-oss-120b', url: 'https://api.groq.com/openai/v1/chat/completions', key: 'GROQ', extra: { reasoning_effort: 'low' } },
  { name: 'openai/gpt-oss-20b', url: 'https://api.groq.com/openai/v1/chat/completions', key: 'GROQ', extra: { reasoning_effort: 'low' } },
  { name: 'gemini-3.5-flash-lite', url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', key: 'GEMINI', extra: {} },
  // Red-team fix (2 Nov 2026): a free route on its own quota for when the Groq/Gemini free quotas are used up.
  { name: 'mercury-3', url: 'https://api.inceptionlabs.ai/v1/chat/completions', key: 'INCEPTION', extra: {}, minTokens: 3000 }
];
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

// Per-visitor limit (red-team fix, 2 Nov 2026). Counts in the site's D1/KV store when bound (shared by every
// server instance), else in this instance's memory.
const RL = new Map();
async function rateLimited(request, env, max = 30, windowMs = 10 * 60 * 1000) {
  const ip = (request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'anon').split(',')[0].trim();
  const slot = Math.floor(Date.now() / windowMs);
  if (env && env.DB && env.DB.prepare) {
    try {
      const k = ip + ':' + slot;
      await env.DB.prepare('CREATE TABLE IF NOT EXISTS rl (k TEXT PRIMARY KEY, n INTEGER, t INTEGER)').run();
      const row = await env.DB.prepare('INSERT INTO rl (k, n, t) VALUES (?1, 1, ?2) ON CONFLICT(k) DO UPDATE SET n = n + 1 RETURNING n').bind(k, Date.now()).first();
      if (Math.random() < 0.02) await env.DB.prepare('DELETE FROM rl WHERE t < ?1').bind(Date.now() - 2 * windowMs).run();
      return (row && row.n || 0) > max;
    } catch (e) { /* fall through */ }
  }
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
