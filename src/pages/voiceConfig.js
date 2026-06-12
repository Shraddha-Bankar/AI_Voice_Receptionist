// ─── Voice Configuration Page ─────────────────────────────────────────────────
import { AppState } from '../store/appState.js';
import { speak } from '../services/speech.js';

export function renderVoiceConfig() {
  const s = AppState.settings;
  return `
    <div class="page-content">
      <div class="settings-grid">
        <div class="card settings-card">
          <div class="settings-card-title">Agent Identity</div>
          <div class="settings-card-sub">How your AI voice agent presents itself to callers</div>
          <div class="form-grid">
            <div class="form-field">
              <label class="form-label">Agent Name</label>
              <input class="form-input" id="vcAgentName" type="text" value="${s.agentName}" placeholder="e.g. Aria"/>
              <span class="form-hint">Callers will hear this name in the greeting</span>
            </div>
            <div class="form-field">
              <label class="form-label">Default Language</label>
              <select class="form-input" id="vcLanguage">
                <option value="en" ${s.language==='en'?'selected':''}>English</option>
                <option value="hi" ${s.language==='hi'?'selected':''}>Hindi</option>
                <option value="mr" ${s.language==='mr'?'selected':''}>Marathi</option>
                <option value="ta" ${s.language==='ta'?'selected':''}>Tamil</option>
                <option value="te" ${s.language==='te'?'selected':''}>Telugu</option>
              </select>
            </div>
          </div>
        </div>

        <div class="card settings-card">
          <div class="settings-card-title">System Prompt</div>
          <div class="settings-card-sub">Instructions that define your agent's personality and scope</div>
          <div class="form-field">
            <textarea class="form-input form-textarea tall" id="vcSystemPrompt">${s.systemPrompt}</textarea>
            <span class="form-hint">Be specific about the clinic name, tone, and what the agent should/shouldn't do</span>
          </div>
          <div class="prompt-templates">
            <span class="form-label">Quick templates:</span>
            <button class="tag-btn" onclick="window.__applyTemplate('medical')">🏥 Medical Clinic</button>
            <button class="tag-btn" onclick="window.__applyTemplate('dental')">🦷 Dental Clinic</button>
            <button class="tag-btn" onclick="window.__applyTemplate('general')">🤖 General Assistant</button>
          </div>
        </div>

        <div class="card settings-card">
          <div class="settings-card-title">Voice Settings</div>
          <div class="settings-card-sub">TTS (text-to-speech) parameters for how the agent sounds</div>
          <div class="form-grid">
            <div class="form-field">
              <label class="form-label">Speech Rate — <span id="vcRateVal">${s.ttsRate}</span>x</label>
              <input type="range" class="form-range" id="vcRate" min="0.5" max="2" step="0.1" value="${s.ttsRate}" oninput="document.getElementById('vcRateVal').textContent=this.value"/>
            </div>
            <div class="form-field">
              <label class="form-label">Pitch — <span id="vcPitchVal">${s.ttsPitch}</span></label>
              <input type="range" class="form-range" id="vcPitch" min="0.5" max="2" step="0.1" value="${s.ttsPitch}" oninput="document.getElementById('vcPitchVal').textContent=this.value"/>
            </div>
            <div class="form-field">
              <label class="form-label">Volume — <span id="vcVolumeVal">${s.ttsVolume}</span></label>
              <input type="range" class="form-range" id="vcVolume" min="0" max="1" step="0.1" value="${s.ttsVolume}" oninput="document.getElementById('vcVolumeVal').textContent=this.value"/>
            </div>
            <div class="form-field">
              <label class="form-label">Max Call Duration (seconds)</label>
              <input class="form-input" id="vcMaxDur" type="number" min="60" max="1800" value="${s.maxCallDuration}"/>
            </div>
          </div>
          <div class="form-actions-row">
            <button class="btn btn-ghost" onclick="window.__testVoice()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Test Voice
            </button>
          </div>
        </div>

        <div class="card settings-card">
          <div class="settings-card-title">Behaviour</div>
          <div class="settings-card-sub">How the agent handles escalations and edge cases</div>
          <div class="form-field">
            <label class="toggle-row">
              <span class="form-label" style="margin:0">Auto-Escalate on Request</span>
              <input type="checkbox" id="vcAutoEscalate" class="toggle-input" ${s.autoEscalate?'checked':''}/>
              <span class="toggle-track"></span>
            </label>
            <span class="form-hint">Automatically notify staff when a caller asks to speak to a human</span>
          </div>
        </div>

        <div class="settings-actions">
          <button class="btn btn-ghost" onclick="window.__resetVoiceConfig()">Reset to Defaults</button>
          <button class="btn btn-primary" onclick="window.__saveVoiceConfig()">Save Configuration</button>
        </div>
      </div>
    </div>`;
}

const TEMPLATES = {
  medical: `You are Priya, a warm and professional AI voice receptionist for City General Hospital, Nagpur.
LANGUAGE: Detect the caller's language and reply in the SAME language (English / Hindi / Marathi).
Keep every reply SHORT — max 2-3 sentences. This is a voice call.
OPD Hours: Mon-Sat 8AM-8PM. Emergency: 24/7. Phone: +91-712-2345678.
Departments: Cardiology, Orthopedics, Pediatrics, Gynecology, General Medicine, Neurology, Dermatology, ENT. Fees from ₹500.
For appointments collect: name, age, department, date, time, phone — one at a time.
Never diagnose. Transfer to human if asked.`,
  dental: `You are Priya, a friendly AI receptionist for a dental clinic.
LANGUAGE: Always reply in the same language the caller uses.
Keep replies SHORT — 2-3 sentences maximum.
Help with appointments, treatment info, pricing, and emergencies. Be warm and reassuring.
For bookings collect: name, age, treatment needed, preferred date, time, phone.`,
  general: `You are Priya, a helpful AI voice assistant.
LANGUAGE: Detect and reply in the caller's language.
Keep responses SHORT and conversational — max 2-3 sentences.
Answer questions, help schedule appointments, provide information. Escalate to human when needed.`,
};

export function initVoiceConfig() {
  window.__saveVoiceConfig = () => {
    AppState.updateSettings({
      agentName:       document.getElementById('vcAgentName')?.value.trim() || AppState.settings.agentName,
      language:        document.getElementById('vcLanguage')?.value || AppState.settings.language,
      systemPrompt:    document.getElementById('vcSystemPrompt')?.value.trim() || AppState.settings.systemPrompt,
      ttsRate:         parseFloat(document.getElementById('vcRate')?.value) || AppState.settings.ttsRate,
      ttsPitch:        parseFloat(document.getElementById('vcPitch')?.value) || AppState.settings.ttsPitch,
      ttsVolume:       parseFloat(document.getElementById('vcVolume')?.value) || AppState.settings.ttsVolume,
      maxCallDuration: parseInt(document.getElementById('vcMaxDur')?.value) || AppState.settings.maxCallDuration,
      autoEscalate:    document.getElementById('vcAutoEscalate')?.checked ?? AppState.settings.autoEscalate,
    });
    showToast('Voice configuration saved!');
  };
  window.__testVoice = () => {
    AppState.settings.ttsRate   = parseFloat(document.getElementById('vcRate')?.value) || 1;
    AppState.settings.ttsPitch  = parseFloat(document.getElementById('vcPitch')?.value) || 1;
    AppState.settings.ttsVolume = parseFloat(document.getElementById('vcVolume')?.value) || 1;
    const name = document.getElementById('vcAgentName')?.value || AppState.settings.agentName;
    speak(`Hello! I'm ${name}, your AI assistant. How can I help you today?`);
  };
  window.__applyTemplate = (key) => {
    const el = document.getElementById('vcSystemPrompt');
    if (el) el.value = TEMPLATES[key] || TEMPLATES.general;
  };
  window.__resetVoiceConfig = () => {
    if (confirm('Reset voice config to defaults?')) {
      AppState.updateSettings({ agentName: 'Priya', language: 'en', ttsRate: 1.0, ttsPitch: 1.0, ttsVolume: 1.0, maxCallDuration: 300, autoEscalate: true, systemPrompt: TEMPLATES.medical });
    }
  };
}

function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}
