// NyayaSaathi front end. Built by Tab, an AI assistant, for team lead Akshay Wagh.
const I18N = {
  en: { tag: 'Free legal information for everyone in India – in simple words', hello: 'Namaste! Ask me about your rights – RTI, FIR, free legal aid, consumer complaints, online fraud, domestic violence, wages, rent, senior citizens and more. I answer only from laws and official pages I have checked, and I always show the source.', label: 'Your question', ph: 'Type your question… e.g. How do I file an RTI?', send: 'Ask', fine: 'Legal information, not legal advice. In an emergency call 112.', howT: 'How it works', how1: 'Your question is matched to entries in a small knowledge base of Indian laws, schemes and helplines – each checked on the official government page.', how2: 'An AI model writes a simple answer using only those entries, in your language.', how3: 'A code guard blocks any section number, helpline, number or website that is not in the knowledge base.', how4: 'Words about violence, threats or suicide skip the AI and show emergency numbers at once.', kbLink: 'See the full knowledge base and its official sources →', helpT: 'Free legal help', nalsa: 'NALSA legal aid helpline', dlsa: 'District Legal Services Authority (DLSA) – who is eligible', tele: 'Tele-Law – advice by video at a Common Service Centre', law: 'Law and official sources', free: 'Where to get free help', freeLine: 'Call the NALSA legal aid helpline 15100, or contact the District Legal Services Authority (DLSA) of your district.', thinking: 'Checking the knowledge base…', emerg: 'Emergency', ans: 'Answer', nomatch: 'Not in my checked sources', err: 'Sorry, something went wrong. For help now call 15100 (legal aid) or 112 (emergency).', metaOk: 'Guard passed: every number and section is from the checked sources', metaFb: 'Shown directly from the checked sources', related: 'Related information',
    chips: ['How do I file an RTI and what is the fee?', 'Police refused to register my FIR. What can I do?', 'Can I get a free lawyer?', 'I lost money in a UPI fraud', 'My employer has not paid my salary for two months', 'My son is not supporting me in old age'] },
  hi: { tag: 'भारत में सबके लिए मुफ्त कानूनी जानकारी – आसान शब्दों में', hello: 'नमस्ते! अपने अधिकारों के बारे में पूछिए – RTI, FIR, मुफ्त कानूनी सहायता, उपभोक्ता शिकायत, ऑनलाइन धोखाधड़ी, घरेलू हिंसा, वेतन, किराया, वरिष्ठ नागरिक और भी बहुत कुछ। मैं सिर्फ़ उन्हीं कानूनों और सरकारी पेजों से जवाब देता हूँ जिन्हें मैंने जाँचा है, और हमेशा स्रोत दिखाता हूँ।', label: 'आपका सवाल', ph: 'अपना सवाल लिखें… जैसे: RTI कैसे दाखिल करें?', send: 'पूछें', fine: 'यह कानूनी जानकारी है, कानूनी सलाह नहीं। आपात स्थिति में 112 पर कॉल करें।', howT: 'यह कैसे काम करता है', how1: 'आपका सवाल भारतीय कानूनों, योजनाओं और हेल्पलाइनों के एक छोटे ज्ञानकोश से मिलाया जाता है – हर जानकारी सरकारी पेज पर जाँची गई है।', how2: 'AI मॉडल सिर्फ़ उन्हीं प्रविष्टियों से आपकी भाषा में आसान जवाब लिखता है।', how3: 'एक कोड-गार्ड ऐसी किसी भी धारा, हेल्पलाइन, संख्या या वेबसाइट को रोक देता है जो ज्ञानकोश में नहीं है।', how4: 'हिंसा, धमकी या आत्महत्या के शब्दों पर AI नहीं चलता – तुरंत आपातकालीन नंबर दिखते हैं।', kbLink: 'पूरा ज्ञानकोश और उसके सरकारी स्रोत देखें →', helpT: 'मुफ्त कानूनी मदद', nalsa: 'NALSA कानूनी सहायता हेल्पलाइन', dlsa: 'जिला विधिक सेवा प्राधिकरण (DLSA) – कौन पात्र है', tele: 'टेली-लॉ – कॉमन सर्विस सेंटर पर वीडियो से सलाह', law: 'कानून और सरकारी स्रोत', free: 'मुफ्त मदद कहाँ मिलेगी', freeLine: 'NALSA कानूनी सहायता हेल्पलाइन 15100 पर कॉल करें, या अपने जिले के जिला विधिक सेवा प्राधिकरण (DLSA) से संपर्क करें।', thinking: 'ज्ञानकोश जाँचा जा रहा है…', emerg: 'आपातकाल', ans: 'जवाब', nomatch: 'मेरे जाँचे गए स्रोतों में नहीं', err: 'क्षमा करें, कुछ गड़बड़ हुई। अभी मदद के लिए 15100 (कानूनी सहायता) या 112 (आपातकाल) पर कॉल करें।', metaOk: 'गार्ड पास: हर संख्या और धारा जाँचे गए स्रोतों से है', metaFb: 'सीधे जाँचे गए स्रोतों से दिखाया गया', related: 'संबंधित जानकारी',
    chips: ['RTI कैसे दाखिल करें और फीस कितनी है?', 'पुलिस FIR नहीं लिख रही, क्या करूँ?', 'क्या मुझे मुफ्त वकील मिल सकता है?', 'ऑनलाइन फ्रॉड में मेरे पैसे कट गए', 'मालिक ने दो महीने से वेतन नहीं दिया', 'बेटा बुढ़ापे में खर्च नहीं देता'] },
  mr: { tag: 'भारतातील सर्वांसाठी मोफत कायदेशीर माहिती – सोप्या शब्दांत', hello: 'नमस्कार! तुमच्या हक्कांबद्दल विचारा – माहितीचा अधिकार (RTI), FIR, मोफत कायदेशीर मदत, ग्राहक तक्रार, ऑनलाइन फसवणूक, कौटुंबिक हिंसाचार, पगार, भाडे, ज्येष्ठ नागरिक आणि बरेच काही. मी फक्त तपासलेल्या कायद्यांवरून आणि सरकारी पानांवरून उत्तर देतो, आणि नेहमी स्रोत दाखवतो.', label: 'तुमचा प्रश्न', ph: 'तुमचा प्रश्न लिहा… उदा. RTI अर्ज कसा करायचा?', send: 'विचारा', fine: 'ही कायदेशीर माहिती आहे, कायदेशीर सल्ला नाही. आपत्कालीन परिस्थितीत 112 वर कॉल करा.', howT: 'हे कसे काम करते', how1: 'तुमचा प्रश्न भारतीय कायदे, योजना आणि हेल्पलाइनच्या छोट्या माहितीसंग्रहाशी जुळवला जातो – प्रत्येक माहिती सरकारी पानावर तपासलेली आहे.', how2: 'AI मॉडेल फक्त त्याच नोंदींवरून तुमच्या भाषेत सोपे उत्तर लिहिते.', how3: 'कोड-गार्ड माहितीसंग्रहात नसलेले कोणतेही कलम, हेल्पलाइन, क्रमांक किंवा वेबसाइट थांबवतो.', how4: 'हिंसा, धमकी किंवा आत्महत्येचे शब्द आल्यास AI वापरले जात नाही – लगेच आपत्कालीन क्रमांक दिसतात.', kbLink: 'संपूर्ण माहितीसंग्रह आणि सरकारी स्रोत पाहा →', helpT: 'मोफत कायदेशीर मदत', nalsa: 'NALSA कायदेशीर मदत हेल्पलाइन', dlsa: 'जिल्हा विधी सेवा प्राधिकरण (DLSA) – कोण पात्र आहे', tele: 'टेली-लॉ – कॉमन सर्व्हिस सेंटरवर व्हिडिओद्वारे सल्ला', law: 'कायदा आणि सरकारी स्रोत', free: 'मोफत मदत कुठे मिळेल', freeLine: 'NALSA कायदेशीर मदत हेल्पलाइन 15100 वर कॉल करा, किंवा तुमच्या जिल्ह्याच्या जिल्हा विधी सेवा प्राधिकरणाशी (DLSA) संपर्क करा.', thinking: 'माहितीसंग्रह तपासत आहे…', emerg: 'आपत्काल', ans: 'उत्तर', nomatch: 'माझ्या तपासलेल्या स्रोतांमध्ये नाही', err: 'माफ करा, काहीतरी चुकले. आत्ता मदतीसाठी 15100 (कायदेशीर मदत) किंवा 112 (आपत्काल) वर कॉल करा.', metaOk: 'गार्ड पास: प्रत्येक क्रमांक आणि कलम तपासलेल्या स्रोतांमधून आहे', metaFb: 'थेट तपासलेल्या स्रोतांमधून दाखवले', related: 'संबंधित माहिती',
    chips: ['RTI अर्ज कसा करायचा आणि फी किती आहे?', 'पोलीस FIR घेत नाहीत, काय करू?', 'मला मोफत वकील मिळू शकतो का?', 'ऑनलाइन फसवणुकीत माझे पैसे गेले', 'माझा मालक दोन महिन्यांचा पगार देत नाही', 'मुलगा म्हातारपणी खर्च देत नाही'] }
};
let LANG = (localStorage.getItem('ns_lang') || 'en');
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function setLang(l) {
  LANG = I18N[l] ? l : 'en'; localStorage.setItem('ns_lang', LANG); document.documentElement.lang = LANG;
  document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (I18N[LANG][k]) el.textContent = I18N[LANG][k]; });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = I18N[LANG][el.dataset.i18nPh]; });
  document.querySelectorAll('.langs button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === LANG)));
  $('#chips').innerHTML = I18N[LANG].chips.map(c => `<button type="button">${esc(c)}</button>`).join('');
}
function add(html, cls) { const d = document.createElement('div'); d.className = 'msg ' + cls; d.innerHTML = html; $('#thread').appendChild(d); d.scrollIntoView({ behavior: 'smooth', block: 'start' }); return d; }
function entriesBox(entries, title) {
  if (!entries || !entries.length) return '';
  const items = entries.map(e => `<li><strong>${esc(e.title)}</strong>${e.sections.length ? ' – ' + e.sections.map(esc).join(', ') : ''}${e.links.map(l => `<br><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('')}</li>`).join('');
  return `<div class="box"><h3>${esc(title)}</h3><ul>${items}</ul></div>`;
}
function render(r) {
  const t = I18N[r.lang] || I18N[LANG];
  if (r.type === 'emergency') return add(`<span class="badge">${esc(t.emerg)}</span><p class="text">${esc(r.text)}</p>${entriesBox(r.entries, t.related)}<p class="disc">${esc(r.disclaimer)}</p>`, 'bot emergency');
  if (r.type === 'no_match') return add(`<span class="badge">${esc(t.nomatch)}</span><p class="text">${esc(r.text)}</p><div class="box helpbox"><h3>${esc(t.free)}</h3><p><a href="${esc(r.free_help.legal_aid_link.url)}" target="_blank" rel="noopener">${esc(r.free_help.legal_aid_link.label)}</a><br><a href="${esc(r.free_help.tele_law_link.url)}" target="_blank" rel="noopener">${esc(r.free_help.tele_law_link.label)}</a></p></div><p class="disc">${esc(r.disclaimer)}</p>`, 'bot');
  if (r.type !== 'answer') return add(`<p>${esc(t.err)}</p>`, 'bot');
  const meta = (r.answer_source === 'model' ? t.metaOk + (r.model ? ' · ' + r.model : '') : t.metaFb);
  return add(`<span class="badge">${esc(t.ans)}</span><p class="text">${esc(r.text)}</p>${entriesBox(r.entries, t.law)}<div class="box helpbox"><h3>${esc(t.free)}</h3><p>${esc(t.freeLine)}<br><a href="${esc(r.free_help.legal_aid_link.url)}" target="_blank" rel="noopener">${esc(r.free_help.legal_aid_link.label)}</a> · <a href="${esc(r.free_help.tele_law_link.url)}" target="_blank" rel="noopener">${esc(r.free_help.tele_law_link.label)}</a></p></div><p class="disc">${esc(r.disclaimer)}</p><p class="meta">✔ ${esc(meta)}</p>`, 'bot');
}
async function ask(q) {
  q = q.trim(); if (!q) return;
  add(`<p>${esc(q)}</p>`, 'user');
  const wait = add(`<p class="typing">${esc(I18N[LANG].thinking)}</p>`, 'bot');
  $('#send').disabled = true;
  try {
    const r = await fetch('/api/ask', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ q, lang: LANG }) }).then(x => x.json());
    wait.remove(); render(r);
  } catch { wait.remove(); add(`<p>${esc(I18N[LANG].err)}</p>`, 'bot'); }
  $('#send').disabled = false;
}
document.addEventListener('click', e => {
  const b = e.target.closest('.langs button'); if (b) setLang(b.dataset.lang);
  const c = e.target.closest('.chips button'); if (c) ask(c.textContent);
});
$('#ask').addEventListener('submit', e => { e.preventDefault(); const v = $('#q').value; $('#q').value = ''; ask(v); });
$('#q').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('#ask').requestSubmit(); } });
setLang(LANG);
