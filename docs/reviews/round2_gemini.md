# Round 2 – second critic (Google gemini-3.5-flash) KB legal-accuracy audit on v2

Outcome: consumer-jurisdiction error confirmed on PIB (30 Dec 2021) and fixed; BNSS s.173(3) and BNS s.85/86 added after checking the official texts; the claim that the cheque-bounce fact was wrong was rejected (the KB quotes NI Act s.138 exactly). Output was cut off by the model's length limit.

---

### 1. Facts That Are Wrong or Outdated

* **Cheque Bounce Validity (`cheque_bounce`)**
  * **Quote:** *"presented within six months of its date or within its validity period, whichever is earlier"*
  * **Correct Position:** Cheque validity in India is **3 months** from the date of issue, not 6 months (RBI Directive DBOD.AML BC. No. 47/14.01.001/2011-12 w.e.f. April 1, 2012). Presenting a cheque after 3 months renders it stale and invalid for prosecution under Section 138 of the Negotiable Instruments Act, 1881.

* **Consumer Court Pecuniary Jurisdiction (`consumer_complaint`)**
  * **Quote:** *"Under the Act the District Commission hears complaints where the value paid does not exceed Rs 1 crore..."*
  * **Correct Position:** The pecuniary limit for the District Consumer Disputes Redressal Commission is **up to ₹50 Lakhs** (Rule 3, Consumer Protection (Jurisdiction of the District Commission, State Commission and National Commission) Rules, 2021), reduced from the ₹1 Crore threshold originally set in Section 34 of the 2019 Act.

* **Live Answer 2 Title / Keyword Mapping (`fir_refused`)**
  * **Quote:** *"Police refused to register my FIR, section 154 CrPC"*
  * **Correct Position:** CrPC 1973 was repealed by Section 531 of the Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) on 1 July 2024. The correct statutory provision for FIR registration is **BNSS Section 173**, not CrPC Section 154.

---

### 2. Dangerous Omissions

* **BNSS 14-Day Preliminary Inquiry (`fir_zero`, `fir_refused`)**
  * **Omission:** Fails to inform users that under **BNSS s. 173(3)**, for cognizable offences punishable by 3 to 7 years imprisonment, police are permitted to conduct a preliminary inquiry within 14 days (with prior approval of a Senior Officer) before registering an FIR. 
  * **Harm:** Victims may assume police refusal or inaction when officers are lawfully conducting a s. 173(3) inquiry.

* **Criminal Remedies for Domestic Cruelty (`domestic_violence`)**
  * **Omission:** Focuses exclusively on civil remedies under PWDVA 2005 while omitting criminal prosecution for cruelty by husband/in-laws under **BNS s. 85 & s. 86** (replacing IPC s. 498A).
  * **Harm:** A victim facing physical danger might seek civil protection orders without knowing they can pursue immediate criminal proceedings and arrest under the BNS.

* **Strict Statutory Deadlines for Cheque Bounce (`cheque_bounce`)**
  * **Omission:** Omits explicit warnings that missing the **30-day window** to issue a legal notice (from receipt of bank memo) or missing the **1-month court filing deadline** (after the 15-day notice period ends) completely forfeits criminal remedies under NI Act s. 138 / s. 142.
  * **Harm:** Litigants frequently lose their right to file due to strict limitation periods.

* **Designated Authority for Wage Claims (`wages_unpaid`)**
  * **Omission:** Omits that claims under **Code on Wages, 2019 (s. 45)** must be filed before the designated administrative "Authority," not directly before regular Labour Courts or Civil Courts.
  * **Harm:** Employees may file in wrong forums, leading to dismissed petitions and wasted limitation periods.

---

### 3. Helplines & URLs Audit

* **Helplines:** All active helplines (`112`, `15100`, `1915`, `1930`, `181`, `14567`, `14448`, `1098`, `14416`) are accurate and active as of November 2026.
* **URLs:** All portal links (`rtionline.gov.in`, `cybercrime.gov.in`, `e-jagriti.gov.in`, `cms.rbi.org.in`, `telemanas.mohfw.gov.in`) are valid.
* **Minor Issue:** The link `https://wcd.gov.in/offerings/women--helpline--scheme` uses non-standard double hyphens; enforce URL normalization to prevent 404 errors.

---

### Top 5 Highest-Value Fixes for Product

1. **Auto-Map Legacy to New Criminal Codes:** Dynamic header translation mapping legacy terms to active statutes (e.g., "CrPC 154" $\rightarrow$ "BNSS s.