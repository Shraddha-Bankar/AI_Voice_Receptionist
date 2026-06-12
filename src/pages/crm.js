// ─── CRM Contacts Page ───────────────────────────────────────────────────────
import { AppState } from '../store/appState.js';
import { formatRelative } from '../utils/formatters.js';
import { contactModalHTML } from '../components/modals.js';

const TAG_COLORS = { patient: '#818CF8', vip: '#FCD34D', followup: '#FB923C', new: '#6EE7B7' };

export function renderCRM() {
  const contacts = AppState.contacts;
  return `
    <div class="page-content">
      <div class="page-toolbar">
        <div class="toolbar-left">
          <div class="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="crmSearch" placeholder="Search contacts…" oninput="window.__filterContacts(this.value)"/>
          </div>
          <select class="filter-select" id="crmTagFilter" onchange="window.__filterContacts()">
            <option value="">All Tags</option>
            <option value="patient">Patient</option><option value="vip">VIP</option>
            <option value="followup">Follow-up</option><option value="new">New</option>
          </select>
        </div>
        <div class="toolbar-right">
          <span class="result-count">${contacts.length} contacts</span>
          <button class="btn btn-primary" onclick="window.__newContact()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Contact
          </button>
        </div>
      </div>
      <div class="crm-grid" id="contactsGrid">${contactCards(contacts)}</div>
      ${contacts.length === 0 ? '<div class="empty-state card">No contacts yet.</div>' : ''}
    </div>`;
}

function contactCards(contacts) {
  return contacts.map(c => {
    const callCount = AppState.calls.filter(call => call.phone === c.phone).length;
    const tagColor = TAG_COLORS[c.tag] || '#D1D5DB';
    return `
      <div class="contact-card card" data-id="${c.id}">
        <div class="contact-card-top">
          <div class="contact-avatar" style="background:linear-gradient(135deg,${tagColor}44,${tagColor}22)">
            <span style="color:${tagColor}">${(c.name||'C')[0].toUpperCase()}</span>
          </div>
          <div class="contact-card-actions">
            <button class="action-btn" title="Edit" onclick="window.__editContact('${c.id}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="action-btn danger" title="Delete" onclick="window.__deleteContact('${c.id}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </button>
          </div>
        </div>
        <div class="contact-info">
          <div class="contact-name">${c.name}</div>
          <div class="contact-phone">${c.phone}</div>
          ${c.email ? `<div class="contact-email">${c.email}</div>` : ''}
          ${c.notes ? `<div class="contact-notes">${c.notes}</div>` : ''}
        </div>
        <div class="contact-card-footer">
          <span class="contact-tag" style="background:${tagColor}22;color:${tagColor}">${c.tag||'patient'}</span>
          <span class="contact-meta">${callCount} call${callCount!==1?'s':''}</span>
          ${c.lastContact ? `<span class="contact-meta">${formatRelative(c.lastContact)}</span>` : ''}
        </div>
      </div>`;
  }).join('');
}

export function initCRM() {
  window.__newContact = () => window.__openModal(contactModalHTML(null));
  window.__editContact = (id) => {
    const c = AppState.contacts.find(c => c.id === id);
    if (c) window.__openModal(contactModalHTML(c));
  };
  window.__deleteContact = (id) => {
    const c = AppState.contacts.find(c => c.id === id);
    if (c && confirm(`Delete contact ${c.name}?`)) { AppState.contacts = AppState.contacts.filter(c => c.id !== id); AppState.notify(); }
  };
  window.__saveContact = (id) => {
    const name = document.getElementById('crmName')?.value.trim();
    const phone = document.getElementById('crmPhone')?.value.trim();
    const email = document.getElementById('crmEmail')?.value.trim();
    const tag = document.getElementById('crmTag')?.value;
    const notes = document.getElementById('crmNotes')?.value.trim();
    if (!name || !phone) { alert('Name and Phone are required.'); return; }
    if (id) {
      const c = AppState.contacts.find(c => c.id === id);
      if (c) Object.assign(c, { name, phone, email, tag, notes });
      AppState.notify();
    } else {
      AppState.addContact({ id: 'con' + Date.now(), name, phone, email, tag, notes, lastContact: new Date().toISOString() });
    }
    window.__closeModal();
  };
  window.__filterContacts = () => {
    const q = document.getElementById('crmSearch')?.value.toLowerCase() || '';
    const tag = document.getElementById('crmTagFilter')?.value || '';
    const filtered = AppState.contacts.filter(c => {
      const matchQ = !q || c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.email||'').toLowerCase().includes(q);
      return matchQ && (!tag || c.tag === tag);
    });
    const grid = document.getElementById('contactsGrid');
    if (grid) grid.innerHTML = contactCards(filtered);
  };
}
