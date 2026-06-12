// ─── OpenRouter API Client — Fixed ───────────────────────────────────────────
import { AppState } from '../store/appState.js';

// ── Keys — replace with your real key, or enter via Settings page ────────────
const FALLBACK_KEYS = [
  // Add your OpenRouter API keys here, or use the app settings page to enter one at runtime.
  // Example: 'sk-or-your-real-key-here'
];

let keyIdx = 0;
function getKey() {
  const settingsKey = AppState.settings?.openrouterKey;
  if (settingsKey && settingsKey.startsWith('sk-or-')) return settingsKey;
  // Rotate through fallbacks
  const valid = FALLBACK_KEYS.filter(k => k.startsWith('sk-or-'));
  if (!valid.length) return null;
  const k = valid[keyIdx % valid.length];
  keyIdx++;
  return k;
}

// ── Main LLM call ─────────────────────────────────────────────────────────────
export async function callLLM(messages, systemPromptOverride) {
  const key = getKey();
  if (!key) {
    console.warn('No OpenRouter API key — using simulated response');
    return simulatedResponse(messages);
  }

  const sysPrompt = systemPromptOverride || AppState.settings.systemPrompt;
  const model     = AppState.settings.model || 'openai/gpt-4o-mini';

  // Try up to 2 keys on rate-limit / auth failure
  for (let attempt = 0; attempt < 3; attempt++) {
    const currentKey = attempt === 0 ? key : (getKey() || key);
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentKey}`,
          'Content-Type':  'application/json',
          'HTTP-Referer':  typeof window !== 'undefined' ? window.location.origin : 'https://vaaniai.vercel.app',
          'X-Title':       'Vaaniai Voice Receptionist',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: sysPrompt },
            ...messages,
          ],
          max_tokens:  300,
          temperature: 0.65,
          stream:      false,
        }),
      });

      if (res.status === 429) { await sleep(1000 * (attempt + 1)); continue; }
      if (res.status === 401) { console.warn('Invalid key, rotating'); continue; }
      if (!res.ok) {
        const body = await res.text().catch(() => '');
        console.warn(`OpenRouter ${res.status}:`, body);
        continue;
      }

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content?.trim();
      if (text) return text;
    } catch (err) {
      console.warn(`LLM attempt ${attempt + 1} failed:`, err.message);
      if (attempt < 2) await sleep(800);
    }
  }

  return simulatedResponse(messages);
}

// ── Utilities ─────────────────────────────────────────────────────────────────
export async function generateSummary(transcript) {
  if (!transcript?.trim()) return 'No transcript available.';
  return callLLM(
    [{ role: 'user', content: `Summarize this call in one sentence (max 15 words):\n\n${transcript.slice(0, 1200)}` }],
    'You are a call summarizer. Return ONLY the summary sentence, nothing else.'
  );
}

export async function analyzeSentiment(text) {
  if (!text?.trim()) return 'neutral';
  const result = await callLLM(
    [{ role: 'user', content: `Classify sentiment as positive, neutral, or negative:\n"${text.slice(0, 600)}"` }],
    'Reply with ONLY one word: positive, neutral, or negative.'
  );
  const r = result.toLowerCase();
  if (r.includes('positive')) return 'positive';
  if (r.includes('negative')) return 'negative';
  return 'neutral';
}

// ── Simulated fallback ────────────────────────────────────────────────────────
function simulatedResponse(messages) {
  const last = (messages[messages.length - 1]?.content || '').toLowerCase();

  // Hindi fallback
  if (/namaste|namaskar|kaise|kya|appointment|doctor|aspatal/i.test(last) && !/hello|hi |book/i.test(last)) {
    if (/appointment|milna|milne/i.test(last))
      return 'हाँ, मैं आपकी appointment book करने में मदद करूँगी। पहले आपका पूरा नाम बताइए।';
    return 'नमस्ते! City General Hospital में आपका स्वागत है। मैं Priya हूँ। आपकी कैसे मदद कर सकती हूँ?';
  }

  if (/book|appoint|schedule/i.test(last))
    return "I'd be happy to book an appointment. Could you please tell me your full name?";
  if (/cancel|reschedule/i.test(last))
    return "Sure, I can help you reschedule. Could you share your appointment date or reference number?";
  if (/timing|hours|open|time/i.test(last))
    return "Our OPD is open Monday to Saturday, 8 AM to 8 PM. Emergency is available 24/7.";
  if (/fee|cost|price|charge/i.test(last))
    return "Consultation fees start at ₹500. The exact amount depends on the department and doctor.";
  if (/department|specialist|doctor/i.test(last))
    return "We have Cardiology, Orthopedics, Pediatrics, Gynecology, Neurology, Dermatology, ENT, and General Medicine. Which department do you need?";
  if (/emergency|urgent/i.test(last))
    return "Our emergency department is open 24 hours. For emergencies, please call +91-712-2345678 immediately.";
  if (/speak|human|person|agent|transfer/i.test(last))
    return "Of course! I'll transfer you to one of our staff members right away. Please hold for a moment.";
  if (/thank/i.test(last))
    return "You're most welcome! Is there anything else I can help you with today?";
  if (/hello|hi|hey|namaste/i.test(last))
    return "Hello! Welcome to City General Hospital. I'm Priya, your virtual receptionist. How can I help you today?";

  return "Thank you for calling City General Hospital. I'm here to help with appointments, information about our services, or connecting you with our team. How may I assist you?";
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
