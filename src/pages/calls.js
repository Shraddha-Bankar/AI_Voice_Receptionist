// ─── Calls Page ──────────────────────────────────────────────────────────────
import { AppState } from '../store/appState.js';
import { formatRelative, formatDuration } from '../utils/formatters.js';
import { getIntentLabel } from '../services/intentDetector.js';
import { callDetailModalHTML, escalationModalHTML } from '../components/modals.js';

export function renderCalls() {
  const calls = AppState.calls;
  return `
    <div class="page-content">
      <div class="page-toolbar">
        <div class="toolbar-left">
          <div class="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="callSearch" placeholder="Search calls…" oninput="window.__filterCalls(this.value)"/>
          </div>
          <select class="filter-select" id="callStatusFilter" onchange="window.__filterCalls()">
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="missed">Missed</option>
            <option value="escalated">Escalated</option>
          </select>
          <select class="filter-select" id="callSentFilter" onchange="window.__filterCalls()">
            <option value="">All Sentiment</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
        </div>
        <div class="toolbar-right">
          <span class="result-count">${calls.length} calls</span>
        </div>
      </div>
      <div class="card table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Caller</th><th>Time</th><th>Duration</th><th>Intent</th>
              <th>Sentiment</th><th>Status</th><th>Summary</th><th>Actions</th>
            </tr>
          </thead>
          <tbody id="callsBody">${callRows(calls)}</tbody>
        </table>
        ${calls.length === 0 ? '<div class="empty-state">No calls recorded yet</div>' : ''}
      </div>
    </div>`;
}

export function callRows(calls) {
  return calls.map(c => `
    <tr class="table-row" data-id="${c.id}">
      <td>
        <div class="cell-user">
          <div class="avatar-sm ${c.sentiment}">${(c.caller || 'U')[0]}</div>
          <div><div class="cell-name">${c.caller}</div><div class="cell-sub">${c.phone}</div></div>
        </div>
      </td>
      <td class="cell-muted">${formatRelative(c.time)}</td>
      <td class="cell-mono">${formatDuration(c.duration)}</td>
      <td><span class="intent-tag">${getIntentLabel(c.intent)}</span></td>
      <td><span class="sentiment-pill ${c.sentiment}">${c.sentiment}</span></td>
      <td><span class="status-pill ${c.status}">${c.status}</span></td>
      <td class="cell-summary">${c.summary || '—'}</td>
      <td>
        <div class="row-actions">
          <button class="action-btn" title="View" onclick="window.__viewCall('${c.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button class="action-btn danger" title="Escalate" onclick="window.__escalateCall('${c.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </button>
        </div>
      </td>
    </tr>`).join('');
}

export function initCalls() {
  window.__filterCalls = (query) => {
    const q = (query || document.getElementById('callSearch')?.value || '').toLowerCase();
    const status = document.getElementById('callStatusFilter')?.value || '';
    const sent   = document.getElementById('callSentFilter')?.value || '';
    const filtered = AppState.calls.filter(c => {
      const matchQ = !q || c.caller.toLowerCase().includes(q) || (c.summary || '').toLowerCase().includes(q);
      return matchQ && (!status || c.status === status) && (!sent || c.sentiment === sent);
    });
    const body = document.getElementById('callsBody');
    if (body) body.innerHTML = callRows(filtered);
  };
  window.__viewCall = (id) => {
    const call = AppState.calls.find(c => c.id === id);
    if (call) window.__openModal(callDetailModalHTML(call));
  };
  window.__escalateCall = (id) => {
    const call = AppState.calls.find(c => c.id === id);
    if (call) window.__openModal(escalationModalHTML(call));
  };
}
