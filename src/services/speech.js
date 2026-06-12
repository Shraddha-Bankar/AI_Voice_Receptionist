// ─── Speech Service — Fully Fixed ────────────────────────────────────────────
import { AppState } from '../store/appState.js';
import { callLLM } from './openrouter.js';
import { detectLanguage } from './languageDetector.js';
import { detectIntent } from './intentDetector.js';

let recognition  = null;
let synth        = window.speechSynthesis;
let _isListening = false;

// ── Pre-load voices (Chrome needs this) ──────────────────────────────────────
let _voices = [];
function ensureVoices() {
  return new Promise(resolve => {
    _voices = synth.getVoices();
    if (_voices.length) { resolve(_voices); return; }
    const handler = () => { _voices = synth.getVoices(); resolve(_voices); };
    synth.addEventListener('voiceschanged', handler, { once: true });
    setTimeout(() => { _voices = synth.getVoices(); resolve(_voices); }, 2000);
  });
}
// Trigger immediately so voices are ready before first call
ensureVoices();

function getBestVoice(langCode) {
  const priority = {
    hi: ['hi-IN','hi'],
    mr: ['mr-IN','hi-IN','hi'],
    en: ['en-IN','en-GB','en-US','en'],
    ta: ['ta-IN','ta'],
    te: ['te-IN','te'],
  };
  const prefs = priority[langCode] || priority['en'];
  for (const p of prefs) {
    const v = _voices.find(v => v.lang.startsWith(p));
    if (v) return v;
  }
  return _voices.find(v => v.lang.startsWith('en')) || _voices[0] || null;
}

function sttLocale(code) {
  return { hi:'hi-IN', mr:'mr-IN', ta:'ta-IN', te:'te-IN', en:'en-IN' }[code] || 'en-IN';
}

// ── STT ───────────────────────────────────────────────────────────────────────
export function isSpeechSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function startListening(onTranscript, onEnd) {
  if (!isSpeechSupported()) { console.warn('STT not supported'); return; }

  // Clean up any existing recognition
  if (recognition) {
    try { recognition.abort(); } catch(e) {}
    recognition = null;
  }

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();

  recognition.continuous      = true;
  recognition.interimResults  = true;
  recognition.maxAlternatives = 1;
  recognition.lang            = sttLocale(AppState.settings.language || 'en');

  let silenceTimer   = null;
  let lastFinal      = '';
  let hasSpoken      = false;

  recognition.onstart = () => {
    _isListening = true;
    console.log('🎙️ STT started, lang:', recognition.lang);
  };

  recognition.onresult = (event) => {
    clearTimeout(silenceTimer);
    let interim = '';
    let final   = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const t = event.results[i][0].transcript.trim();
      if (event.results[i].isFinal) {
        final += t + ' ';
      } else {
        interim += t;
      }
    }

    final = final.trim();

    if (final && final !== lastFinal) {
      lastFinal = final;
      hasSpoken = true;
      onTranscript(final, true);
    } else if (interim) {
      hasSpoken = true;
      onTranscript(interim, false);
      // Submit after 2s silence if we have interim text
      silenceTimer = setTimeout(() => {
        if (interim.trim().length > 1) {
          onTranscript(interim.trim(), true);
        }
      }, 2000);
    }
  };

  recognition.onerror = (e) => {
    _isListening = false;
    clearTimeout(silenceTimer);
    console.warn('STT error:', e.error);
    if (e.error === 'no-speech') {
      // Normal — user hasn't spoken yet, STT timed out
      if (onEnd) onEnd();
      return;
    }
    if (e.error === 'aborted') return; // we stopped it intentionally
    if (e.error === 'not-allowed') {
      alert('Microphone access was denied.\nPlease allow microphone in your browser settings and refresh.');
      return;
    }
    // For other errors, signal end so the caller can restart
    if (onEnd) onEnd();
  };

  recognition.onend = () => {
    _isListening = false;
    clearTimeout(silenceTimer);
    console.log('🎙️ STT ended');
    if (onEnd) onEnd();
  };

  try {
    recognition.start();
  } catch(e) {
    console.warn('STT start failed:', e);
    _isListening = false;
    if (onEnd) onEnd();
  }
}

export function stopListening() {
  _isListening = false;
  if (recognition) {
    try { recognition.abort(); } catch(e) {}
    recognition = null;
  }
}

// ── TTS ───────────────────────────────────────────────────────────────────────
export async function speak(text, onEnd) {
  if (!synth || !text?.trim()) { if (onEnd) onEnd(); return; }

  // Stop any ongoing speech first
  synth.cancel();
  await delay(100);

  // Make sure voices are loaded
  await ensureVoices();

  const langCode = detectLanguage(text);
  const voice    = getBestVoice(langCode);
  const chunks   = splitText(text);

  console.log(`🔊 TTS: ${chunks.length} chunk(s), lang=${langCode}, voice=${voice?.name || 'default'}`);

  let i = 0;
  function speakNext() {
    if (i >= chunks.length) { if (onEnd) onEnd(); return; }

    const u    = new SpeechSynthesisUtterance(chunks[i]);
    u.rate     = AppState.settings.ttsRate   || 1.0;
    u.pitch    = AppState.settings.ttsPitch  || 1.0;
    u.volume   = AppState.settings.ttsVolume || 1.0;
    u.lang     = sttLocale(langCode);
    if (voice) u.voice = voice;

    u.onend = () => { i++; speakNext(); };
    u.onerror = (e) => {
      if (e.error === 'interrupted') { if (onEnd) onEnd(); return; }
      console.warn('TTS error on chunk', i, ':', e.error);
      i++;
      speakNext();
    };

    synth.speak(u);

    // Chrome bug: TTS silently stops after ~15s — resume it
    setTimeout(() => { if (synth.paused) synth.resume(); }, 500);
  }

  speakNext();
}

function splitText(text, maxLen = 180) {
  if (text.length <= maxLen) return [text];
  // Split on sentence boundaries
  const parts = text.split(/(?<=[।.!?,;])\s+/);
  const chunks = [];
  let cur = '';
  for (const p of parts) {
    if ((cur + ' ' + p).trim().length > maxLen && cur) {
      chunks.push(cur.trim());
      cur = p;
    } else {
      cur = (cur + ' ' + p).trim();
    }
  }
  if (cur) chunks.push(cur);
  return chunks.length ? chunks : [text];
}

export function cancelSpeech() {
  if (synth) { synth.cancel(); }
}

// ── LLM bridge ───────────────────────────────────────────────────────────────
export async function processUserSpeech(text) {
  const detectedLang = detectLanguage(text);
  const intent       = detectIntent(text);

  // Silently update language for next STT round
  AppState.settings.language = detectedLang;

  const history = AppState.liveTranscriptFull
    .slice(-10)
    .map(t => ({ role: t.role === 'user' ? 'user' : 'assistant', content: t.text }));
  history.push({ role: 'user', content: text });

  const response = await callLLM(history);
  return { response, intent, lang: detectedLang };
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
