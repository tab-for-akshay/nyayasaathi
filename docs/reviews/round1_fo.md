# Round 1 – Fo (Wajo) on v1

Chat reply and full memo: https://wajo.ai/d/4422bcc9-533f-4f0a-8a9f-84540a3681a7 (public doc by Fo)

Prompt:

Please act as a tough hackathon judge AND a legal-aid lawyer in India. Review this project and give me your top 8 concrete, prioritised improvements (UX, legal accuracy/safety, judging criteria, pitch) that a solo builder can make in the next hour. Be specific; no general praise. You may open the live link.

NyayaSaathi is a hackathon entry (HackIndia "AI for Lawyers", PS-02 Access to Justice: Legal Information Chatbot). Live: https://nyayasaathi.sites.tab.bot/ (knowledge base with sources: https://nyayasaathi.sites.tab.bot/kb.html). It is a plain-language legal-information chatbot for ordinary people in India, in English, Hindi and Marathi. Design: a 20-entry knowledge base (RTI, FIR/Zero FIR, arrest rights, free legal aid, Lok Adalat, Tele-Law, consumer complaints, cyber fraud, domestic violence, POSH, senior citizens maintenance, BNSS s.144 maintenance, unpaid wages, cheque bounce, Maharashtra rent agreements, RBI ombudsman, women/child helplines, Tele-MANAS), every fact checked on official pages (India Code, NALSA, PIB, RBI...) with URL and date. Flow: emergency keyword check (violence/threat/suicide -> fixed message 112/181/14416, no AI) -> LLM router picks <=3 entries -> gpt-oss-120b answers ONLY from those entries -> code guard rejects any section number, 2+-digit number or website not in the entries (one retry, then shows the checked text) -> sources, free-help box (NALSA 15100, DLSA, Tele-Law) and disclaimer rendered from the KB. 25 automated tests.
Two real answers from the live app:
Q: How do I file an RTI and what is the fee?
A: You can ask any public authority for information by writing to its Public Information Officer (PIO). The request can be on paper or electronically, in English, Hindi or the official language of the area (RTI Act s.6(1)). No reason or extra personal details are required beyond what is needed to contact you (RTI Act s.6(2)). The PIO must reply within 30 days (or within 48 hours if the information concerns life or liberty) (RTI Act s.7(1)).

For Central Government offices the application fee is Rs 10 (RTI Rules 2012 rule 3). If you are below the poverty line, you pay no fee by attaching a copy of your BPL certificate (RTI Rules 2012 rule 5). State offices follow their own fee rules.

Next steps
1. Write a short, specific question (state the document or period you need).  
2. Address it to the PIO of the correct office, or file online at rtionline.gov.in for Central offices.  
3. Pay the fee of Rs 10 for Central offices, or attach your BPL certificate if applicable.  
4. Keep the receipt or registration number and count 30 days for the response.
Sources shown: Filing an RTI application https://rtionline.gov.in/ https://indiacode.gov.in/act/37520cf3-5c3f-4c0b-aa4a-5985e6f522bf/details

Q: Police refused to register my FIR about my stolen bike. What can I do?
A: You have the right to have the matter recorded and investigated. If the officer in charge refuses to register your FIR, you may send the details of the incident in writing to the Superintendent of Police (SP) of the district (BNSS s.173(4)). The SP must decide whether the case involves a cognizable offence and, if so, order an investigation. If the SP does not act, you can approach the Magistrate for further action (BNSS s.173(4)).

Next steps
1. Write down the facts of the theft – date, time, place, description of the bike, and note that the police station refused to record the FIR, including the officer’s name if known.
2. Send this written complaint by post to the Superintendent of Police of the district; keep the postal receipt as proof.
3. If the SP does not investigate, file an application before the Magistrate requesting that an investigation be ordered; you can seek free legal aid for drafting this application.
4. You may also call the helpline 15100 for further guidance.
Sources shown: Police refused to register my FIR https://indiacode.gov.in/act/72592ac7-d084-4545-95d3-0c98dc49fac3/details

---

Memo text:

NyayaSaathi: a judge's and a legal-aid lawyer's top 8 fixes · Wajo
Skip to content
Review memo
Prepared with Fo
Made for Tab
Updated 1 Nov 2026
NyayaSaathi: a judge's and a legal-aid lawyer's top 8 fixes
Eight concrete fixes for NyayaSaathi, ordered by what a judge hits first, each under 20 minutes of solo work.
Pixabay
The verdict up front:
the thesis is right and the guard is the differentiator, but a judge’s first three clicks can all land on weak spots: a knowledge-base page that can sit on “Loading…”, answers that bury the action under statutory prose, and no graceful path when the question falls outside your 20 entries. Every fact I could check in your two sample answers survived checking (BNSS s.173(4) is indeed the send-to-SP remedy, and rule 5 does exempt BPL applicants). The fixes below are ordered by what costs you points first; each is doable in 5–20 minutes by one person.
01
The KB page can strand on “Loading…”
a judge’s first click, and mine went blank
02
Answers bury the action
lead with the one thing to do, not s.6(1)
03
Out-of-scope questions need a designed answer
the most-tested path in judging
04
Both demo answers miss the next step that matters
first appeal; FIR copy and the Magistrate route
05
Lock the language, widen the emergency keywords
Hindi and Marathi are promises you must keep
06
Old-code citations must route to the new codes
judges will ask for “CrPC 154”
07
Put provenance inside the answer
date-checked stamp, deep links, print button
08
Make the guard the hero of the pitch
demo the adversarial moment, not a happy path
01
The KB page can strand on “Loading…”
I opened kb.html twice and both reads returned a header, a “Loading…” line and an empty page. If that is a slow fetch it is a bad first impression; if it is a failed fetch of the entries file it is a dead link on the page every judge opens to check your honesty claim. Make it fail-safe: render the entries inline in the HTML (they are static), or add a visible error state with the repo link so a failed fetch never looks like an empty knowledge base.
Do now:
inline the 20 entries server-side (no fetch), or a try/catch that shows “Couldn’t load entries, view them in the repo” with the link.
~15 min.
02
Answers bury the action a person needs today
Your RTI answer opens with two paragraphs of statutory drafting before the reader learns what to do, and the action only appears under “Next steps”. An anxious person and a skimming judge both need the answer in line one. Change the answer prompt: first line states the single key action or right in plain words (“Apply in writing to the PIO; fee Rs 10, answer in 30 days”), then details, then the numbered steps you already have. Bold the deadlines and fees. Keep citations, but move them after the claim they support rather than inside the first sentence.
Do now:
one prompt edit (“First line: the key action in one sentence. Then at most 120 words. Then steps.”) plus a small CSS rule for the steps block.
~15 min.
03
Out-of-scope questions need a designed answer, not an apology
Judges probe boundaries. Ask about a Karnataka rent dispute, a property partition or a tax notice and your router finds no entry: what renders then? This is the path most likely to be tested and the cheapest one to make excellent. Design it as a fixed card from the KB, no AI text: “I only cover the topics listed here, and I won’t guess” + the three free routes (NALSA 15100, your District Legal Services Authority, Tele-Law) with links, plus one line inviting the nearest covered topic. That “won’t guess” line is itself a judging criterion (safety) answered in public.
Do now:
a no-match branch rendering a KB-built card; never let the model free-run on an empty entry set.
~15 min.
04
Both demo answers miss the step that actually moves the user forward
A legal-aid lawyer reads your two showcase answers and spots gaps a judge may too. RTI: after 30 days the answer stops; the real next step is the
first appeal under s.19(1)
, which is what makes the right enforceable, plus how the fee is paid (rule 6: cash against receipt, DD, banker’s cheque, IPO or electronic). FIR: the answer has the s.173(4) SP route right, but omits the
free copy of the FIR (s.173(2))
, the
Zero FIR duty now in s.173(1)
itself (“irrespective of the area where the offence is committed”), and the
Magistrate route under s.175(3)
, where the Supreme Court has said complainants should ordinarily first exhaust the SP step. Your entries have Zero FIR as a separate entry; make the router pull it alongside FIR-refusal so the answer assembles the whole escalation ladder.
Do now:
edit kb.json entries (no code change), add router links between the FIR entries and between RTI and RTI-appeal.
~20 min.
05
Lock the language, and widen the emergency keyword net
Three languages are on the masthead, so judges will type in Hindi and Marathi. Two failure modes to kill: the model answering an Hindi question in English, and section names staying in Latin script (“BNSS s.173(4)” instead of “BNSS धारा 173(4)”). Add a hard instruction: reply in the question’s language, including Act names and the word for section. Second, your emergency bypass runs on keywords; verify the list carries the Hindi and Marathi words a frightened person actually types (मारपीट, धमकी, आत्महत्या, जान; मारहाण, धमकी, आत्महत्या), and transliterated forms (maar peet, atmahatya, dhamki). A missed emergency keyword is the one bug that outweighs everything else on the scorecard.
Do now:
prompt rule plus a keyword list edit; test three questions per language live.
~15 min.
06
Old-code citations must still route to the new codes
Anyone who studied law before 2024 asks in CrPC and IPC terms: “Section 154 CrPC”, “Section 125 CrPC maintenance”, “498A”. If the router matches only BNSS/BNS phrasing, those questions fall through to the out-of-scope card (see 03) and look like ignorance of the law. Add the legacy citations as keywords on the corresponding BNSS/BNS entries, and answer with one bridging clause: “now s.173 of the BNSS (earlier s.154 CrPC)”. It shows the KB is current, which judges will read as competence.
Do now:
keyword strings in kb.json; no structural change.
~15 min.
07
Put provenance inside the answer, not only on the KB page
Your sources block links the Act’s landing page, not the provision. Deep-link to the section on indiacode.gov.in where the site supports it, and stamp every answer “verified against official sources on
<date>
”. Add a Print/Save button (window.print with a clean print stylesheet): an ordinary user’s realistic next move is carrying a printed page to the DLSA or the police station, and judges reward a design that ends in the real world. A small “Was this wrong? Tell us” line closes the feedback loop without a backend.
Do now:
per-entry section links, a rendered date stamp, one print button.
~15 min.
08
Make the guard the hero of the pitch, not a footnote
Twenty curated entries and a router are things other teams have; a guard that blocks invented law is not. Structure the demo around the adversarial moment: ask a question baiting a fabricated section number or an unofficial URL, show the guard catching it, then show the fallback serving the checked text. In the README, lead with “25/25 automated tests passing” and a short “try this to break it” list (a fake section, a non-KB helpline, an out-of-scope topic, a mixed-language emergency). Close the one-line impact story: these 20 entries are the 20 questions legal-aid desks answer most, so the product is sized to the actual front line of access to justice, not to a database fantasy.
Do now:
README edits plus the trick-question list on the landing page; re-cut the demo video only if you have 20 spare minutes, otherwise show the trick live.
~15 min.
What I checked before writing this: the live app, the repo, and the two legal claims against current commentary on BNSS s.173 and the RTI Rules 2012 (rule 5 exempts a BPL applicant from fees under both rule 3 and rule 4, so your answer can even say copies come free). Your citations held. The risk was never in what you verified; it is in the three clicks a judge makes before reaching your best answer.
Sources
NyayaSaathi live app
NyayaSaathi repository
RTI Rules 2012, rule 5 (BPL exemption)
BNSS section 173: FIR registration law
Remedies for FIR refusal under BNSS, s.173(4) and s.175(3)
Pixabay
Prepared with Fo · Wajo
Made for Tab
