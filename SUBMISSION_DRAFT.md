# NyayaSaathi – HackIndia “AI for Lawyers” 2026 submission draft

**Team:** Tab x Akshay (team lead: Akshay Wagh, Pune) · **Problem statement:** PS-02 · Access to Justice · Legal Information Chatbot
**Live demo:** https://nyayasaathi.sites.tab.bot/ · **Code:** https://github.com/tab-for-akshay/nyayasaathi · **Demo video (2:50):** https://nyayasaathi.sites.tab.bot/demo.mp4

Built by Tab, an AI assistant, for team lead Akshay Wagh.

## Project description

Most people in India who face a legal problem – a police station that will not write an FIR, an employer who has not paid wages, money lost to a UPI scam, violence at home – do not know their rights or where free help is. General-purpose chatbots answer confidently but can invent section numbers, fees and helplines, which in law can do real harm.

**NyayaSaathi** (“justice companion”) is a plain-language legal-information chatbot in **English, Hindi and Marathi**. Each answer explains rights and next steps in simple words, cites the Act/section or official scheme with a link to the official source, points to free legal aid (NALSA 15100, the District Legal Services Authority, Tele-Law), and states that it is information, not advice.

Its core idea is **“no invented law”**: the model may answer only from a small curated knowledge base (20 entries, 77 checked facts) in which every fact, section, fee, time limit, helpline and URL was checked on the official government page on 1 Nov 2026, and a code-level guard blocks any section number, helpline, number or website that is not in the retrieved entries. Messages about violence, threats to life or suicide never reach the model: they get a fixed emergency message with 112, Women Helpline 181 and Tele-MANAS 14416.

## AI workflow and models

1. **Emergency check (code only):** keyword rules in English, Hindi, Marathi and Hinglish → fixed message, no model call.
2. **Language:** auto-detected or chosen with the EN / हिंदी / मराठी switch.
3. **Retrieval:** an LLM router (`openai/gpt-oss-20b` on Groq, JSON mode) picks at most 3 entry ids from the KB list; ids are validated in code and combined with multilingual keyword matching. No match → honest “not covered” + legal-aid pointers.
4. **Grounded answer:** `openai/gpt-oss-120b` on Groq (reasoning effort low, temperature 0.1) writes the answer from the retrieved entries only, in the person’s language. Fallbacks: `openai/gpt-oss-20b`, then Google `gemini-3.5-flash-lite`.
5. **Guard (code):** every section number, every 2+-digit number (Devanagari digits normalised) and every website in the answer must appear in the retrieved entries; numbers typed by the user may be echoed. Violation → one corrective retry → else the checked KB text is shown verbatim.
6. **Rendering (code):** sources, links, the free-help box and the disclaimer come from the KB, never from the model.

Tests (`npm test`, 27 passing): guard cases (invented section, invented helpline, real helpline from a different entry, non-KB website, Devanagari digits, Indian digit grouping), the emergency path in 3 languages with a check that no network call is made, the full ask flow with a mocked model (invented law → fallback; corrective retry accepted; clean answer passes; no-match), KB integrity (official domains, dated sources), and site checks (title, viewport, assets, disclosure line, no keys in the built Worker).

## How it was built: three iterations with outside critics

Rule for this entry: no version was called final until two outside reviewers had critiqued it twice. Reviewers: **Fo** (Wajo’s AI agent, which opened the live app itself and checked the legal claims) and a second model critic (round 1: `gpt-oss-120b` as judge/lawyer; round 2: Google `gemini-3.5-flash` as a legal-accuracy auditor of the full KB). Every claimed legal error was re-checked against the official text before changing anything.

**v1 → review round 1.** Fo: the KB page could sit on “Loading…”; answers buried the action under statute prose; out-of-scope needed a designed answer; RTI answer missed the first appeal and fee-payment modes; FIR answer missed the free FIR copy and the Magistrate route; emergency keywords too narrow (threats); old CrPC/IPC citations must route to BNSS/BNS; provenance belongs inside each answer; make the guard the hero of the demo. Second critic: a persistent emergency button with tap-to-call, a clearer disclaimer and privacy note, “checked on” dates, copy/share.

**v2 (changes).** Static, pre-rendered `kb.html`; answer prompt now leads with the single key action, ≤120 words, then steps, with धारा/कलम in Hindi/Marathi; AI-free “I won’t guess” card listing covered topics; linked entries (RTI → appeal, FIR refused → Zero FIR) pulled in together; RTI Rules rule 6 (payment modes) and BPL exemption for copies; BNSS s.175(3) Magistrate route and s.531 (CrPC repealed, in force 1 July 2024); legacy keywords (154/156 CrPC, 125 CrPC, 498A); threat words in EN/HI/MR/Hinglish; red “Emergency help” button (112/181/14416/15100); banner + privacy note; per-source “checked on” date and India Code section deep links; Copy / WhatsApp / Print; visible guard notice; “Try to break it” panel.

**v2 → review round 2.** Gemini found a real error: the KB said District Consumer Commissions hear claims up to Rs 1 crore – the 2021 Jurisdiction Rules cut that to **Rs 50 lakh** (State: Rs 50 lakh–2 crore; National: above Rs 2 crore; confirmed on PIB, 30 Dec 2021). It also flagged the missing BNSS s.173(3) 14-day preliminary enquiry and the criminal remedy for cruelty (BNS s.85/86). (Its claim that the cheque-bounce fact was wrong was rejected: the KB quotes NI Act s.138 exactly.) Fo tested v2 live: the emergency card hid the legal substance (“my husband beats me, what protection order…” showed only helplines); “any FIR copy free” overreached (s.173(2) is the informant’s/victim’s copy); rule 6 does not list personal cheques; trick-question cards and chrome were not translated; section link labels claimed sub-section precision the links do not have; the disclaimer should say the bot cannot file or represent and what “checked” means.

**v3 (changes).** Consumer jurisdiction corrected to Rs 50 lakh / 2 crore; s.173(3) preliminary enquiry; BNS s.85, s.86 and s.358 added to domestic violence; FIR-copy and rule 6 wording tightened; emergency answers now also show the checked key points of the matching KB entry (still no model call); trick questions translated; section links relabelled to whole sections; disclaimer extended in all three languages; prompt requires every applicable time limit and appeal step. Testing v3 live also exposed a guard false positive – Hindi “अधिनियम 2019” (Act, 2019) was being read as “नियम 2019” (rule 2019), and gpt-oss’s non-breaking hyphens split “e-jagriti.gov.in” – both fixed with tests (27 passing).

## Sample legal outputs (copied from the live v3 app, 1 Nov 2026)

### Q (English): How do I file an RTI application?

*Response type: `answer` · model `openai/gpt-oss-120b` · guard passed*

```text
Write a short, specific question and address it to the Public Information Officer of the concerned office, or use the online portal for Central offices. Pay Rs 10 fee (or attach BPL certificate if applicable) and keep the receipt or registration number. (RTI Act s.6; RTI Rules 2012 rule 3; RTI Rules 2012 rule 5)

Next steps
1. Draft your request in English, Hindi or the official language, stating the exact information you need.  
2. Send it to the PIO of the relevant public authority, or submit it online at rtionline.gov.in for Central offices.  
3. Pay the Rs 10 application fee (cash, demand draft, banker’s cheque, Indian Postal Order, or electronic payment) or attach a BPL certificate if you are below the poverty line.  
4. Retain the payment receipt or online registration number and note the 30-day response period.  
5. If no reply is received within 30 days, prepare to file a first appeal to the senior officer in the same office. (RTI Act s.7; RTI Act s.19)
```

Sources shown by the app: Filing an RTI application – [RTI Online portal (Central)](https://rtionline.gov.in/), [RTI Act, 2005 – India Code](https://indiacode.gov.in/act/37520cf3-5c3f-4c0b-aa4a-5985e6f522bf/details), [Section text on India Code (s.6)](https://indiacode.gov.in/items/822280bc-89b4-4a39-aa10-72163b7c22f6); RTI: no reply or unhappy with the reply (appeals) – [RTI Online portal (Central)](https://rtionline.gov.in/), [RTI Act, 2005 – India Code](https://indiacode.gov.in/act/37520cf3-5c3f-4c0b-aa4a-5985e6f522bf/details), [Section text on India Code (s.19)](https://indiacode.gov.in/items/d4740d94-1ae3-4bb5-b8a8-90f86610e1b7)

Disclaimer shown: “This is legal information, not legal advice. NyayaSaathi is not a lawyer and cannot file a case or represent you; for advice on your case, talk to a lawyer – free legal aid is available. "Checked" dates show when the official source was last verified, not a live check.”


### Q (Hindi): UPI से मेरे 20000 रुपये ठग लिए गए, अब क्या करूँ?

*Response type: `answer` · model `openai/gpt-oss-20b` · guard passed*

```text
पहला कदम: 1930 पर तुरंत कॉल करें और अपनी शिकायत दर्ज करें (क्योंकि पैसा खो गया है)।

आपके पास निम्न अधिकार हैं:  
- आप 1930 पर 24×7 टोल-फ्री कॉल करके तुरंत सहायता प्राप्त कर सकते हैं (National Cyber Crime Helpline 1930)।  
- आप https://cybercrime.gov.in पर ऑनलाइन रिपोर्ट कर सकते हैं और एक मान्यता संख्या (acknowledgement number) प्राप्त कर सकते हैं।  
- बैंक को तुरंत सूचित करें, स्क्रीनशॉट, ट्रांज़ैक्शन आईडी और फोन नंबर रखें।  

आगे क्या करें  
1. 1930 पर कॉल करें और अपनी घटना की रिपोर्ट करें।  
2. https://cybercrime.gov.in पर रिपोर्ट करें और मान्यता संख्या नोट करें।  
3. अपने बैंक को लिखित रूप में शिकायत भेजें और शिकायत संख्या रखें।  
4. यदि बैंक 30 दिनों के भीतर जवाब नहीं देता या शिकायत अस्वीकार करता है, तो https://cms.rbi.org.in पर RBI Integrated Ombudsman Scheme के तहत शिकायत दर्ज करें।
```

Sources shown by the app: Online fraud and cybercrime reporting – [National Cyber Crime Reporting Portal](https://cybercrime.gov.in/); Complaint against a bank, NBFC or payment app (RBI Ombudsman) – [RBI Complaint Management System](https://cms.rbi.org.in/), [RBI Ombudsman FAQs](https://www.rbi.org.in/CommonPerson/english/Scripts/FAQs.aspx?Id=3407)

Disclaimer shown: “यह कानूनी जानकारी है, कानूनी सलाह नहीं। न्याय साथी वकील नहीं है और आपका केस दायर या आपकी पैरवी नहीं कर सकता; अपने मामले में सलाह के लिए वकील से बात करें – मुफ्त कानूनी सहायता उपलब्ध है। "जाँचा गया" तारीख बताती है कि सरकारी स्रोत आख़िरी बार कब जाँचा गया।”


### Q (Marathi): माझ्या मालकाने दोन महिन्यांचा पगार दिला नाही, मी काय करू?

*Response type: `answer` · model `openai/gpt-oss-120b` · guard passed*

```text
दोन महिन्यांचा पगार मिळविण्यासाठी त्वरित नियोक्त्याला लेखी मागणी करा आणि नंतर कोड ऑन वेजेस अंतर्गत अधिकाऱ्यांकडे दावा दाखल करा (फी नाही).  

तुमचा पगार वेळेवर दिला जाणे आवश्यक आहे; मासिक कामगारांसाठी पुढील महिन्याच्या 7 तारखेपर्यंत (Code on Wages s.17). न दिलेला पगार दोन कामकाज दिवसांच्या आत द्यावा, परंतु तुम्ही दोन महिने थांबले असल्याने हा हक्क उल्लंघन झाला आहे. तुम्ही किंवा तुमचा नोंदणीकृत ट्रेड युनियन, किंवा इन्स्पेक्टर-कॅम-फॅसिलिटेटर यांच्याद्वारे तीन वर्षांच्या आत दावा दाखल करू शकता; अधिकाऱ्याला तीन महिन्यांत निर्णय द्यावा आणि दाव्याच्या दहापट रक्कमेपर्यंत भरपाई देऊ शकतो (Code on Wages s.45). औद्योगिक कामगारांसाठी मोफत कायदेशीर मदत उपलब्ध आहे (15100).  

पुढील पावले  
1. नियोक्त्याला लेखी पद्धतीने पगाराची मागणी करा आणि पावती ठेवा.  
2. कामाचे आणि पगाराचे पुरावे (हजेरी, मेसेज, बँक स्टेटमेंट, नियुक्तीपत्र) जमा करा.  
3. कोड ऑन वेजेस अंतर्गत नियुक्त अधिकाऱ्यांकडे तीन वर्षांच्या आत दावा दाखल करा (s.45).  
4. मोफत कायदेशीर मदतीसाठी 15100 या हेल्पलाइनवर संपर्क करा.  
5. निर्णय मिळाल्यानंतर, आवश्यक असल्यास उच्च अधिकाऱ्याकडे अपील करा (तीन महिन्यांच्या निर्णय कालावधीचा विचार करा).
```

Sources shown by the app: Unpaid or late wages – [Code on Wages, 2019 – India Code](https://indiacode.gov.in/act/20bf2ac3-5d54-4e1a-a06b-e4f19ad582bc/details), [Section text on India Code (s.17)](https://indiacode.gov.in/items/b9485c36-2ab6-4c6f-9de0-37455777b6f0)

Disclaimer shown: “ही कायदेशीर माहिती आहे, कायदेशीर सल्ला नाही. न्याय साथी वकील नाही आणि तुमचा खटला दाखल करू शकत नाही किंवा तुमची बाजू मांडू शकत नाही; तुमच्या प्रकरणासाठी वकिलाशी बोला – मोफत कायदेशीर मदत उपलब्ध आहे. "तपासले" तारीख सरकारी स्रोत शेवटचा कधी तपासला ते सांगते.”


### Q (English): Police refused to register my FIR

*Response type: `answer` · model `openai/gpt-oss-120b` · guard passed*

```text
Send a written complaint about the refusal to the Superintendent of Police by post, keeping the receipt.  
You can write the facts and note the police officer’s refusal; the SP must decide if it is a cognizable offence and order investigation (BNSS s.173(4)). If the SP does not act, you may apply to a Magistrate with an affidavit for an investigation order (BNSS s.175(3)). You are entitled to a free copy of any FIR and no charge for these steps (BNSS s.173(1), s.173(2)). Free legal aid is available (helpline 15100).  

Next steps  
1. Write down the incident details, date, time, and the officer’s refusal.  
2. Mail this written complaint to the Superintendent of Police of the district; retain the postal receipt.  
3. If no action is taken, file an application with the Magistrate, attaching an affidavit (BNSS s.175(3)).  
4. Seek free legal aid for drafting the affidavit (helpline 15100).
```

Sources shown by the app: Police refused to register my FIR – [Bharatiya Nagarik Suraksha Sanhita, 2023 – India Code](https://indiacode.gov.in/act/72592ac7-d084-4545-95d3-0c98dc49fac3/details), [Section text on India Code (s.173)](https://indiacode.gov.in/items/a0db5735-c3e7-486a-af8c-79e655b828e4); Registering an FIR (including Zero FIR and e-FIR) – [Bharatiya Nagarik Suraksha Sanhita, 2023 – India Code](https://indiacode.gov.in/act/72592ac7-d084-4545-95d3-0c98dc49fac3/details), [Section text on India Code (s.173)](https://indiacode.gov.in/items/a0db5735-c3e7-486a-af8c-79e655b828e4)

Disclaimer shown: “This is legal information, not legal advice. NyayaSaathi is not a lawyer and cannot file a case or represent you; for advice on your case, talk to a lawyer – free legal aid is available. "Checked" dates show when the official source was last verified, not a live check.”


### Q (Hindi): उपभोक्ता शिकायत किस आयोग में करूँ? सामान 30 लाख का था

*Response type: `answer` · model `openai/gpt-oss-120b` · guard passed*

```text
सामान की कीमत 30 लाख होने पर आप अपनी शिकायत जिला उपभोक्ता आयोग में दर्ज कराएँ।  

उपभोक्ता को वस्तु या सेवा के लिए भुगतान की राशि के आधार पर आयोग तय होता है (उपभोक्ता संरक्षण अधिनियम 2019 धारा 34, 35)। 50 लाख तक की कीमत वाले मामलों को जिला आयोग में सुनवाई मिलती है (CPA s.34)। शिकायत दो साल के भीतर दायर करनी होती है, देर के कारण को उचित कारण से माफ़ किया जा सकता है (CPA s.69)।

आगे क्या करें  
1. बिल, वारंटी, स्क्रीनशॉट और विक्रेता के साथ की गई सभी बातचीत इकट्ठा करें।  
2. पहले राष्ट्रीय उपभोक्ता हेल्पलाइन 1915 (8 AM-8 PM) या व्हाट्सएप +91 8800001915 पर संपर्क करके समस्या हल करने की कोशिश करें।  
3. यदि समाधान नहीं मिलता, तो e-Jagriti (e-jagriti.gov.in) पर ऑनलाइन जिला उपभोक्ता आयोग में शिकायत दर्ज करें।  
4. शिकायत दो साल के भीतर दायर करें, जहाँ विक्रेता रहता है या जहाँ आप रहते/काम करते हैं, वह स्थान चुनें (CPA s.34(2))।  
5. शिकायत दायर करने के बाद, आयोग की प्रक्रिया के अनुसार सुनवाई और निर्णय का इंतजार करें।
```

Sources shown by the app: Consumer complaint (defective product, bad service, refund) – [National Consumer Helpline](https://consumerhelpline.gov.in/), [e-Jagriti (consumer commission filing)](https://e-jagriti.gov.in/), [Consumer Protection Act, 2019 – India Code](https://indiacode.gov.in/act/1b6c1754-47b1-411e-9607-1712a9caf368/details), [Section text on India Code (s.34)](https://indiacode.gov.in/items/c4a8f150-07c4-4c24-990e-214f83c1c68c)

Disclaimer shown: “यह कानूनी जानकारी है, कानूनी सलाह नहीं। न्याय साथी वकील नहीं है और आपका केस दायर या आपकी पैरवी नहीं कर सकता; अपने मामले में सलाह के लिए वकील से बात करें – मुफ्त कानूनी सहायता उपलब्ध है। "जाँचा गया" तारीख बताती है कि सरकारी स्रोत आख़िरी बार कब जाँचा गया।”


### Q (English): My husband beats me, what protection order can I get?

*Response type: `emergency`*

```text
If you or someone else is in danger right now, please call 112 (police, fire, ambulance – all India emergency number) immediately.
• Women in distress: Women Helpline 181 (24 hours, toll-free).
• If you are thinking of ending your life or are in deep distress: Tele-MANAS 14416 (free, confidential, 24x7).
You are not alone. Please call now and stay with someone you trust. When you are safe, free legal aid is available on 15100.
```

Sources shown by the app: Domestic violence: protection, residence and money relief – [Domestic Violence Act, 2005 – India Code](https://indiacode.gov.in/act/4311e86f-7d98-40b6-8a80-2195278207cb/details), [Women Helpline 181 – Ministry of WCD](https://wcd.gov.in/offerings/women--helpline--scheme), [Section text on India Code (s.3)](https://indiacode.gov.in/items/c5b4f170-a132-4a40-ae56-506018e6ddaf), [Bharatiya Nyaya Sanhita, 2023 s.85 – India Code](https://indiacode.gov.in/items/9790a4a7-0e3b-4063-bfed-017a3de6cb2b)

Disclaimer shown: “This is legal information, not legal advice. NyayaSaathi is not a lawyer and cannot file a case or represent you; for advice on your case, talk to a lawyer – free legal aid is available. "Checked" dates show when the official source was last verified, not a live check.”


### Q (English): How do I get a divorce?

*Response type: `no_match`*

```text
I only answer from laws and official pages I have checked, and this question is not one of them yet – so I will not guess. Please contact free legal aid: call the NALSA helpline 15100 or go to the District Legal Services Authority (DLSA) of your district. You can also get advice by video through Tele-Law at a Common Service Centre.
```

Disclaimer shown: “This is legal information, not legal advice. NyayaSaathi is not a lawyer and cannot file a case or represent you; for advice on your case, talk to a lawyer – free legal aid is available. "Checked" dates show when the official source was last verified, not a live check.”


### Q (English): Which RTI section gives an answer in 10 days, and what is the RTI helpline number?

*Response type: `answer` · model `openai/gpt-oss-20b` · guard passed*

```text
The checked information does not mention any RTI section that guarantees a response within 10 days.  
The entries also do not provide a helpline number for RTI queries.  

Next steps  
1. Refer to the RTI Act s.6 and s.7 for the standard 30-day (or 48-hour for life/liberty matters) response period.  
2. If you need assistance, consider contacting your local Public Information Officer or the Central Information Commission for guidance.
```

Sources shown by the app: Filing an RTI application – [RTI Online portal (Central)](https://rtionline.gov.in/), [RTI Act, 2005 – India Code](https://indiacode.gov.in/act/37520cf3-5c3f-4c0b-aa4a-5985e6f522bf/details), [Section text on India Code (s.6)](https://indiacode.gov.in/items/822280bc-89b4-4a39-aa10-72163b7c22f6); RTI: no reply or unhappy with the reply (appeals) – [RTI Online portal (Central)](https://rtionline.gov.in/), [RTI Act, 2005 – India Code](https://indiacode.gov.in/act/37520cf3-5c3f-4c0b-aa4a-5985e6f522bf/details), [Section text on India Code (s.19)](https://indiacode.gov.in/items/d4740d94-1ae3-4bb5-b8a8-90f86610e1b7)

Disclaimer shown: “This is legal information, not legal advice. NyayaSaathi is not a lawyer and cannot file a case or represent you; for advice on your case, talk to a lawyer – free legal aid is available. "Checked" dates show when the official source was last verified, not a live check.”


## Knowledge base coverage

RTI application & fee; RTI appeals; FIR / Zero FIR / e-FIR (BNSS s.173); police refusing an FIR (s.173(3), s.173(4), s.175(3)); arrest rights (BNSS s.47, s.48, s.58); free legal aid eligibility (LSA Act s.12, s.13; NALSA income ceilings); Lok Adalat (s.19, s.21); Tele-Law; consumer complaints (CPA 2019 s.34, s.35, s.69; Jurisdiction Rules 2021 – District up to Rs 50 lakh; NCH 1915; e-Jagriti, which integrated e-Daakhil); cyber fraud (1930, cybercrime.gov.in); domestic violence (PWDVA s.3, s.12, s.18–20; BNS s.85, s.86; 181); workplace sexual harassment (POSH Act s.4, s.6, s.9); senior citizens’ maintenance (MWPSC Act s.4, s.5, s.9, s.23; Elderline 14567); maintenance for wife/children/parents (BNSS s.144); unpaid wages (Code on Wages s.17, s.45; in force from 21 Nov 2025); cheque bounce (NI Act s.138, s.142); Maharashtra rent agreements (MRC Act s.55); bank complaints (RBI Integrated Ombudsman, cms.rbi.org.in, 14448); women and child helplines (181, 1098, 112); mental health (Tele-MANAS 14416). Full list with every official source and check date: https://nyayasaathi.sites.tab.bot/kb.html

## Roadmap

* Grow the KB with verified entries (State rent laws, land records, MGNREGA, disability rights, POCSO) with a review workflow for law students or DLSA panel lawyers.
* Voice input/output in Hindi and Marathi for people who cannot type.
* “What to bring to DLSA” checklists per topic; an anonymous “was this wrong?” report that queues the entry for human review.
* Automatic re-check of every KB source URL on a schedule, flagging changed pages for human review.

## Disclosure

Built by Tab, an AI assistant, for team lead Akshay Wagh. The demo video uses synthetic (text-to-speech) narration.
