# NyayaSaathi – HackIndia “AI for Lawyers” 2026 submission draft

**Team:** Tab x Akshay (team lead: Akshay Wagh, Pune) · **Problem statement:** PS-02 · Access to Justice · Legal Information Chatbot
**Live demo:** https://nyayasaathi.sites.tab.bot/ · **Code:** https://github.com/tab-for-akshay/nyayasaathi · **Demo video (2:50):** https://nyayasaathi.sites.tab.bot/demo.mp4

Built by Tab, an AI assistant, for team lead Akshay Wagh.

## Project description

Most people in India who face a legal problem – a police station that will not write an FIR, an employer who has not paid wages, money lost to a UPI scam, violence at home – do not know their rights or where free help is. General-purpose chatbots answer confidently but can invent section numbers, fees and helplines, which in law can do real harm.

**NyayaSaathi** (“justice companion”) is a plain-language legal-information chatbot in **English, Hindi and Marathi**. Each answer explains rights and next steps in simple words, cites the Act/section or official scheme with a link to the official source, points to free legal aid (NALSA 15100, the District Legal Services Authority, Tele-Law), and states that it is information, not advice.

Its core idea is **“no invented law”**: the model may answer only from a small curated knowledge base (20 entries) in which every fact, section, fee, time limit, helpline and URL was checked on the official government page on 1 Nov 2026, and a code-level guard blocks any section number, helpline, number or website that is not in the retrieved entries. Messages about violence, threats to life or suicide never reach the model: they get a fixed emergency message with 112, Women Helpline 181 and Tele-MANAS 14416.

## AI workflow and models

1. **Emergency check (code only):** keyword rules in English, Hindi, Marathi and Hinglish → fixed message, no model call.
2. **Language:** auto-detected or chosen with the EN / हिंदी / मराठी switch.
3. **Retrieval:** an LLM router (`openai/gpt-oss-20b` on Groq, JSON mode) picks at most 3 entry ids from the KB list; ids are validated in code and combined with multilingual keyword matching. No match → honest “not covered” + legal-aid pointers.
4. **Grounded answer:** `openai/gpt-oss-120b` on Groq (reasoning effort low, temperature 0.1) writes the answer from the retrieved entries only, in the person’s language. Fallbacks: `openai/gpt-oss-20b`, then Google `gemini-3.5-flash-lite`.
5. **Guard (code):** every section number, every 2+-digit number (Devanagari digits normalised) and every website in the answer must appear in the retrieved entries; numbers typed by the user may be echoed. Violation → one corrective retry → else the checked KB text is shown verbatim.
6. **Rendering (code):** sources, links, the free-help box and the disclaimer come from the KB, never from the model.

Tests (`npm test`, 25 passing): guard cases (invented section, invented helpline, real helpline from a different entry, non-KB website, Devanagari digits, Indian digit grouping), the emergency path in 3 languages with a check that no network call is made, the full ask flow with a mocked model (invented law → fallback; corrective retry accepted; clean answer passes; no-match), KB integrity (official domains, dated sources), and site checks (title, viewport, assets, disclosure line, no keys in the built Worker).

## Sample legal outputs (copied from the live app, 1 Nov 2026)

### Q (English): How do I file an RTI and what is the fee?

*Response type: `answer` · model `openai/gpt-oss-120b` · guard passed*

```text
You can ask any public authority for information by writing to its Public Information Officer (PIO). The request can be on paper or electronically, in English, Hindi or the official language of the area (RTI Act s.6(1)). No reason or extra personal details are required beyond what is needed to contact you (RTI Act s.6(2)). The PIO must reply within 30 days (or within 48 hours if the information concerns life or liberty) (RTI Act s.7(1)).

For Central Government offices the application fee is Rs 10 (RTI Rules 2012 rule 3). If you are below the poverty line, you pay no fee by attaching a copy of your BPL certificate (RTI Rules 2012 rule 5). State offices follow their own fee rules.

Next steps
1. Write a short, specific question (state the document or period you need).  
2. Address it to the PIO of the correct office, or file online at rtionline.gov.in for Central offices.  
3. Pay the fee of Rs 10 for Central offices, or attach your BPL certificate if applicable.  
4. Keep the receipt or registration number and count 30 days for the response.
```

Sources shown by the app: Filing an RTI application – [RTI Online portal (Central)](https://rtionline.gov.in/), [RTI Act, 2005 – India Code](https://indiacode.gov.in/act/37520cf3-5c3f-4c0b-aa4a-5985e6f522bf/details)

Disclaimer shown: “This is legal information, not legal advice. For advice on your case, talk to a lawyer – free legal aid is available.”

### Q (Hindi): मेरे बैंक खाते से UPI फ्रॉड में 20000 रुपये कट गए, क्या करूँ?

*Response type: `answer` · model `openai/gpt-oss-120b` · guard passed*

```text
UPI धोखाधड़ी से आपका पैसा निकला है, इसलिए आप तुरंत कार्रवाई कर सकते हैं। राष्ट्रीय साइबर अपराध हेल्पलाइन 1930 24 × 7 मुफ्त है और यह वित्तीय धोखाधड़ी के मामलों में मदद करती है (National Cyber Crime Helpline 1930)।

आगे क्या करें
1. तुरंत 1930 पर कॉल करके घटना की रिपोर्ट करें; जितनी जल्दी रिपोर्ट करेंगे, उतनी ही बेहतर मदद मिल सकती है।  
2. राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल https://cybercrime.gov.in पर भी शिकायत दर्ज करें और प्राप्त acknowledgment number को सुरक्षित रखें।  
3. अपने बैंक को तुरंत सूचित करें, लेन‑देन की स्क्रीनशॉट, ट्रांज़ैक्शन आईडी और फोन नंबर जैसे सबूत संलग्न करें।  

यदि इन चरणों में कोई जानकारी नहीं मिलती, तो मुफ्त कानूनी सहायता के लिए नजदीकी कानूनी सहायता केंद्र से संपर्क करें।
```

Sources shown by the app: Online fraud and cybercrime reporting – [National Cyber Crime Reporting Portal](https://cybercrime.gov.in/)

Disclaimer shown: “यह कानूनी जानकारी है, कानूनी सलाह नहीं। अपने मामले में सलाह के लिए वकील से बात करें – मुफ्त कानूनी सहायता उपलब्ध है।”

### Q (Marathi): माझा मालक दोन महिन्यांचा पगार देत नाही. काय करू?

*Response type: `answer` · model `openai/gpt-oss-120b` · guard passed*

```text
पगार वेळेवर न दिल्याबाबत तुमचे अधिकार Code on Wages 2019 मध्ये स्पष्ट आहेत. मासिक कामगारांसाठी पगार पुढील महिन्याच्या 7 तारखेपर्यंत द्यावा (Code on Wages s.17). जर तुम्ही काढून टाकलेले, बडतर्फ केलेले किंवा राजीनामा दिलेला असाल तर पगार दोन कामकाजाच्या दिवसांत देणे बंधनकारक (Code on Wages s.17). तुम्ही तीन वर्षांच्या आत Code वर नियुक्त अधिकार्यांकडे दावा दाखल करू शकता; हा अधिकार्य पगाराची रक्कम दहा पटपर्यंत भरपाई म्हणून ठरवू शकतो आणि तीन महिन्यांत निर्णय द्यावा (Code on Wages s.45).

पुढील पावले
1. कामाचे आणि पगाराचे पुरावे जतन करा – हजेरी, मेसेज, बँक स्टेटमेंट, नियुक्तीपत्र इत्यादी.
2. नियोक्त्याला लेखी स्वरूपात पगाराची मागणी करा आणि न दिल्याची नोंद घ्या.
3. Code on Wages अंतर्गत नियुक्त अधिकार्यांकडे (उदा. राज्य मजूर विभाग) तीन वर्षांच्या आत दावा दाखल करा (Code on Wages s.45).
4. जर तुम्ही औद्योगिक कामगार असाल तर मोफत कायदेशीर मदतीसाठी 15100 या हेल्पलाईनवर संपर्क करा.
```

Sources shown by the app: Unpaid or late wages – [Code on Wages, 2019 – India Code](https://indiacode.gov.in/act/20bf2ac3-5d54-4e1a-a06b-e4f19ad582bc/details)

Disclaimer shown: “ही कायदेशीर माहिती आहे, कायदेशीर सल्ला नाही. तुमच्या प्रकरणासाठी वकिलाशी बोला – मोफत कायदेशीर मदत उपलब्ध आहे.”

### Q (English): Police refused to register my FIR about my stolen bike. What can I do?

*Response type: `answer` · model `openai/gpt-oss-120b` · guard passed*

```text
You have the right to have the matter recorded and investigated. If the officer in charge refuses to register your FIR, you may send the details of the incident in writing to the Superintendent of Police (SP) of the district (BNSS s.173(4)). The SP must decide whether the case involves a cognizable offence and, if so, order an investigation. If the SP does not act, you can approach the Magistrate for further action (BNSS s.173(4)).

Next steps
1. Write down the facts of the theft – date, time, place, description of the bike, and note that the police station refused to record the FIR, including the officer’s name if known.
2. Send this written complaint by post to the Superintendent of Police of the district; keep the postal receipt as proof.
3. If the SP does not investigate, file an application before the Magistrate requesting that an investigation be ordered; you can seek free legal aid for drafting this application.
4. You may also call the helpline 15100 for further guidance.
```

Sources shown by the app: Police refused to register my FIR – [Bharatiya Nagarik Suraksha Sanhita, 2023 – India Code](https://indiacode.gov.in/act/72592ac7-d084-4545-95d3-0c98dc49fac3/details)

Disclaimer shown: “This is legal information, not legal advice. For advice on your case, talk to a lawyer – free legal aid is available.”

### Q (English): How do I patent my invention?

*Response type: `no_match`*

```text
Sorry – my checked knowledge base does not cover this question yet, so I will not guess. Please contact free legal aid: call the NALSA helpline 15100 or go to the District Legal Services Authority (DLSA) of your district. You can also get advice by video through Tele-Law at a Common Service Centre.
```

Disclaimer shown: “This is legal information, not legal advice. For advice on your case, talk to a lawyer – free legal aid is available.”

### Q (English): My husband threatened to kill me tonight

*Response type: `emergency`*

```text
If you or someone else is in danger right now, please call 112 (police, fire, ambulance – all India emergency number) immediately.
• Women in distress: Women Helpline 181 (24 hours, toll-free).
• If you are thinking of ending your life or are in deep distress: Tele-MANAS 14416 (free, confidential, 24x7).
You are not alone. Please call now and stay with someone you trust. When you are safe, free legal aid is available on 15100.
```

Disclaimer shown: “This is legal information, not legal advice. For advice on your case, talk to a lawyer – free legal aid is available.”


## Knowledge base coverage

RTI application & fee; RTI appeals; FIR / Zero FIR / e-FIR (BNSS s.173); police refusing an FIR (s.173(4)); arrest rights (BNSS s.47, s.48, s.58); free legal aid eligibility (LSA Act s.12, s.13; NALSA income ceilings); Lok Adalat (s.19, s.21); Tele-Law; consumer complaints (CPA 2019 s.34, s.35, s.69; NCH 1915; e-Jagriti, which integrated e-Daakhil); cyber fraud (1930, cybercrime.gov.in); domestic violence (PWDVA s.3, s.12, s.18–20; 181); workplace sexual harassment (POSH Act s.4, s.6, s.9); senior citizens’ maintenance (MWPSC Act s.4, s.5, s.9, s.23; Elderline 14567); maintenance for wife/children/parents (BNSS s.144); unpaid wages (Code on Wages s.17, s.45; in force from 21 Nov 2025); cheque bounce (NI Act s.138, s.142); Maharashtra rent agreements (MRC Act s.55); bank complaints (RBI Integrated Ombudsman, cms.rbi.org.in, 14448); women and child helplines (181, 1098, 112); mental health (Tele-MANAS 14416). Full list with every official source and check date: https://nyayasaathi.sites.tab.bot/kb.html

## Roadmap

* Grow the KB with verified entries (State rent laws, land records, MGNREGA, disability rights, POCSO) with a review workflow for law students or DLSA panel lawyers.
* Voice input/output in Hindi and Marathi for people who cannot type.
* Share-to-WhatsApp of the answer with its sources; printable “what to bring to DLSA” checklist.
* Automatic re-check of every KB source URL on a schedule, flagging changed pages for human review.

## Disclosure

Built by Tab, an AI assistant, for team lead Akshay Wagh. The demo video uses synthetic (text-to-speech) narration.
