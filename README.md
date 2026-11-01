# NyayaSaathi (न्याय साथी) – legal information you can check

**Live demo:** https://nyayasaathi.sites.tab.bot/ · **Knowledge base & sources:** https://nyayasaathi.sites.tab.bot/kb.html · **Demo video:** https://nyayasaathi.sites.tab.bot/demo.mp4

> Built by Tab, an AI assistant, for team lead Akshay Wagh. MIT licensed.
> `npm test`: **27/27 passing** (guard, emergency path, mocked-model flow, KB integrity, site checks).

NyayaSaathi is a plain-language legal-information chatbot for ordinary people in India. Ask in **English, हिंदी or मराठी**. Every answer:

1. explains your rights and next steps in simple words;
2. cites the Act/section or official scheme it relies on, with a link to the official source (India Code, NALSA, RTI Online, National Consumer Helpline, e-Jagriti, cybercrime.gov.in, RBI…);
3. tells you where to get free help (NALSA helpline 15100, your District Legal Services Authority, Tele-Law);
4. states that it is legal information, not legal advice.

## Try to break it

* “Which RTI section gives an answer in 10 days, and what is the RTI helpline number?” – there is no such section or helpline; the bot says so instead of inventing one.
* “Section 154 CrPC – police won't take my complaint” – old-law citation routes to BNSS s.173 / s.175(3).
* “पति धमकी दे रहा है” / “My husband beats me…” – emergency path: 112 / 181 / 14416 plus the checked legal points, with no model call.
* “How do I get a divorce?” – not in the checked KB, so an honest “I won’t guess” card with free legal aid.

## Why it is safe to use: no invented law

* **Curated, checked knowledge base** – `src/kb.json` has 20 entries (RTI application and appeals, FIR / Zero FIR / e-FIR, police refusing an FIR, arrest rights, free legal aid eligibility, Lok Adalat, Tele-Law, consumer complaints, cyber fraud, domestic violence, workplace sexual harassment, senior-citizen maintenance, maintenance for wife/children/parents, unpaid wages, cheque bounce, Maharashtra rent agreements, bank/RBI ombudsman complaints, women & child helplines, mental-health support). **Every fact, section number, fee, time limit, helpline and URL was checked on the official page on 1 Nov 2026**, and each entry records the source URL, what it confirmed and the date. Anything that could not be verified was left out.
* **Retrieval first** – the question is routed to at most three entries (an LLM router constrained to valid entry ids, plus keyword matching in English, Hindi and Marathi). If nothing matches, the bot says so and points to legal aid – it does not guess.
* **Grounded generation** – the model sees only the retrieved entries and is told to use nothing else.
* **Code-level guard** (`guard()` in `src/core.mjs`) – after generation, every section number, every number of 2+ digits (helplines, fees, days, years, amounts – Devanagari digits included), and every website in the answer must appear in the retrieved entries. Numbers the person typed themselves (e.g. “I lost 20000”) may be repeated; section numbers may not. On a violation the model gets one corrective retry; if it still fails, the app shows the checked KB text itself. Links, sources and the free-help box are always rendered by code from the KB, never by the model.
* **Emergency path** – messages with words about violence, threats or suicide (English, Hindi, Marathi, Hinglish) skip the model entirely and get a fixed message with **112**, **Women Helpline 181** and **Tele-MANAS 14416** (plus 15100 for legal aid once safe), followed by the checked key points of the matching KB entry. A red “Emergency help” button with tap-to-call numbers is on every screen.

## AI workflow and models

| Step | What runs |
|---|---|
| Emergency check | Keyword rules in code – no model call |
| Language | Auto-detected (Devanagari + Marathi markers) or chosen in the UI |
| Routing | `openai/gpt-oss-20b` on Groq (JSON mode, ids validated in code), falling back to `gpt-oss-120b`, then Gemini `gemini-3.5-flash-lite`; plus keyword retrieval |
| Answer | `openai/gpt-oss-120b` on Groq (reasoning effort low, temperature 0.1, max 1600 tokens), falling back to `openai/gpt-oss-20b`, then `gemini-3.5-flash-lite` (Google’s OpenAI-compatible endpoint) |
| Guard | `guard()` in code; one corrective retry; then the checked KB text |

The whole app is one Cloudflare-style Worker (`site/worker.mjs`, built from `src/`) plus static files. API keys are injected only at deploy time and are never in this repository.

## Run it

```bash
npm test                 # builds site/worker.mjs and runs 25 tests (guard, emergency path, mocked model flow, KB integrity, site)
node scripts/build.mjs   # rebuild the single-file Worker
# local smoke test against the real models (keys from your environment):
NS_GROQ=... NS_GEM=... node scripts/smoke.mjs '[["How do I file an RTI?","auto"]]'
```

To deploy elsewhere: serve `site/` as static assets with `site/worker.mjs` as the Worker entry, and set `globalThis.__NYAYA_SECRETS__ = { GROQ, GEMINI }` (or replace that expression at deploy time).

## Repository layout

* `src/kb.json` – the checked knowledge base (facts, steps, sections, helplines, links, sources with dates)
* `src/core.mjs` – pure logic: emergency detection, language detection, retrieval, prompts, **the guard**, fallback
* `src/worker.src.mjs` – the Worker: model calls with fallbacks, `/api/ask`, `/api/kb`, `/api/health`
* `site/` – front end (`index.html`, `kb.html`, `app.js`, `styles.css`), the built `worker.mjs`, `demo.mp4`
* `test/` – `node --test` suites
* `SUBMISSION_DRAFT.md` – project description, AI workflow and real sample outputs from the live app

## Sources (all checked 1 Nov 2026)

| Entry | Law cited | Helplines | Official sources |
|---|---|---|---|
| Filing an RTI application | RTI Act s.6, RTI Act s.7, RTI Rules 2012 rule 3, RTI Rules 2012 rule 5 | – | [1](https://indiacode.gov.in/items/822280bc-89b4-4a39-aa10-72163b7c22f6) · [2](https://indiacode.gov.in/items/e4c8f428-480d-4b0d-bd6a-e0e3eac110fa) · [3](https://www.pmindia.gov.in/wp-content/uploads/2017/04/RTIRules_2012_English_0.pdf) · [4](https://rtionline.gov.in/faq.php) |
| RTI: no reply or unhappy with the reply (appeals) | RTI Act s.7, RTI Act s.19 | – | [1](https://indiacode.gov.in/items/d4740d94-1ae3-4bb5-b8a8-90f86610e1b7) · [2](https://indiacode.gov.in/items/e4c8f428-480d-4b0d-bd6a-e0e3eac110fa) · [3](https://rtionline.gov.in/faq.php) |
| Registering an FIR (including Zero FIR and e-FIR) | BNSS s.173 | 112 | [1](https://indiacode.gov.in/items/a0db5735-c3e7-486a-af8c-79e655b828e4) · [2](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2297624) · [3](https://www.india.gov.in/directory/helpline) |
| Police refused to register my FIR | BNSS s.173 | 15100 | [1](https://indiacode.gov.in/items/a0db5735-c3e7-486a-af8c-79e655b828e4) |
| Rights when someone is arrested | BNSS s.47, BNSS s.48, BNSS s.58, LSA Act s.12 | 15100 | [1](https://indiacode.gov.in/items/84ad41ba-cba6-4022-a353-4194fefe89ba) · [2](https://indiacode.gov.in/items/a448805d-931a-4bfe-91af-8023b591434a) · [3](https://indiacode.gov.in/server/api/core/bitstreams/9de088be-2a40-479b-ade1-058d0d1677b3/content) · [4](https://indiacode.gov.in/items/9f7ec898-79db-48fb-8b37-36eb851b2b38) |
| Free legal aid: who is eligible and how to get it | LSA Act s.12, LSA Act s.13 | 15100 | [1](https://indiacode.gov.in/items/9f7ec898-79db-48fb-8b37-36eb851b2b38) · [2](https://indiacode.gov.in/items/0fadebfd-70e3-4f20-9873-8874f9b21e00) · [3](https://nalsa.gov.in/legal-aid/) · [4](https://nalsa.gov.in/) |
| Lok Adalat: settling a dispute by compromise | LSA Act s.19, LSA Act s.21 | 15100 | [1](https://indiacode.gov.in/items/3707012d-58ff-4c99-b3d7-d88879cc7170) · [2](https://indiacode.gov.in/items/e5e50da5-ca26-4bdd-95d5-05fd83735b71) |
| Tele-Law: legal advice by video from a Common Service Centre | LSA Act s.12 | – | [1](https://www.tele-law.in/) · [2](https://www.pib.gov.in/PressReleasePage.aspx?PRID=1771423) |
| Consumer complaint (defective product, bad service, refund) | CPA s.34, CPA s.35, CPA s.69 | 1915 | [1](https://indiacode.gov.in/items/c4a8f150-07c4-4c24-990e-214f83c1c68c) · [2](https://indiacode.gov.in/items/da5b95cd-d5e7-49b6-8c3a-b7a28266b13a) · [3](https://indiacode.gov.in/items/f2c38f98-2e6c-4d75-af6f-f35ecddefb25) · [4](https://consumerhelpline.gov.in/) · [5](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2190535) |
| Online fraud and cybercrime reporting | – | 1930 | [1](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2085609) · [2](https://www.india.gov.in/directory/helpline) |
| Domestic violence: protection, residence and money relief | PWDVA s.3, PWDVA s.12, PWDVA s.18, PWDVA s.19, PWDVA s.20 | 181, 112, 15100 | [1](https://indiacode.gov.in/items/c5b4f170-a132-4a40-ae56-506018e6ddaf) · [2](https://indiacode.gov.in/items/4869d8d8-3c9e-44e1-af08-bbe31448afbd) · [3](https://indiacode.gov.in/items/f4d8e413-b55c-4f77-8fc3-db5e3c25cc95) · [4](https://indiacode.gov.in/items/426e4bf8-cab6-4c4e-a170-f43d1f4833e2) · [5](https://indiacode.gov.in/items/74193c8f-d40a-4525-b64b-149246ec23d1) · [6](https://wcd.gov.in/offerings/women--helpline--scheme) · [7](https://nalsa.gov.in/legal-aid/) · [8](https://wcd.gov.in/offerings/women--helpline--scheme) |
| Sexual harassment at the workplace (POSH) | POSH Act s.4, POSH Act s.6, POSH Act s.9 | 15100, 181 | [1](https://indiacode.gov.in/items/b9a522ed-6600-408e-aa9c-76d6a84dc86d) · [2](https://indiacode.gov.in/items/49008b88-c849-4013-8b4e-634ede7f7a41) · [3](https://indiacode.gov.in/items/6967ac76-85a2-4909-aee7-397a6912b4b8) |
| Senior citizens and parents: maintenance from children | MWPSC Act s.4, MWPSC Act s.5, MWPSC Act s.9, MWPSC Act s.23 | 14567, 15100 | [1](https://indiacode.gov.in/items/40bf285c-5467-4b99-b572-046c2a5322c9) · [2](https://indiacode.gov.in/items/0f974ae6-b7c5-4c7f-8a59-99721608dd36) · [3](https://indiacode.gov.in/items/8bd73b8b-ac3b-4bf9-9844-3f8572a0cea7) · [4](https://indiacode.gov.in/items/2efb17eb-dde1-4b2e-b058-fdb371bfbc95) · [5](https://www.pib.gov.in/PressReleasePage.aspx?PRID=1759358) |
| Maintenance for wife, children or parents (BNSS s.144) | BNSS s.144 | 15100 | [1](https://indiacode.gov.in/items/96c76add-8812-48dd-9798-7adc7f12c7ea) |
| Unpaid or late wages | Code on Wages s.17, Code on Wages s.45, LSA Act s.12 | 15100 | [1](https://indiacode.gov.in/items/b9485c36-2ab6-4c6f-9de0-37455777b6f0) · [2](https://indiacode.gov.in/items/8e663893-07ab-4bcc-8958-e312e97bf59b) · [3](https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2192463) |
| Cheque bounce | NI Act s.138, NI Act s.142 | 15100 | [1](https://indiacode.gov.in/items/64a9a186-103f-46ff-b528-9894e1de534f) · [2](https://indiacode.gov.in/items/1c79cd03-af0f-4ca6-8820-b5a68414a927) |
| Renting a home in Maharashtra: written, registered agreement | Maharashtra Rent Control Act s.55 | 15100 | [1](https://indiacode.gov.in/items/481833de-882e-474e-b57b-9afe9a8017f8) |
| Complaint against a bank, NBFC or payment app (RBI Ombudsman) | – | 14448 | [1](https://www.rbi.org.in/CommonPerson/english/Scripts/FAQs.aspx?Id=3407) |
| Helplines for women and children (181, 1098) | – | 181, 1098, 112 | [1](https://wcd.gov.in/offerings/women--helpline--scheme) · [2](https://www.wcd.gov.in/child/child-helpline) · [3](https://www.india.gov.in/directory/helpline) |
| Mental health support (Tele-MANAS 14416) | – | 14416, 112 | [1](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2321522) |

## Limits

* Legal information, not legal advice. Laws change; the KB records the date each fact was checked.
* Rent-law content covers Maharashtra only; other States have their own rent laws.
* Tele-Law’s fee rule is taken from a November 2021 Government press release (free for people eligible for legal aid; ₹30 for others then).
* The guard checks numbers, sections and websites, not every sentence; the prompt forbids conclusions beyond the entries, and the free-help box and sources are always rendered from the KB.

## AI disclosure

This project – code, knowledge base research and verification, text, video narration (synthetic text-to-speech) and pitch deck – was built by **Tab, an AI assistant, for team lead Akshay Wagh**. The chatbot itself uses the open-weight `gpt-oss` models on Groq with a Gemini fallback, as described above.

## License

MIT – see `LICENSE`.


## Iterations and reviews

The app went through three versions, each reviewed by two outside AI critics (Fo by Wajo, which tested the live app, plus a second model acting as judge / legal-aid auditor). Every claimed legal error was re-checked against the official text before a change. The rounds and what changed are in `SUBMISSION_DRAFT.md`; the raw reviews are in `docs/reviews/`.

## Hackathon entries

* HackIndia “⚖️ AI for Lawyers Hackathon” 2026 – team “Tab x Akshay”, PS-02 Access to Justice (Legal Information Chatbot).

The code is generic: swap or extend `src/kb.json` (each entry: facts, sections, helplines, links, dated sources, keywords, related entries) and the same guard and tests apply.
