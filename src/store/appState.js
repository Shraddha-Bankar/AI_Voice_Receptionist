// ─── Global State ────────────────────────────────────────────────────────────
import { PAGES, MOCK_CALLS, MOCK_APPOINTMENTS, MOCK_CONTACTS, MOCK_NOTIFICATIONS } from '../utils/constants.js';
export const AppState = {
  currentPage: PAGES.DASHBOARD,
  calls: [...MOCK_CALLS],
  appointments: [...MOCK_APPOINTMENTS],
  contacts: [...MOCK_CONTACTS],
  notifications: [...MOCK_NOTIFICATIONS],
  voiceActive: false,
  activeCallId: null,
  liveTranscript: '',
  liveTranscriptFull: [],
  settings: {
    agentName: 'Priya',
    language: 'en',
    voicePersona: 'priya',
    openrouterKey: '',
    model: 'openai/gpt-4o-mini',
    systemPrompt: `You are Priya, a warm and professional AI voice receptionist for City General Hospital, Nagpur.

LANGUAGE RULES — MOST IMPORTANT:
- Detect which language the user is speaking and ALWAYS reply in that SAME language.
- User speaks English  → reply in English
- User speaks Hindi    → हिंदी में जवाब दें (reply in Hindi)
- User speaks Marathi  → मराठीत उत्तर द्या (reply in Marathi)
- Keep EVERY reply SHORT — maximum 2–3 sentences. This is a voice call.

HOSPITAL INFORMATION:
- Name: City General Hospital, Nagpur
- OPD Hours: Monday–Saturday, 8:00 AM to 8:00 PM
- Emergency: 24/7 available
- Phone: +91-712-2345678
- Departments: Cardiology, Orthopedics, Pediatrics, Gynecology, General Medicine, Neurology, Dermatology, ENT
- Consultation fee starts at ₹500

APPOINTMENT BOOKING — collect details in this exact order, one at a time:
1. Patient full name
2. Age
3. Department or type of doctor needed
4. Preferred date
5. Preferred time slot
6. Contact phone number
After collecting all 6, confirm everything aloud and say: Your appointment has been booked successfully.

RULES:
- Never give a medical diagnosis.
- If the user asks to speak to a human, say you will transfer them right away.
- Be empathetic, patient, and never rush the caller.`,
    maxCallDuration: 300,
    autoEscalate: true,
    ttsRate: 1.0,
    ttsPitch: 1.0,
    ttsVolume: 1.0,
  },
  _listeners: [],
  subscribe(fn) {
    this._listeners.push(fn);
    return () => { this._listeners = this._listeners.filter(l => l !== fn); };
  },
  notify() {
    this._listeners.forEach(fn => fn(this));
  },
  navigate(page) {
    this.currentPage = page;
    this.notify();
  },
  updateSettings(patch) {
    this.settings = { ...this.settings, ...patch };
    this.notify();
  },
  addCall(call) {
    this.calls.unshift(call);
    this.notify();
  },
  addAppointment(appt) {
    this.appointments.unshift(appt);
    this.notify();
  },
  addContact(contact) {
    this.contacts.unshift(contact);
    this.notify();
  },
  markNotificationRead(id) {
    const n = this.notifications.find(n => n.id === id);
    if (n) { n.read = true; this.notify(); }
  },
  markAllRead() {
    this.notifications.forEach(n => n.read = true);
    this.notify();
  },
  setVoiceActive(val) {
    this.voiceActive = val;
    this.notify();
  },
  appendTranscript(text, role = 'user') {
    this.liveTranscriptFull.push({ role, text, time: new Date() });
    this.liveTranscript = text;
    this.notify();
  },
  clearTranscript() {
    this.liveTranscript = '';
    this.liveTranscriptFull = [];
    this.notify();
  },
  get unreadCount() {
    return this.notifications.filter(n => !n.read).length;
  },
  get todayCallCount() {
    const today = new Date();
    return this.calls.filter(c => {
      const d = new Date(c.time);
      return d.toDateString() === today.toDateString();
    }).length;
  },
  get completedToday() {
    const today = new Date();
    return this.calls.filter(c => {
      const d = new Date(c.time);
      return d.toDateString() === today.toDateString() && c.status === 'completed';
    }).length;
  },
};
