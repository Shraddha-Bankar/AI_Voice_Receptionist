// ─── App-wide Constants ───────────────────────────────────────────────────────

export const PAGES = {
  DASHBOARD:    'dashboard',
  CALLS:        'calls',
  APPOINTMENTS: 'appointments',
  CRM:          'crm',
  ANALYTICS:    'analytics',
  TRANSCRIPTS:  'transcripts',
  NOTIFICATIONS:'notifications',
  VOICE_CONFIG: 'voice_config',
  SETTINGS:     'settings',
};

export const INTENTS = {
  APPOINTMENT_BOOK:   'appointment_book',
  APPOINTMENT_CANCEL: 'appointment_cancel',
  COMPLAINT:          'complaint',
  ESCALATION:         'escalation',
  INFO_REQUEST:       'info_request',
  GENERAL:            'general',
};

export const SENTIMENT = {
  POSITIVE: 'positive',
  NEUTRAL:  'neutral',
  NEGATIVE: 'negative',
};

export const CALL_STATUS = {
  COMPLETED: 'completed',
  MISSED:    'missed',
  ESCALATED: 'escalated',
};

// ── Mock Data ─────────────────────────────────────────────────────────────────

const now = Date.now();
const MINS = 60 * 1000;
const DAYS = 24 * 60 * MINS;

export const MOCK_CALLS = [
  {
    id: 'c001', caller: 'Priya Mehta',       phone: '+91 98765 43210',
    time: new Date(now - 15 * MINS).toISOString(), duration: 182,
    status: 'completed', sentiment: 'positive', intent: INTENTS.APPOINTMENT_BOOK,
    summary: 'Patient booked a consultation with Dr. Sharma for Thursday at 11am.',
    transcript: [
      { role: 'agent', text: "Hello! Welcome to City Care Clinic. I'm Aria. How can I help you today?", time: new Date(now - 17 * MINS) },
      { role: 'user',  text: "Hi, I'd like to book an appointment with Dr. Sharma.", time: new Date(now - 16.5 * MINS) },
      { role: 'agent', text: 'Of course! Dr. Sharma is available Thursday at 10am or 11am. Which works for you?', time: new Date(now - 16 * MINS) },
      { role: 'user',  text: '11am would be perfect, thank you!', time: new Date(now - 15.5 * MINS) },
      { role: 'agent', text: "Wonderful! I've booked you in with Dr. Sharma on Thursday at 11am. Is there anything else I can help with?", time: new Date(now - 15 * MINS) },
    ],
  },
  {
    id: 'c002', caller: 'Rahul Verma',        phone: '+91 87654 32109',
    time: new Date(now - 2 * 60 * MINS).toISOString(), duration: 0,
    status: 'missed', sentiment: 'neutral', intent: INTENTS.INFO_REQUEST,
    summary: 'Missed call — no voicemail.',
    transcript: [],
  },
  {
    id: 'c003', caller: 'Sunita Rao',          phone: '+91 76543 21098',
    time: new Date(now - 5 * 60 * MINS).toISOString(), duration: 95,
    status: 'escalated', sentiment: 'negative', intent: INTENTS.COMPLAINT,
    summary: 'Patient complained about long wait time and requested to speak to a manager.',
    transcript: [
      { role: 'agent', text: 'Hello! This is Aria at City Care Clinic. How can I assist?', time: new Date(now - 7 * MINS) },
      { role: 'user',  text: "I've been waiting 45 minutes! This is ridiculous.", time: new Date(now - 6.5 * MINS) },
      { role: 'agent', text: 'I sincerely apologize for the wait. I understand your frustration completely.', time: new Date(now - 6 * MINS) },
      { role: 'user',  text: 'I want to speak to your manager right now.', time: new Date(now - 5.5 * MINS) },
    ],
  },
  {
    id: 'c004', caller: 'Amit Kulkarni',       phone: '+91 65432 10987',
    time: new Date(now - 1 * DAYS).toISOString(), duration: 210,
    status: 'completed', sentiment: 'positive', intent: INTENTS.APPOINTMENT_BOOK,
    summary: 'Booked a dental check-up for next Monday morning.',
    transcript: [],
  },
  {
    id: 'c005', caller: 'Deepa Nair',           phone: '+91 54321 09876',
    time: new Date(now - 1 * DAYS - 3 * 60 * MINS).toISOString(), duration: 130,
    status: 'completed', sentiment: 'neutral', intent: INTENTS.INFO_REQUEST,
    summary: 'Caller asked about clinic timings and fee structure.',
    transcript: [],
  },
  {
    id: 'c006', caller: 'Vikram Singh',         phone: '+91 43210 98765',
    time: new Date(now - 2 * DAYS).toISOString(), duration: 0,
    status: 'missed', sentiment: 'neutral', intent: INTENTS.GENERAL,
    summary: '',
    transcript: [],
  },
  {
    id: 'c007', caller: 'Anjali Desai',         phone: '+91 32109 87654',
    time: new Date(now - 3 * DAYS).toISOString(), duration: 165,
    status: 'completed', sentiment: 'positive', intent: INTENTS.APPOINTMENT_CANCEL,
    summary: 'Rescheduled appointment from Wednesday to Friday.',
    transcript: [],
  },
  {
    id: 'c008', caller: 'Ravi Iyer',            phone: '+91 21098 76543',
    time: new Date(now - 3 * DAYS - 2 * 60 * MINS).toISOString(), duration: 88,
    status: 'completed', sentiment: 'negative', intent: INTENTS.COMPLAINT,
    summary: 'Caller unhappy with prescription refill delay.',
    transcript: [],
  },
  {
    id: 'c009', caller: 'Kavya Reddy',          phone: '+91 10987 65432',
    time: new Date(now - 5 * DAYS).toISOString(), duration: 200,
    status: 'completed', sentiment: 'positive', intent: INTENTS.APPOINTMENT_BOOK,
    summary: 'Booked paediatric consultation for child.',
    transcript: [],
  },
  {
    id: 'c010', caller: 'Suresh Patil',         phone: '+91 09876 54321',
    time: new Date(now - 6 * DAYS).toISOString(), duration: 0,
    status: 'missed', sentiment: 'neutral', intent: INTENTS.GENERAL,
    summary: '',
    transcript: [],
  },
];

export const MOCK_APPOINTMENTS = [
  {
    id: 'a001', name: 'Priya Mehta',   phone: '+91 98765 43210',
    doctor: 'Dr. Priya Sharma', type: 'Consultation',
    date: new Date(now + 2 * DAYS).toISOString().slice(0, 10), time: '11:00',
    status: 'scheduled', notes: 'Follow-up on previous consultation',
  },
  {
    id: 'a002', name: 'Amit Kulkarni', phone: '+91 65432 10987',
    doctor: 'Dr. Rajesh Kumar', type: 'Lab Test',
    date: new Date(now + 1 * DAYS).toISOString().slice(0, 10), time: '09:30',
    status: 'scheduled', notes: 'Fasting blood test',
  },
  {
    id: 'a003', name: 'Kavya Reddy',   phone: '+91 10987 65432',
    doctor: 'Dr. Anita Desai', type: 'Consultation',
    date: new Date(now + 3 * DAYS).toISOString().slice(0, 10), time: '14:00',
    status: 'scheduled', notes: 'Paediatric check-up',
  },
  {
    id: 'a004', name: 'Deepa Nair',    phone: '+91 54321 09876',
    doctor: 'Dr. Vikram Nair', type: 'Follow-up',
    date: new Date(now + 5 * DAYS).toISOString().slice(0, 10), time: '10:30',
    status: 'scheduled', notes: '',
  },
  {
    id: 'a005', name: 'Rahul Verma',   phone: '+91 87654 32109',
    doctor: 'Dr. Meera Iyer', type: 'Procedure',
    date: new Date(now - 2 * DAYS).toISOString().slice(0, 10), time: '15:00',
    status: 'completed', notes: '',
  },
  {
    id: 'a006', name: 'Vikram Singh',  phone: '+91 43210 98765',
    doctor: 'Dr. Priya Sharma', type: 'Consultation',
    date: new Date(now - 1 * DAYS).toISOString().slice(0, 10), time: '09:00',
    status: 'cancelled', notes: 'Caller cancelled via phone',
  },
];

export const MOCK_CONTACTS = [
  { id: 'con001', name: 'Priya Mehta',    phone: '+91 98765 43210', email: 'priya.mehta@email.com',    tag: 'patient',  notes: 'Regular patient, prefers morning slots', lastContact: new Date(now - 15 * MINS).toISOString() },
  { id: 'con002', name: 'Rahul Verma',    phone: '+91 87654 32109', email: 'rahul.verma@email.com',    tag: 'followup', notes: 'Missed call, needs callback', lastContact: new Date(now - 2 * 60 * MINS).toISOString() },
  { id: 'con003', name: 'Sunita Rao',     phone: '+91 76543 21098', email: '',                          tag: 'vip',      notes: 'Senior patient, requires extra care', lastContact: new Date(now - 5 * 60 * MINS).toISOString() },
  { id: 'con004', name: 'Amit Kulkarni',  phone: '+91 65432 10987', email: 'amit.k@email.com',         tag: 'patient',  notes: '', lastContact: new Date(now - 1 * DAYS).toISOString() },
  { id: 'con005', name: 'Deepa Nair',     phone: '+91 54321 09876', email: 'deepa.nair@email.com',     tag: 'patient',  notes: '', lastContact: new Date(now - 1 * DAYS).toISOString() },
  { id: 'con006', name: 'Kavya Reddy',    phone: '+91 10987 65432', email: 'kavya.reddy@email.com',    tag: 'new',      notes: 'New patient, referred by Dr. Sharma', lastContact: new Date(now - 5 * DAYS).toISOString() },
  { id: 'con007', name: 'Ravi Iyer',      phone: '+91 21098 76543', email: 'ravi.iyer@email.com',      tag: 'patient',  notes: 'Chronic condition, monthly visits', lastContact: new Date(now - 3 * DAYS).toISOString() },
  { id: 'con008', name: 'Anjali Desai',   phone: '+91 32109 87654', email: 'anjali.desai@email.com',   tag: 'vip',      notes: 'VIP patient, direct line to Dr. Sharma', lastContact: new Date(now - 3 * DAYS).toISOString() },
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 'n001', type: 'escalation', title: 'Call Escalated',
    message: 'Sunita Rao requested to speak to a manager regarding wait time.',
    time: new Date(now - 5 * 60 * MINS).toISOString(), read: false,
  },
  {
    id: 'n002', type: 'call', title: 'Missed Call',
    message: 'Rahul Verma called but could not be connected.',
    time: new Date(now - 2 * 60 * MINS).toISOString(), read: false,
  },
  {
    id: 'n003', type: 'appointment', title: 'Appointment Reminder',
    message: 'Amit Kulkarni has a lab test scheduled tomorrow at 9:30 AM.',
    time: new Date(now - 30 * MINS).toISOString(), read: false,
  },
  {
    id: 'n004', type: 'system', title: 'Agent Started',
    message: 'Voice agent was activated and handled 3 calls today.',
    time: new Date(now - 6 * 60 * MINS).toISOString(), read: true,
  },
  {
    id: 'n005', type: 'call', title: 'High Call Volume',
    message: 'Call volume is 40% above average for this time of day.',
    time: new Date(now - 1 * DAYS).toISOString(), read: true,
  },
];
