// ─── Language Detector — Fixed ────────────────────────────────────────────────

// Unicode script ranges
const SCRIPT_MAP = [
  { lang: 'hi', pattern: /[\u0900-\u097F]/ },  // Devanagari (Hindi & Marathi share)
  { lang: 'ta', pattern: /[\u0B80-\u0BFF]/ },
  { lang: 'te', pattern: /[\u0C00-\u0C7F]/ },
  { lang: 'bn', pattern: /[\u0980-\u09FF]/ },
  { lang: 'gu', pattern: /[\u0A80-\u0AFF]/ },
];

// Romanised keywords per language (for typed/STT text)
const KEYWORD_MAP = {
  mr: ['namaskaar', 'namaskar', 'kay', 'aahe', 'ahe', 'mala', 'aplya', 'tumhi', 'mhanaje', 'doktor', 'rugnalaya', 'appointment', 'vedh'],
  hi: ['namaste', 'namaskar', 'haan', 'nahi', 'kya', 'aap', 'mujhe', 'chahiye', 'doctor', 'aspatal', 'apoinment', 'theek', 'kal', 'aaj'],
  en: ['hello', 'hi', 'yes', 'no', 'please', 'thank', 'appointment', 'doctor', 'clinic', 'hospital', 'book', 'cancel', 'reschedule'],
};

export function detectLanguage(text) {
  if (!text || typeof text !== 'string') return 'en';
  const trimmed = text.trim();

  // 1. Script detection (highest confidence for non-Latin)
  for (const { lang, pattern } of SCRIPT_MAP) {
    if (pattern.test(trimmed)) return lang;
  }

  // 2. Keyword scoring for romanised text
  const lower = trimmed.toLowerCase();
  const scores = {};
  for (const [lang, keywords] of Object.entries(KEYWORD_MAP)) {
    scores[lang] = keywords.reduce((n, kw) => n + (lower.includes(kw) ? 1 : 0), 0);
  }
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (sorted[0][1] > 0) return sorted[0][0];

  return 'en';
}

export function getLanguageName(code) {
  const names = {
    en: 'English', hi: 'Hindi', mr: 'Marathi',
    ta: 'Tamil',   te: 'Telugu', bn: 'Bengali', gu: 'Gujarati',
  };
  return names[code] || 'English';
}

export function sttLocale(code) {
  const map = {
    en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN',
    ta: 'ta-IN', te: 'te-IN', bn: 'bn-IN', gu: 'gu-IN',
  };
  return map[code] || 'en-IN';
}
