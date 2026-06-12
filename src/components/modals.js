// ─── Modals ──────────────────────────────────────────────────────────────────
import { formatDuration, formatDateTime } from '../utils/formatters.js';
import { getIntentLabel } from '../services/intentDetector.js';

export function initModals() {
  window.__openModal = (html) => {
    let overlay = document.getElementById('modalOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'modalOverlay';
      overlay.className = 'modal-overlay';
      overlay.onclick = (e) => { if (e.target === overlay) window.__closeModal(); };
      document.body.appendChild(overlay);
    }
    overlay.innerHTML = html;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.__closeModal = () => {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  };
}

export function callDetailModalHTML(call) {
  const transcript = call.transcript || [];
  return `
    <div class="modal-box modal-lg">
      <div class="modal-header">
        <div class="modal-title-group">
          <h2 class="modal-title">Call Details</h2>
          <span class="modal-sub">${call.caller} · ${formatDateTime(call.time)}</span>
        </div>
        <button class="modal-close" onclick="window.__closeModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="detail-chips">
          <span class="chip"><span class="chip-label">Duration</span>${formatDuration(call.duration)}</span>
          <span class="chip"><span class="chip-label">Status</span><span class="status-pill ${call.status}">${call.status}</span></span>
          <span class="chip"><span class="chip-label">Sentiment</span><span class="sentiment-pill ${call.sentiment}">${call.sentiment}</span></span>
          <span class="chip"><span class="chip-label">Intent</span>${getIntentLabel(call.intent)}</span>
          <span class="chip"><span class="chip-label">Phone</span>${call.phone || '—'}</span>
        </div>
        ${call.summary ? `
          <div class="detail-section">
            <div class="detail-section-title">AI Summary</div>
            <div class="detail-summary">${call.summary}</div>
          </div>` : ''}
        <div class="detail-section">
          <div class="detail-section-title">Transcript</div>
          <div class="transcript-scroll">
            ${transcript.length > 0
              ? transcript.map(t => `
                <div class="transcript-line ${t.role}">
                  <span class="t-role">${t.role === 'user' ? '👤 Caller' : '🤖 Agent'}</span>
                  <span class="t-text">${t.text}</span>
                  ${t.time ? `<span class="t-time">${new Date(t.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>` : ''}
                </div>`).join('')
              : '<div class="empty-state-sm">No transcript available</div>'}
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="window.__closeModal()">Close</button>
        <button class="btn btn-danger" onclick="window.__escalateCall('${call.id}'); window.__closeModal();">Escalate</button>
      </div>
    </div>`;
}

export function appointmentModalHTML(existing = null) {
  const a = existing || {};
  const isEdit = !!existing;
  const doctors = ['Dr. Priya Sharma', 'Dr. Rajesh Kumar', 'Dr. Anita Desai', 'Dr. Vikram Nair', 'Dr. Meera Iyer'];
  const types   = ['Consultation', 'Follow-up', 'Lab Test', 'X-Ray', 'Procedure', 'Emergency'];
  return `
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title-group">
          <h2 class="modal-title">${isEdit ? 'Edit Appointment' : 'New Appointment'}</h2>
        </div>
        <button class="modal-close" onclick="window.__closeModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-grid">
          <div class="form-field">
            <label class="form-label">Patient Name *</label>
            <input class="form-input" id="apptName" type="text" placeholder="Full name" value="${a.name || ''}"/>
          </div>
          <div class="form-field">
            <label class="form-label">Phone</label>
            <input class="form-input" id="apptPhone" type="tel" placeholder="+91 XXXXX XXXXX" value="${a.phone || ''}"/>
          </div>
          <div class="form-field">
            <label class="form-label">Doctor *</label>
            <select class="form-input" id="apptDoctor">
              <option value="">Select doctor…</option>
              ${doctors.map(d => `<option value="${d}" ${a.doctor === d ? 'selected' : ''}>${d}</option>`).join('')}
            </select>
          </div>
          <div class="form-field">
            <label class="form-label">Type</label>
            <select class="form-input" id="apptType">
              ${types.map(t => `<option value="${t}" ${a.type === t ? 'selected' : ''}>${t}</option>`).join('')}
            </select>
          </div>
          <div class="form-field">
            <label class="form-label">Date *</label>
            <input class="form-input" id="apptDate" type="date" value="${a.date ? a.date.slice(0, 10) : ''}"/>
          </div>
          <div class="form-field">
            <label class="form-label">Time *</label>
            <input class="form-input" id="apptTime" type="time" value="${a.time || ''}"/>
          </div>
          <div class="form-field full-width">
            <label class="form-label">Notes</label>
            <textarea class="form-input form-textarea" id="apptNotes" placeholder="Any additional notes…">${a.notes || ''}</textarea>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="window.__closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="window.__saveAppointment('${a.id || ''}')">
          ${isEdit ? 'Save Changes' : 'Book Appointment'}
        </button>
      </div>
    </div>`;
}

export function contactModalHTML(existing = null) {
  const c = existing || {};
  const isEdit = !!existing;
  return `
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title-group">
          <h2 class="modal-title">${isEdit ? 'Edit Contact' : 'New Contact'}</h2>
        </div>
        <button class="modal-close" onclick="window.__closeModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-grid">
          <div class="form-field">
            <label class="form-label">Full Name *</label>
            <input class="form-input" id="crmName" type="text" placeholder="Patient name" value="${c.name || ''}"/>
          </div>
          <div class="form-field">
            <label class="form-label">Phone *</label>
            <input class="form-input" id="crmPhone" type="tel" placeholder="+91 XXXXX XXXXX" value="${c.phone || ''}"/>
          </div>
          <div class="form-field">
            <label class="form-label">Email</label>
            <input class="form-input" id="crmEmail" type="email" placeholder="email@example.com" value="${c.email || ''}"/>
          </div>
          <div class="form-field">
            <label class="form-label">Tag</label>
            <select class="form-input" id="crmTag">
              <option value="patient"  ${c.tag === 'patient'  ? 'selected' : ''}>Patient</option>
              <option value="vip"      ${c.tag === 'vip'      ? 'selected' : ''}>VIP</option>
              <option value="followup" ${c.tag === 'followup' ? 'selected' : ''}>Follow-up</option>
              <option value="new"      ${c.tag === 'new'      ? 'selected' : ''}>New</option>
            </select>
          </div>
          <div class="form-field full-width">
            <label class="form-label">Notes</label>
            <textarea class="form-input form-textarea" id="crmNotes" placeholder="Medical notes, preferences…">${c.notes || ''}</textarea>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="window.__closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="window.__saveContact('${c.id || ''}')">
          ${isEdit ? 'Save Changes' : 'Add Contact'}
        </button>
      </div>
    </div>`;
}

export function escalationModalHTML(call) {
  return `
    <div class="modal-box">
      <div class="modal-header">
        <div class="modal-title-group">
          <h2 class="modal-title">Escalate Call</h2>
          <span class="modal-sub">${call.caller}</span>
        </div>
        <button class="modal-close" onclick="window.__closeModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="escalation-alert">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          This will mark the call as escalated and notify the on-call team.
        </div>
        <div class="form-field">
          <label class="form-label">Escalation Reason</label>
          <select class="form-input" id="escalReason">
            <option>Caller requested human agent</option>
            <option>Complex medical query</option>
            <option>Complaint / dissatisfaction</option>
            <option>Technical issue</option>
            <option>Other</option>
          </select>
        </div>
        <div class="form-field">
          <label class="form-label">Additional Notes</label>
          <textarea class="form-input form-textarea" id="escalNotes" placeholder="Describe the situation…"></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="window.__closeModal()">Cancel</button>
        <button class="btn btn-danger" onclick="window.__confirmEscalation('${call.id}')">Confirm Escalation</button>
      </div>
    </div>`;
}
