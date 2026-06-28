# 📸 VaaniAI — Screenshot Gallery

> **Live App:** [https://ai-voice-receptionist-ebon.vercel.app/](https://ai-voice-receptionist-ebon.vercel.app/)

A visual walkthrough of every page in VaaniAI — your AI voice receptionist for clinics and businesses.

---

## 1. Dashboard — Idle State

The main dashboard shows today's call stats at the top: total calls, completed, missed, and average duration. The purple glowing microphone orb sits in the center, ready to start. Recent calls are listed on the right with color-coded status badges.

<img width="1917" height="852" alt="Screenshot 2026-06-28 092427" src="https://github.com/user-attachments/assets/3ec43469-4f83-42c0-9c7f-56446da447d3" />


---

## 2. Dashboard — Charts & Upcoming Appointments

Scroll down on the dashboard to see the **Call Volume bar chart** (last 7 days), the **Intent Breakdown donut chart** (Book Appointment, Cancel, Complaint, Info Request, General), and the **Sentiment Overview** (Positive 40% · Neutral 40% · Negative 20%). Below that, upcoming appointments are listed with doctor name and date.

<img width="1911" height="858" alt="Screenshot 2026-06-28 092445" src="https://github.com/user-attachments/assets/242ebb30-6542-4b76-aa5c-19966218cf8b" />


---

## 3. Call Logs

Every call is logged in a table with caller name, phone number, time, duration, intent, sentiment, status, and an AI-generated summary. Filter by status (Completed / Missed / Escalated) or by sentiment. 11 calls shown, each with view and escalate action buttons.

<img width="1915" height="860" alt="Screenshot 2026-06-28 092517" src="https://github.com/user-attachments/assets/74e757ef-a079-490a-bcf0-123906479507" />


---

## 4. Appointments

Appointments are split into **Upcoming** (4) and **Past** (2). Each row shows patient name, doctor, appointment type (Consultation / Lab Test / Follow-up / Procedure), date & time, and status. Add new appointments with the **+ New Appointment** button, or filter by doctor from the dropdown.

<img width="1912" height="860" alt="Screenshot 2026-06-28 092532" src="https://github.com/user-attachments/assets/bb1ac30e-772c-417a-8348-41f484d0121d" />


---

## 5. Contacts (CRM)

Patient contacts are shown as cards in a grid. Each card has the patient's name, phone, email, a personal note (e.g. *"Senior patient, requires extra care"*), a tag badge (Patient / VIP / New / Followup), call count, and last interaction time. Search, filter by tag, add new contacts, or edit/delete any card.

<img width="1908" height="817" alt="Screenshot 2026-06-28 092547" src="https://github.com/user-attachments/assets/68183ec0-d9b7-440b-b036-f9d485ec23cd" />


---

## 6. Analytics

Five KPI cards at the top: **11 total calls**, **63.6% resolution rate**, **2m 34s avg handle time**, **1 escalation**, **3 missed**. Then: Call Volume over 14 days (bar chart), Weekly Trend (line chart), Hourly Distribution (8AM–7PM), Intent Breakdown (donut), and Sentiment Distribution (36.4% positive · 45.5% neutral · 18.2% negative).

<img width="1912" height="863" alt="Screenshot 2026-06-28 092606" src="https://github.com/user-attachments/assets/01c9aec4-2dcf-42db-a299-8659cee7d465" />


---

## 7. Transcripts

Two-panel layout: left side lists all 9 saved conversations with name, time, intent, and status. Clicking one opens the full conversation on the right. A teal **AI SUMMARY** box at the top gives a one-line summary (e.g. *"Patient booked a consultation with Dr. Sharma for Thursday at 11am"*). The full back-and-forth between Agent and Caller is shown with timestamps. Export button at the bottom.

<img width="1915" height="857" alt="Screenshot 2026-06-28 092643" src="https://github.com/user-attachments/assets/c1f2c43f-2f54-4a09-98a3-acce5a197463" />


---

## 8. Alerts

Notification feed showing **4 unread alerts**. Alert types: Agent Started, Call Escalated, Missed Call, Appointment Reminder, High Call Volume. Each has an icon, description, and timestamp. Unread alerts have a blue dot. **Mark all as read** and **Clear all** buttons at the top.

<img width="1916" height="833" alt="Screenshot 2026-06-28 092658" src="https://github.com/user-attachments/assets/93ad2ae5-0f47-4ed2-861d-e023018da469" />


---

## 9. Voice Config

Configure the AI agent's identity and behaviour. Set the **Agent Name** (Priya) and **Default Language** (English). The **System Prompt** editor lets you write full instructions — including multilingual rules (detect Hindi → reply in Hindi, detect Marathi → reply in Marathi). Quick templates: Medical Clinic, Dental Clinic, General Assistant. **Voice Settings** sliders for Speech Rate, Pitch, Volume, and Max Call Duration (300s).

<img width="1915" height="871" alt="Screenshot 2026-06-28 092733" src="https://github.com/user-attachments/assets/d13e5cae-1393-4f37-a4ad-1689998ca444" />


---

## 10. Settings

Choose your **LLM model** (GPT-4o Mini — fast, cheap). Set **Clinic Information**: name (City Care Hospital), phone (+91 2034415678), opening hours (Mon–Sat 9AM–7PM), address (Thane, Mumbai). Toggle **Notifications**: Email Escalation Alerts (off), Missed Call Alerts (on), Daily Summary Report (off). **Data & Privacy** section at the bottom.

<img width="1907" height="852" alt="Screenshot 2026-06-28 092905" src="https://github.com/user-attachments/assets/fee64888-dbc3-4c66-bc22-e47e0f3ca3f3" />


---

## 11. Dashboard — Agent Active / Live State

When you click **Start Agent**, the orb pulses with a ripple animation. The status badge switches to a green **● Live** dot. The sidebar shows **● Agent Active** in green. A red timer counts up. **Stop Agent** and **Mute** buttons appear. The transcript box shows the AI greeting: *"Hello! Welcome to City General Hospital. I'm Priya, your virtual receptionist. How can I help you today?"*

<img width="1917" height="862" alt="Screenshot 2026-06-28 092924" src="https://github.com/user-attachments/assets/1093fa67-6661-4abf-aec2-cd27665eb314" />


---

## Summary of Pages

| # | Page | What It Does |
|---|------|-------------|
| 1–2 | Dashboard | Live voice orb, today's stats, charts, upcoming appointments |
| 3 | Call Logs | Full call history with intent, sentiment, AI summaries |
| 4 | Appointments | Upcoming & past bookings with doctor details |
| 5 | Contacts | Patient CRM with notes, tags, call history |
| 6 | Analytics | Deep performance insights, trends, distributions |
| 7 | Transcripts | Full conversation history with AI summaries |
| 8 | Alerts | Smart notifications for missed calls, escalations, reminders |
| 9 | Voice Config | Agent name, language, system prompt, voice tuning |
| 10 | Settings | Model selection, clinic info, notification toggles |
| 11 | Live Agent | What the orb looks like when actively handling a call |

---

*VaaniAI — Made by Shraddha Bankar · [GitHub](https://github.com/Shraddha-Bankar/AI_Voice_Receptionist) · [Live Demo](https://ai-voice-receptionist-ebon.vercel.app/)*
