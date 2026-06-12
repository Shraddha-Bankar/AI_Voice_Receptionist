// ─── Appointments Page ────────────────────────────────────────────────────────
import { AppState } from '../store/appState.js';
import { formatDateTime } from '../utils/formatters.js';
import { appointmentModalHTML } from '../components/modals.js';

export function renderAppointments() {
  const appts = AppState.appointments;
  const upcoming = appts.filter(a => a.status !== 'completed' && a.status !== 'cancelled');
  const past     = appts.filter(a => a.status === 'completed' || a.status === 'cancelled');
  return `
    <div class="page-content">
      <div class="page-toolbar">
        <div class="toolbar-left">
          <div class="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="apptSearch" placeholder="Search appointments…" oninput="window.__filterAppts(this.value)"/>
          </div>
          <select class="filter-select" id="apptDoctorFilter" onchange="window.__filterAppts()">
            <option value="">All Doctors</option>
            <option>Dr. Priya Sharma</option><option>Dr. Rajesh Kumar</option>
            <option>Dr. Anita Desai</option><option>Dr. Vikram Nair</option><option>Dr. Meera Iyer</option>
          </select>
        </div>
        <div class="toolbar-right">
          <button class="btn btn-primary" onclick="window.__newAppointment()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Appointment
          </button>
        </div>
      </div>
      <div id="apptContent">${apptContent(upcoming, past)}</div>
    </div>`;
}

function apptContent(upcoming, past) {
  return `
    <div class="appt-sections">
      <div class="section-header"><span class="section-title">Upcoming</span><span class="section-count">${upcoming.length}</span></div>
      <div class="card table-card">
        <table class="data-table">
          <thead><tr><th>Patient</th><th>Doctor</th><th>Type</th><th>Date & Time</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="upcomingBody">${apptRows(upcoming)}</tbody>
        </table>
        ${upcoming.length === 0 ? '<div class="empty-state">No upcoming appointments</div>' : ''}
      </div>
      <div class="section-header" style="margin-top:1.5rem"><span class="section-title">Past</span><span class="section-count">${past.length}</span></div>
      <div class="card table-card">
        <table class="data-table">
          <thead><tr><th>Patient</th><th>Doctor</th><th>Type</th><th>Date & Time</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>${apptRows(past)}</tbody>
        </table>
        ${past.length === 0 ? '<div class="empty-state">No past appointments</div>' : ''}
      </div>
    </div>`;
}

function apptRows(appts) {
  return appts.map(a => `
    <tr class="table-row" data-id="${a.id}">
      <td>
        <div class="cell-user">
          <div class="avatar-sm positive">${(a.name || 'P')[0]}</div>
          <div><div class="cell-name">${a.name}</div><div class="cell-sub">${a.phone || '—'}</div></div>
        </div>
      </td>
      <td class="cell-muted">${a.doctor}</td>
      <td><span class="intent-tag">${a.type}</span></td>
      <td class="cell-mono">${formatDateTime(a.date + 'T' + (a.time || '00:00'))}</td>
      <td><span class="status-pill ${a.status}">${a.status}</span></td>
      <td>
        <div class="row-actions">
          <button class="action-btn" title="Edit" onclick="window.__editAppointment('${a.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="action-btn danger" title="Cancel" onclick="window.__cancelAppointment('${a.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          </button>
        </div>
      </td>
    </tr>`).join('');
}

export function initAppointments() {
  window.__newAppointment = () => window.__openModal(appointmentModalHTML(null));
  window.__editAppointment = (id) => {
    const a = AppState.appointments.find(a => a.id === id);
    if (a) window.__openModal(appointmentModalHTML(a));
  };
  window.__cancelAppointment = (id) => {
    const a = AppState.appointments.find(a => a.id === id);
    if (a && confirm(`Cancel appointment for ${a.name}?`)) { a.status = 'cancelled'; AppState.notify(); }
  };
  window.__saveAppointment = (id) => {
    const name = document.getElementById('apptName')?.value.trim();
    const phone = document.getElementById('apptPhone')?.value.trim();
    const doctor = document.getElementById('apptDoctor')?.value;
    const type = document.getElementById('apptType')?.value;
    const date = document.getElementById('apptDate')?.value;
    const time = document.getElementById('apptTime')?.value;
    const notes = document.getElementById('apptNotes')?.value.trim();
    if (!name || !doctor || !date) { alert('Please fill in Name, Doctor and Date.'); return; }
    if (id) {
      const a = AppState.appointments.find(a => a.id === id);
      if (a) Object.assign(a, { name, phone, doctor, type, date, time, notes });
      AppState.notify();
    } else {
      AppState.addAppointment({ id: 'a' + Date.now(), name, phone, doctor, type, date, time, notes, status: 'scheduled' });
    }
    window.__closeModal();
  };
  window.__filterAppts = () => {
    const q = document.getElementById('apptSearch')?.value.toLowerCase() || '';
    const doc = document.getElementById('apptDoctorFilter')?.value || '';
    const filtered = AppState.appointments.filter(a => {
      const matchQ = !q || a.name.toLowerCase().includes(q) || (a.doctor || '').toLowerCase().includes(q);
      return matchQ && (!doc || a.doctor === doc);
    });
    const el = document.getElementById('apptContent');
    if (el) el.innerHTML = apptContent(
      filtered.filter(a => a.status !== 'completed' && a.status !== 'cancelled'),
      filtered.filter(a => a.status === 'completed' || a.status === 'cancelled')
    );
  };
}
