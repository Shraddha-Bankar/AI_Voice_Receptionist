// ─── Voice Orb — Fully Fixed ──────────────────────────────────────────────────
import { AppState } from '../store/appState.js';
import {
  startListening, stopListening, speak, cancelSpeech,
  processUserSpeech, isSpeechSupported
} from '../services/speech.js';
import { generateSummary, analyzeSentiment } from '../services/openrouter.js';
import { detectIntent } from '../services/intentDetector.js';
import { CALL_STATUS } from '../utils/constants.js';

// ── Module-level state (persists across re-renders) ───────────────────────────
let callTimer     = null;
let callStart     = null;
let agentBusy     = false;
let _orbInitDone  = false;   // prevent double-init on re-renders

// ── Render (pure HTML — no side effects) ─────────────────────────────────────
export function renderVoiceOrb() {
  const active  = AppState.voiceActive;
  const history = AppState.liveTranscriptFull;
  return `
    <div class="voice-orb-wrap">
      <div class="orb-container">
        <div class="orb ${active ? 'orb-active' : ''}" id="voiceOrb">
          <div class="orb-ring orb-ring-1"></div>
          <div class="orb-ring orb-ring-2"></div>
          <div class="orb-ring orb-ring-3"></div>
          <div class="orb-core">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" width="28" height="28">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" ${active ? 'fill="white"' : ''}/>
              <path d="M19 10v2a7 7 0 01-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="orb-status-text" id="orbStatusText">
        ${active ? 'Agent is active — speak now' : (isSpeechSupported() ? 'Click Start Agent to begin' : '⚠️ Use Chrome or Edge for voice')}
      </div>

      <div class="orb-controls">
        <button class="btn ${active ? 'btn-danger' : 'btn-primary'} orb-main-btn"
                id="orbToggleBtn" onclick="window.__toggleVoiceAgent()">
          ${active
            ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>&nbsp;Stop Agent`
            : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><polygon points="5 3 19 12 5 21 5 3"/></svg>&nbsp;Start Agent`}
        </button>
        ${active ? `
          <button class="btn btn-ghost" onclick="window.__muteAgent()" id="muteBtn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
            </svg>&nbsp;Mute
          </button>` : ''}
      </div>

      ${active ? `
        <div class="call-timer" id="callTimer">
          <span class="timer-dot"></span>
          <span id="timerDisplay">00:00</span>
        </div>` : ''}

      <div class="live-transcript-box ${active || history.length ? 'visible' : ''}" id="transcriptBox">
        ${active ? `<div class="transcript-label" id="transcriptLabel">
          <span class="tl-dot tl-listening" id="tlDot"></span>
          <span id="tlText">Listening…</span>
        </div>` : ''}
        <div class="transcript-text" id="transcriptText"></div>
        ${history.length > 0 ? `
          <div class="transcript-history" id="transcriptHistory">
            ${history.slice(-8).map(t => `
              <div class="transcript-line ${t.role}">
                <span class="t-role">${t.role === 'user' ? '🎙️' : '🤖'}</span>
                <span class="t-text">${escHtml(t.text)}</span>
              </div>`).join('')}
          </div>` : ''}
      </div>
    </div>
  `;
}

// ── Init — called after renderVoiceOrb() inserts HTML ────────────────────────
export function initVoiceOrb() {
  // CRITICAL: only register globals once — re-renders must NOT restart the agent
  if (_orbInitDone) return;
  _orbInitDone = true;

  window.__toggleVoiceAgent = () => {
    if (AppState.voiceActive) stopVoiceAgent();
    else startVoiceAgent();
  };

  window.__muteAgent = () => {
    cancelSpeech();
    stopListening();
    agentBusy = false;
    setStatus('Muted');
    setLabel('🔇 Muted');
  };
}

// ── Start ─────────────────────────────────────────────────────────────────────
function startVoiceAgent() {
  if (!isSpeechSupported()) {
    alert('Speech recognition is not supported.\nPlease use Google Chrome or Microsoft Edge.');
    return;
  }
  if (AppState.voiceActive) return; // prevent double-start

  // Reset state
  agentBusy = false;
  callStart  = Date.now();

  // Update state WITHOUT triggering a full re-render of the page
  // We set voiceActive directly and only re-render the orb area
  AppState.voiceActive = true;
  AppState.liveTranscript = '';
  AppState.liveTranscriptFull = [];
  // Re-render ONLY the orb container (not the whole page)
  refreshOrbUI();

  startCallTimer();
  pushNotification('system', 'Agent Started', 'Voice agent is now active.');

  const name     = AppState.settings.agentName || 'Priya';
  const greeting = buildGreeting(name);

  // Wait for browser TTS engine to be ready, then greet
  setTimeout(() => {
    agentBusy = true;
    setStatus('Agent speaking…');
    setLabel('🔊 Speaking…', 'tl-speaking');
    speakThenListen(greeting);
  }, 350);
}

// ── Stop ──────────────────────────────────────────────────────────────────────
function stopVoiceAgent() {
  stopListening();
  cancelSpeech();
  clearInterval(callTimer);
  callTimer = null;
  agentBusy = false;

  const duration  = callStart ? Math.round((Date.now() - callStart) / 1000) : 0;
  callStart       = null;

  const transcript = AppState.liveTranscriptFull
    .map(t => `${t.role === 'user' ? 'Caller' : 'Agent'}: ${t.text}`)
    .join('\n');

  // Update state without full re-render
  AppState.voiceActive = false;
  refreshOrbUI();

  // Save call record async
  (async () => {
    const summary   = transcript ? await generateSummary(transcript)  : 'No transcript.';
    const sentiment = transcript ? await analyzeSentiment(transcript) : 'neutral';
    const lastUser  = AppState.liveTranscriptFull.filter(t => t.role === 'user').slice(-1)[0]?.text || '';
    const intent    = detectIntent(lastUser);
    AppState.addCall({
      id: 'c' + Date.now(), caller: 'Live Caller', phone: '—',
      time: new Date().toISOString(), duration,
      status: CALL_STATUS.COMPLETED, sentiment, intent, summary,
      transcript: [...AppState.liveTranscriptFull],
    });
    AppState.liveTranscriptFull = [];
    AppState.liveTranscript     = '';
  })();
}

// ── Core loop: speak → listen → respond → repeat ─────────────────────────────
function speakThenListen(text) {
  // Save agent turn to history immediately
  AppState.liveTranscriptFull.push({ role: 'agent', text, time: new Date() });
  appendToTranscriptUI('agent', text);

  speak(text, () => {
    // TTS done — now mic can open
    agentBusy = false;
    if (!AppState.voiceActive) return;
    // Small pause so mic doesn't catch reverb
    setTimeout(beginListening, 500);
  });
}

function beginListening() {
  if (!AppState.voiceActive || agentBusy) return;
  setStatus('Listening — speak now…');
  setLabel('🎙️ Listening…', 'tl-listening');
  clearTranscriptText();
  startListening(handleTranscript, handleListenEnd);
}

async function handleTranscript(text, isFinal) {
  // Show what's being recognised in real-time
  setTranscriptText(text);

  if (!isFinal) return;

  // Lock — stop listening immediately
  stopListening();
  agentBusy = true;
  setStatus('Thinking…');
  setLabel('⏳ Processing…', 'tl-thinking');

  // Save user turn
  AppState.liveTranscriptFull.push({ role: 'user', text, time: new Date() });
  appendToTranscriptUI('user', text);
  clearTranscriptText();

  if (!AppState.voiceActive) return;

  // Escalation check
  const { response, intent } = await processUserSpeech(text);

  if (!AppState.voiceActive) return;

  if (intent === 'escalation' && AppState.settings.autoEscalate) {
    pushNotification('escalation', 'Escalation Requested', `Caller said: "${text}"`);
  }

  setLabel('🔊 Speaking…', 'tl-speaking');
  setStatus('Agent speaking…');
  speakThenListen(response);
}

function handleListenEnd() {
  // STT engine stopped on its own — restart if we're still in a call
  if (AppState.voiceActive && !agentBusy) {
    setTimeout(beginListening, 700);
  }
}

// ── UI helpers (direct DOM, NO AppState.notify) ───────────────────────────────
function refreshOrbUI() {
  // Re-render only the voice orb area inside the dashboard, not the whole page
  const wrap = document.querySelector('.voice-orb-wrap');
  if (wrap) {
    wrap.outerHTML; // keep reference
    const card = wrap.closest('.orb-card') || wrap.parentElement;
    if (card) {
      const newHtml = renderVoiceOrb();
      const tmp = document.createElement('div');
      tmp.innerHTML = newHtml;
      card.querySelector('.voice-orb-wrap')?.replaceWith(tmp.firstElementChild);
    }
  }
  // Also update sidebar agent status dot without full re-render
  const dot  = document.querySelector('.agent-status');
  const dotT = document.querySelector('.status-text');
  if (dot)  dot.className  = `agent-status ${AppState.voiceActive ? 'online' : 'offline'}`;
  if (dotT) dotT.textContent = AppState.voiceActive ? 'Agent Active' : 'Agent Idle';
  // Update topbar badge
  const badge = document.querySelector('.card-badge');
  if (badge) {
    badge.className  = `card-badge ${AppState.voiceActive ? 'badge-green' : 'badge-gray'}`;
    badge.textContent = AppState.voiceActive ? '● Live' : '○ Idle';
  }
}

function setStatus(msg) {
  const el = document.getElementById('orbStatusText');
  if (el) el.textContent = msg;
}

function setLabel(msg, dotClass) {
  const txt = document.getElementById('tlText');
  const dot = document.getElementById('tlDot');
  if (txt) txt.textContent = msg;
  if (dot && dotClass) {
    dot.className = `tl-dot ${dotClass}`;
  }
}

function setTranscriptText(text) {
  const el = document.getElementById('transcriptText');
  if (el) el.textContent = text;
}

function clearTranscriptText() {
  const el = document.getElementById('transcriptText');
  if (el) el.textContent = '';
}

function appendToTranscriptUI(role, text) {
  let hist = document.getElementById('transcriptHistory');
  if (!hist) {
    // Create history container if it doesn't exist yet
    const box = document.getElementById('transcriptBox');
    if (!box) return;
    hist = document.createElement('div');
    hist.id = 'transcriptHistory';
    hist.className = 'transcript-history';
    box.appendChild(hist);
  }
  const line = document.createElement('div');
  line.className = `transcript-line ${role}`;
  line.innerHTML = `<span class="t-role">${role === 'user' ? '🎙️' : '🤖'}</span><span class="t-text">${escHtml(text)}</span>`;
  hist.appendChild(line);
  hist.scrollTop = hist.scrollHeight;
  // Keep max 10 lines
  while (hist.children.length > 10) hist.removeChild(hist.firstChild);
}

function startCallTimer() {
  clearInterval(callTimer);
  callTimer = setInterval(() => {
    const el = document.getElementById('timerDisplay');
    if (!el || !callStart) return;
    const s = Math.round((Date.now() - callStart) / 1000);
    el.textContent = `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
    if (s >= AppState.settings.maxCallDuration) stopVoiceAgent();
  }, 1000);
}

function pushNotification(type, title, message) {
  AppState.notifications.unshift({
    id: 'n' + Date.now(), type, title, message,
    time: new Date().toISOString(), read: false,
    priority: type === 'escalation' ? 'high' : 'low',
  });
  // Update notification badge only
  const badge = document.querySelector('.nav-badge');
  if (badge) badge.textContent = AppState.unreadCount;
}

function buildGreeting(name) {
  const lang = AppState.settings.language || 'en';
  if (lang === 'hi') return `नमस्ते! City General Hospital में आपका स्वागत है। मैं ${name} हूँ। आपकी कैसे मदद कर सकती हूँ?`;
  if (lang === 'mr') return `नमस्कार! City General Hospital मध्ये आपले स्वागत आहे. मी ${name} आहे. आपली कशी मदत करू शकते?`;
  return `Hello! Welcome to City General Hospital. I'm ${name}, your virtual receptionist. How can I help you today?`;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
