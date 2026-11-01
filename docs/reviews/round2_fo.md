# Round 2 – Fo (Wajo) on v2 (tested live)

Full memo: https://wajo.ai/d/3892803c-eb88-49d7-85f5-5eb7f2fad447

Chat summary:

Tested the live app end to end. Full review here (anyone with the link can open it; say the word to make it private): https://wajo.ai/d/3892803c-eb88-49d7-85f5-5eb7f2fad447

The six, worst first:

Emergency bypass hides your substance. "My husband beats me, what protection order can I get?" gets only the emergency card and a link. The s.18/19/20 relief info never shows. Fix: render the matched entry's key points as a static block under the helpline numbers. No AI, so the no-AI guarantee holds.
Three citations legally wrong or shaky. (a) Rule 6 lists demand draft/banker's cheque, not an unqualified "cheque"; (b) "any FIR copy free" overreaches, s.173(2) covers the informant's copy; (c) the affidavit sits in s.175(3) itself, not "under s.173(4)". I couldn't open India Code from here, so verify (c) against your own BNSS text.
Language switch is half-done. After हिंदी, three of four trick cards, the guard footer and all existing answers stay English. Translate the trick cards and re-render the chrome on switch.
Section deep links aren't section-accurate. s.173(4) and s.173(1)-(2) labels point to the same India Code item, and your own KB admits the s.58 item shows s.59. Relabel or get per-section ids; one bad click undoes the trust story.
The flagship RTI answer drops what the KB holds. No 30-day first-appeal window, no 48-hour life-or-liberty rule, while the 10-day trick answer states both. Add the two clauses to the RTI skeleton.
Disclaimer scope. Add one line: not a lawyer, can't file or represent you, and "checked 2026-11-01" is the KB build date, not a live check.

What held up live: the 10-day bait was refused correctly, 154 CrPC routed to BNSS s.173/175, the Hindi threat bypassed, divorce got the out-of-scope card.

---

Memo text:

NyayaSaathi v2 – round 2 review · Wajo
Skip to content
NyayaSaathi
Prepared with Fo
Made for Tab
Updated 1 Nov 2026
NyayaSaathi v2 – round 2 review
Six remaining problems from a live re-test of v2, prioritised, each with a 15-minute fix.
Law books and a gavel on a study desk. ·
Pixabay
Round 2, tested against the running app rather than the write-up: the four trick cards, a typed domestic-violence question, a language switch, and the full knowledge base. Six problems remain, in priority order, each fixable in 15 minutes. The top one matters most because it hits the exact user the product exists for.
01
The emergency bypass strips the substance out of the questions it fires on
Live test: “My husband beats me. What protection order can I get from the court?” returned only the emergency card plus a “Related information” link to the DV entry. No s.18 protection order, no s.19 residence order, no s.20 monetary relief, nothing. For a survivor whose danger is this week rather than this minute, the app’s most useful content is unreachable by keyword, and the DV entry is general legal information that is safe to show.
START HERE
Show the matched entry under the emergency card
When the bypass fires and the router matched entries, append that entry’s key points as a static block under the helpline numbers, rendered from the KB like every other answer. No AI runs, so the no-AI guarantee holds. The “Related information” box already proves you hold the entry at that moment; show it, not just link it.
02
Three citations are legally wrong or shaky
Rule 6 fee modes.
The RTI answer lists “cash, demand draft, cheque, PO, or electronic”. Rule 6 lists demand draft or
banker’s
cheque; an unqualified “cheque” overstates, because a personal cheque is not a listed mode. Fix: “demand draft, banker’s cheque, Indian Postal Order, or electronically”.
FIR copy.
“A copy of any FIR you obtain is free (s.173(1), s.173(2))” overreaches. Section 173(2) obliges the free copy
to the informant
; a copy sought later by someone else, or a certified copy, is not covered. Fix: “you must be given a free copy of your FIR as the informant (s.173(2))”.
Affidavit citation.
The KB says the Magistrate route runs “on your application supported by an affidavit under s.173(4)”. The affidavit requirement sits in s.175(3) itself (the codified Priyanka Srivastava rule), so “under s.173(4)” looks like a mis-cite. I could not open India Code from here to read the exact text, so verify it against the BNSS source you already hold before judging day and fix the cite if confirmed.
All three are one-line text edits in the KB plus a rebuild.
03
The language switch is half-done
Live: after switching to हिंदी, the chrome translated (welcome, chips, disclaimer, how-it-works), but three of the four “Try to break it” cards stayed English, and the existing answer cards, their “Law and official sources” headings, the free-help box and the guard footer all stayed English. A judge who taps हिंदी mid-demo sees a bilingual page. Keeping earlier answers in the language they were asked in is correct; the frame around them is not.
15-minute fix:
translate the four trick-card labels in the language file, and on language change re-render the answer-card chrome (badges, headings, footer) from the same stored data, or show a one-line notice that earlier answers remain in the language they were asked in.
04
The “Section text” deep links are not all section-accurate
In the live FIR answer, the labels “Section text – India Code (s.173(4))” and “Section text – India Code (s.173(1)-(2))” point to the same India Code item id, so at least one label is wrong. Your own KB note already admits the s.58 section item shows s.59 text. These links are your trust mechanism; one wrong click in a demo undoes the whole “checked” story.
15-minute fix:
either locate the per-section item ids on India Code for every cited section, or relabel honestly: “BNSS full text – see s.173(4)” linking the full-act bitstream you already cite, keeping the honest per-entry note where a section item is missing.
05
The flagship RTI answer drops the deadlines the KB holds
The RTI answer ends “prepare to file a first appeal (RTI Act s.19)” with no 30-day window, and never mentions the 48-hour life-or-liberty rule, even though both sit in the KB and the 10-day trick answer states both. Two live answers disagreeing on what the law says is exactly what a judge probes.
15-minute fix:
add the two clauses to the RTI entry’s answer skeleton: “48 hours where the information concerns life or liberty (s.7(1))” and “file the first appeal within 30 days of the deadline expiring or of the decision (s.19(1))”.
06
The disclaimer is missing its scope line
“Legal information, not legal advice” is right but thin for an AI-for-Lawyers track. Nothing says the app is not a lawyer, cannot represent or file for you, and that every “checked on official page: 2026-11-01” stamp is the date the knowledge base was built, not a per-question live check.
15-minute fix:
one added line in the banner, translated in all three languages: “NyayaSaathi is not a lawyer, cannot file or represent you, and shows information as checked when its knowledge base was last built.”
07
What held up live
The fake 10-day RTI section was refused correctly, with the 30-day and 48-hour facts and an honest “no RTI helpline in my sources”. The 154 CrPC question routed to BNSS s.173 and s.175 with the SP and Magistrate remedies. The Hindi threat “पति धमकी दे रहा है” bypassed to emergency numbers. Divorce returned the static out-of-scope card with the 20-topic list. The RTI fee, BPL exemption and 30-day reply period, and the BNSS s.173(4) SP route, match the statutes.
Sources
NyayaSaathi live app (tested 2026-11-01)
NyayaSaathi knowledge base
BNSS 2023, s.173, s.175 – India Code
RTI Rules 2012, rules 3–6
RTI Act 2005, s.7 and s.19 – India Code
Pixabay
Prepared with Fo · Wajo
Made for Tab
