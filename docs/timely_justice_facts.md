# Timely Justice facts (checked 2026-11-01 on official pages) — for the Code for a Billion adaptation

Use ONLY these facts. Every number, section and URL below was read on the official page on 1 Nov 2026.

## A. Permanent Lok Adalat (public utility services) — new KB entry id `permanent_lok_adalat`
Source 1: Legal Services Authorities Act, 1987 (consolidated text, Govt PDF) https://cdnbbsr.s3waas.gov.in/s32e45f93088c7db59767efef516b306aa/uploads/2025/04/202504081796627129.pdf
- s.22A(b): "public utility service" means transport of passengers or goods by air, road or water; postal, telegraph or telephone service; supply of power, light or water to the public; public conservancy or sanitation; service in a hospital or dispensary; insurance service (plus any service a government notifies).
- s.22C(1): any party may apply to the Permanent Lok Adalat BEFORE the dispute is brought before any court; it has no jurisdiction over an offence that is not compoundable under any law.
- s.22C(2): after applying, no party may take the same dispute to any court.
- s.22C(8): if the parties do not agree, the Permanent Lok Adalat itself decides the dispute (if it does not relate to any offence).
- s.22E: its award is final and binding, is deemed a decree of a civil court, cannot be questioned in any original suit, application or execution proceeding, and can be sent to the civil court to execute.
Source 2: NALSA, Permanent Lok Adalat page https://nalsa.gov.in/permanent-lok-adalat/
- "The jurisdiction of the Permanent Lok Adalats is upto Rs. One Crore." (The Act's limit can be raised by Central Government notification, s.22C(1).)
- It is a compulsory pre-litigative mechanism for conciliation and settlement of public utility disputes.
Keywords: electricity bill, power bill, water bill, bus, railway, airline, courier, post, telephone, mobile bill, hospital bill, insurance claim, बिजली बिल, बीमा, विमा, वीज बिल, public utility.
Steps: 1) Write a short application to the Permanent Lok Adalat at your District Legal Services Authority (or call 15100 to find it). 2) Attach the bill/policy/receipts. 3) Attend the conciliation; if no settlement, it decides. 4) Do not file the same dispute in a court after applying.
Sections: "LSA Act s.22A", "LSA Act s.22C", "LSA Act s.22E". Helplines: ["15100"].
Links: NALSA Permanent Lok Adalat page; India Code LSA Act https://indiacode.gov.in/act/253a0a32-48bd-447f-923b-a0eb49d108ee/details

## B. Pre-litigation mediation — new KB entry id `prelitigation_mediation`
Source: The Mediation Act, 2023 (No. 32 of 2023), Gazette of India https://egazette.gov.in/WriteReadData/2023/248775.pdf
- s.5(1): before filing any civil or commercial suit or proceeding in any court, the parties may voluntarily and with mutual consent try to settle the dispute by pre-litigation mediation under this Act (commercial disputes of Specified Value follow s.12A of the Commercial Courts Act, 2015).
- s.18(1): mediation must be completed within 120 days from the date fixed for the first appearance before the mediator.
- s.18(2): the parties may agree to extend it by a further period of not more than 60 days.
Keywords: mediation, mediator, settle before court, pre-litigation, out of court settlement, मध्यस्थता, मध्यस्थी, family dispute settlement, property dispute settlement, neighbour dispute.
Steps: 1) Both sides agree to try mediation. 2) Approach the mediation centre of your District Legal Services Authority or court (call 15100 to locate it). 3) Attend; it should finish in 120 days (+ up to 60 days if both agree). 4) If it fails you can still go to court.
Sections: "Mediation Act 2023 s.5", "Mediation Act 2023 s.18". Helplines: ["15100"].
Links: the Gazette PDF above.

## C. Update existing entry `lok_adalat` (append one fact, one source, two keywords)
Source: NALSA letter "National Lok Adalat Schedule-2026" https://cdnbbsr.s3waas.gov.in/s3f8df2e15374e3dc37766e59ac494f0fd/uploads/2026/01/202601221103944766.pdf
- Fact to add: "NALSA's 2026 schedule lists four National Lok Adalats; the fourth is on 12 December 2026 (ask your DLSA or call 15100 for your district's date)."
- Keywords to add: "national lok adalat", "traffic challan".

## D. UI: Timely Justice chips
In site/app.js add these to each language's chips (keep existing ones):
- EN: "My electricity bill dispute: can I avoid going to court?", "Can we settle our dispute through mediation before court?", "When is the next National Lok Adalat?"
- HI: "बिजली बिल का विवाद: क्या कोर्ट जाए बिना हल हो सकता है?", "क्या कोर्ट से पहले मध्यस्थता से समझौता हो सकता है?", "अगली राष्ट्रीय लोक अदालत कब है?"
- MR: "वीज बिलाचा वाद: कोर्टात न जाता सुटू शकतो का?", "कोर्टात जाण्यापूर्वी मध्यस्थीने तडजोड होऊ शकते का?", "पुढील राष्ट्रीय लोक अदालत कधी आहे?"

## E. Docs
README: add a section "Code for a Billion: Timely Justice track" explaining the settle-faster routes (Lok Adalat, Permanent Lok Adalat, pre-litigation mediation), that the KB now has 22 entries, and that this adaptation was built in AgentFoundry (AF), the official IDE. Keep the line "Built by Tab, an AI assistant, for team lead Akshay Wagh."
