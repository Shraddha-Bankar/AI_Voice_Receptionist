// ─── Intent Detector ─────────────────────────────────────────────────────────
import { INTENTS } from '../utils/constants.js';

const INTENT_PATTERNS = {
  [INTENTS.APPOINTMENT_BOOK]: [
    /book|schedule|appoint|fix.*time|set.*appointment|want.*to.*come|visit|when.*available/i,
    /\u092C\u0941\u0915|\u0905\u092A\u0949\u0907\u0902\u091F\u092E\u0947\u0902\u091F|\u0938\u092E\u092F|\u092E\u093F\u0932\u0928\u093E/,
  ],
  [INTENTS.APPOINTMENT_CANCEL]: [
    /cancel|reschedule|postpone|change.*appointment|can't.*come|won't.*be.*able/i,
  ],
  [INTENTS.COMPLAINT]: [
    /complaint|problem|issue|unhappy|angry|dissatisfied|bad.*service|waiting.*too.*long|frustrated/i,
    /\u0936\u093F\u0915\u093E\u092F\u0924|\u0938\u092E\u0938\u094D\u092F\u093E|\u092A\u0930\u0947\u0936\u093E\u0928/,
  ],
  [INTENTS.ESCALATION]: [
    /speak.*to.*human|real.*person|manager|supervisor|not.*helping|useless|transfer/i,
  ],
  [INTENTS.INFO_REQUEST]: [
    /timing|hours|open|close|address|location|price|cost|fee|doctor|available|services/i,
    /\u0938\u092E\u092F|\u092A\u0924\u093E|\u0921\u0949\u0915\u094D\u091F\u0930|\u0915\u0940\u092E\u0924/,
  ],
};

export function detectIntent(text) {
  if (!text) return INTENTS.GENERAL;
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) return intent;
    }
  }
  return INTENTS.GENERAL;
}

export function getIntentLabel(intent) {
  const labels = {
    [INTENTS.APPOINTMENT_BOOK]:   'Book Appointment',
    [INTENTS.APPOINTMENT_CANCEL]: 'Cancel Appointment',
    [INTENTS.COMPLAINT]:          'Complaint',
    [INTENTS.ESCALATION]:         'Escalation',
    [INTENTS.INFO_REQUEST]:       'Info Request',
    [INTENTS.GENERAL]:            'General',
  };
  return labels[intent] || 'General';
}

export function getIntentColor(intent) {
  const colors = {
    [INTENTS.APPOINTMENT_BOOK]:   '#6EE7B7',
    [INTENTS.APPOINTMENT_CANCEL]: '#FCA5A5',
    [INTENTS.COMPLAINT]:          '#F87171',
    [INTENTS.ESCALATION]:         '#FB923C',
    [INTENTS.INFO_REQUEST]:       '#93C5FD',
    [INTENTS.GENERAL]:            '#D1D5DB',
  };
  return colors[intent] || '#D1D5DB';
}
