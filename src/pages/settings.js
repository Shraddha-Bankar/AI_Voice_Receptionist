// ─── Settings Page ────────────────────────────────────────────────────────────
import { AppState } from '../store/appState.js';

export function renderSettings() {
  const s = AppState.settings;
  return `
    <div class="page-content">
      <div class="settings-grid">
        <div class="card settings-card">
          <div class="settings-card-title">AI Model & API</div>
          <div class="settings-card-sub">Configure your LLM provider and model</div>
          <div class="form-grid">
            <div class="form-field full-width">
              <label class="form-label">OpenRouter API Key</label>
              <input class="form-input" id="stApiKey" type="password" placeholder="sk-or-v1-…" value="${s.openrouterKey && !s.openrouterKey.includes('PASTE') ? s.openrouterKey : ''}"/>
              <span class="form-hint">Get your key at <a href="https://openrouter.ai" target="_blank" style="color:var(--accent)">openrouter.ai</a>. Leave blank to use simulation mode.</span>
            </div>
            <div class="form-field full-width">
              <label class="form-label">Model</label>
              <select class="form-input" id="stModel">
                <option value="openai/gpt-4o-mini" ${s.model==='openai/gpt-4o-mini'?'selected':''}>GPT-4o Mini (fast, cheap)</option>
                <option value="openai/gpt-4o" ${s.model==='openai/gpt-4o'?'selected':''}>GPT-4o (best quality)</option>
                <option value="anthropic/claude-3-haiku" ${s.model==='anthropic/claude-3-haiku'?'selected':''}>Claude 3 Haiku (fast)</option>
                <option value="anthropic/claude-3-5-sonnet" ${s.model==='anthropic/claude-3-5-sonnet'?'selected':''}>Claude 3.5 Sonnet</option>
                <option value="google/gemini-flash-1.5" ${s.model==='google/gemini-flash-1.5'?'selected':''}>Gemini 1.5 Flash</option>
                <option value="meta-llama/llama-3.1-8b-instruct" ${s.model==='meta-llama/llama-3.1-8b-instruct'?'selected':''}>Llama 3.1 8B (free tier)</option>
              </select>
            </div>
          </div>
        </div>

        <div class="card settings-card">
          <div class="settings-card-title">Clinic Information</div>
          <div class="settings-card-sub">Details your agent uses when answering patient queries</div>
          <div class="form-grid">
            <div class="form-field"><label class="form-label">Clinic Name</label><input class="form-input" id="stClinicName" type="text" value="${s.clinicName||''}" placeholder="e.g. City Care Clinic"/></div>
            <div class="form-field"><label class="form-label">Phone Number</label><input class="form-input" id="stClinicPhone" type="tel" value="${s.clinicPhone||''}" placeholder="+91 XXXXX XXXXX"/></div>
            <div class="form-field"><label class="form-label">Opening Hours</label><input class="form-input" id="stHours" type="text" value="${s.clinicHours||'Mon–Sat 9AM–7PM'}" placeholder="Mon–Sat 9AM–7PM"/></div>
            <div class="form-field"><label class="form-label">Address</label><input class="form-input" id="stAddress" type="text" value="${s.clinicAddress||''}" placeholder="Full clinic address"/></div>
          </div>
        </div>

        <div class="card settings-card">
          <div class="settings-card-title">Notifications</div>
          <div class="settings-card-sub">Control when and how you receive alerts</div>
          <div class="form-field"><label class="toggle-row"><span class="form-label" style="margin:0">Email Escalation Alerts</span><input type="checkbox" id="stEmailEscalation" class="toggle-input" ${s.emailEscalation?'checked':''}/><span class="toggle-track"></span></label></div>
          <div class="form-field"><label class="toggle-row"><span class="form-label" style="margin:0">Missed Call Alerts</span><input type="checkbox" id="stMissedCallAlert" class="toggle-input" ${s.missedCallAlert!==false?'checked':''}/><span class="toggle-track"></span></label></div>
          <div class="form-field"><label class="toggle-row"><span class="form-label" style="margin:0">Daily Summary Report</span><input type="checkbox" id="stDailySummary" class="toggle-input" ${s.dailySummary?'checked':''}/><span class="toggle-track"></span></label></div>
        </div>

        <div class="card settings-card">
          <div class="settings-card-title">Data & Privacy</div>
          <div class="settings-card-sub">Manage your call data and storage</div>
          <div class="danger-zone">
            <div class="danger-zone-item">
              <div><div class="danger-title">Clear Call Logs</div><div class="danger-sub">Permanently delete all call records. This cannot be undone.</div></div>
              <button class="btn btn-danger" onclick="window.__clearCallLogs()">Clear Logs</button>
            </div>
            <div class="danger-zone-item">
              <div><div class="danger-title">Reset All Data</div><div class="danger-sub">Reset all data to factory defaults including contacts and appointments.</div></div>
              <button class="btn btn-danger" onclick="window.__resetAllData()">Reset All</button>
            </div>
          </div>
        </div>

        <div class="card settings-card">
          <div class="settings-card-title">About Vaaniai</div>
          <div class="about-grid">
            <div class="about-item"><span class="about-label">Version</span><span class="about-val">1.0.0</span></div>
            <div class="about-item"><span class="about-label">Platform</span><span class="about-val">Web (Vanilla JS)</span></div>
            <div class="about-item"><span class="about-label">Speech Engine</span><span class="about-val">Web Speech API</span></div>
            <div class="about-item"><span class="about-label">LLM Provider</span><span class="about-val">OpenRouter</span></div>
          </div>
        </div>

        <div class="settings-actions">
          <button class="btn btn-ghost" onclick="window.__navigate('${AppState.currentPage}')">Cancel</button>
          <button class="btn btn-primary" onclick="window.__saveSettings()">Save Settings</button>
        </div>
      </div>
    </div>`;
}

export function initSettings() {
  window.__saveSettings = () => {
    const apiKeyVal = document.getElementById('stApiKey')?.value.trim() || '';
    if (apiKeyVal) localStorage.setItem('vaaniai_apikey', apiKeyVal);
    AppState.updateSettings({
      openrouterKey:   document.getElementById('stApiKey')?.value.trim() || '',
      model:           document.getElementById('stModel')?.value || AppState.settings.model,
      clinicName:      document.getElementById('stClinicName')?.value.trim() || '',
      clinicPhone:     document.getElementById('stClinicPhone')?.value.trim() || '',
      clinicHours:     document.getElementById('stHours')?.value.trim() || '',
      clinicAddress:   document.getElementById('stAddress')?.value.trim() || '',
      emailEscalation: document.getElementById('stEmailEscalation')?.checked || false,
      missedCallAlert: document.getElementById('stMissedCallAlert')?.checked ?? true,
      dailySummary:    document.getElementById('stDailySummary')?.checked || false,
    });
    showToast('Settings saved!');
  };
  window.__clearCallLogs = () => { if (confirm('Delete all call logs?')) { AppState.calls = []; AppState.notify(); showToast('Call logs cleared.'); } };
  window.__resetAllData = () => { if (confirm('Reset ALL data to defaults?')) location.reload(); };
}

function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}
