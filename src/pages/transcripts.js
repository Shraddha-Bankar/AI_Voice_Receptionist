// ─── Transcripts & Recordings Page ───────────────────────────────────────────
import { AppState } from '../store/appState.js';
import { formatRelative, formatDuration, formatDateTime } from '../utils/formatters.js';
import { getIntentLabel } from '../services/intentDetector.js';

export function renderTranscripts() {
  const calls = AppState.calls.filter(c => (c.transcript && c.transcript.length > 0) || c.summary);
  return `
    <div class="page-content">
      <div class="page-toolbar">
        <div class="toolbar-left">
          <div class="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="txSearch" placeholder="Search transcripts…" oninput="window.__filterTranscripts(this.value)"/>
          </div>
        </div>
        <div class="toolbar-right"><span class="result-count">${calls.length} transcript${calls.length!==1?'s':''}</span></div>
      </div>
      <div class="transcripts-layout">
        <div class="transcript-list" id="transcriptList">${txListItems(AppState.calls)}</div>
        <div class="transcript-detail" id="transcriptDetail">
          <div class="transcript-detail-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="40" height="40" opacity="0.3"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            <span>Select a call to view transcript</span>
          </div>
        </div>
      </div>
    </div>`;
}

function txListItems(calls) {
  if (!calls.length) return '<div class="empty-state-sm">No calls recorded yet</div>';
  return calls.map(c => `
    <div class="tx-list-item" data-id="${c.id}" onclick="window.__viewTranscript('${c.id}')">
      <div class="tx-item-top">
        <div class="cell-user">
          <div class="avatar-sm ${c.sentiment}">${(c.caller||'U')[0]}</div>
          <div><div class="cell-name">${c.caller}</div><div class="cell-sub">${formatRelative(c.time)}</div></div>
        </div>
        <span class="status-pill ${c.status}">${c.status}</span>
      </div>
      ${c.summary ? `<div class="tx-summary">${c.summary}</div>` : ''}
      <div class="tx-meta"><span>${formatDuration(c.duration)}</span><span>${getIntentLabel(c.intent)}</span></div>
    </div>`).join('');
}

export function initTranscripts() {
  window.__viewTranscript = (id) => {
    const call = AppState.calls.find(c => c.id === id);
    if (!call) return;
    document.querySelectorAll('.tx-list-item').forEach(el => el.classList.remove('active'));
    document.querySelector(`.tx-list-item[data-id="${id}"]`)?.classList.add('active');
    const transcript = call.transcript || [];
    const detail = document.getElementById('transcriptDetail');
    if (!detail) return;
    detail.innerHTML = `
      <div class="tx-detail-inner">
        <div class="tx-detail-header">
          <div>
            <div class="tx-detail-title">${call.caller}</div>
            <div class="tx-detail-sub">${formatDateTime(call.time)} · ${formatDuration(call.duration)} · ${getIntentLabel(call.intent)}</div>
          </div>
          <div class="tx-detail-badges">
            <span class="status-pill ${call.status}">${call.status}</span>
            <span class="sentiment-pill ${call.sentiment}">${call.sentiment}</span>
          </div>
        </div>
        ${call.summary ? `<div class="tx-ai-summary"><div class="tx-ai-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/><path d="M12 8v4l3 3"/></svg>AI Summary</div><div>${call.summary}</div></div>` : ''}
        <div class="tx-messages">
          ${transcript.length > 0
            ? transcript.map(t => `<div class="tx-msg ${t.role}"><div class="tx-msg-role">${t.role==='user'?'👤 Caller':'🤖 Agent'}</div><div class="tx-msg-bubble">${t.text}</div>${t.time?`<div class="tx-msg-time">${new Date(t.time).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</div>`:''}</div>`).join('')
            : '<div class="empty-state-sm">No detailed transcript available.</div>'}
        </div>
        <div class="tx-detail-actions">
          <button class="btn btn-ghost" onclick="window.__exportTranscript('${call.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export
          </button>
        </div>
      </div>`;
  };
  window.__filterTranscripts = (q) => {
    const query = (q||'').toLowerCase();
    const filtered = AppState.calls.filter(c => !query || c.caller.toLowerCase().includes(query) || (c.summary||'').toLowerCase().includes(query));
    const list = document.getElementById('transcriptList');
    if (list) list.innerHTML = txListItems(filtered);
  };
  window.__exportTranscript = (id) => {
    const call = AppState.calls.find(c => c.id === id);
    if (!call) return;
    const transcript = (call.transcript||[]).map(t => `[${t.role.toUpperCase()}] ${t.text}`).join('\n');
    const content = `CALL TRANSCRIPT\n===============\nCaller: ${call.caller}\nDate: ${new Date(call.time).toLocaleString('en-IN')}\nDuration: ${formatDuration(call.duration)}\nStatus: ${call.status}\nSentiment: ${call.sentiment}\n\nSummary:\n${call.summary||'N/A'}\n\nTranscript:\n${transcript||'No transcript available'}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `transcript_${call.caller.replace(/\s+/g,'_')}_${call.id}.txt`; a.click();
    URL.revokeObjectURL(url);
  };
}
