// ─── Topbar ──────────────────────────────────────────────────────────────────
import { AppState } from '../store/appState.js';
import { PAGES } from '../utils/constants.js';

const PAGE_TITLES = {
  [PAGES.DASHBOARD]:     { title: 'Dashboard',    sub: 'Overview of your voice agent activity' },
  [PAGES.CALLS]:         { title: 'Call Logs',    sub: 'All inbound and outbound calls' },
  [PAGES.APPOINTMENTS]:  { title: 'Appointments', sub: 'Scheduled and upcoming bookings' },
  [PAGES.CRM]:           { title: 'Contacts',     sub: 'Customer relationship management' },
  [PAGES.ANALYTICS]:     { title: 'Analytics',    sub: 'Performance insights and trends' },
  [PAGES.TRANSCRIPTS]:   { title: 'Transcripts',  sub: 'Call recordings and transcripts' },
  [PAGES.NOTIFICATIONS]: { title: 'Alerts',       sub: 'System notifications and escalations' },
  [PAGES.VOICE_CONFIG]:  { title: 'Voice Config', sub: 'Configure your AI voice agent' },
  [PAGES.SETTINGS]:      { title: 'Settings',     sub: 'Account and integration settings' },
};

export function renderTopbar() {
  const { title, sub } = PAGE_TITLES[AppState.currentPage] || { title: 'Vaaniai', sub: '' };
  const unread = AppState.unreadCount;
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return `
    <header class="topbar">
      <div class="topbar-left">
        <button class="sidebar-toggle" onclick="window.__toggleSidebar()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
            <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div class="page-title-group">
          <h1 class="page-title">${title}</h1>
          <p class="page-sub">${sub}</p>
        </div>
      </div>
      <div class="topbar-right">
        <span class="topbar-date">${today}</span>
        <button class="topbar-btn ${AppState.voiceActive ? 'active-pulse' : ''}" onclick="window.__navigate('${PAGES.VOICE_CONFIG}')" title="Voice Agent">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 010 7.07"/>
          </svg>
          ${AppState.voiceActive ? '<span class="btn-dot"></span>' : ''}
        </button>
        <button class="topbar-btn" onclick="window.__navigate('${PAGES.NOTIFICATIONS}')" title="Notifications">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          ${unread > 0 ? `<span class="notif-badge">${unread}</span>` : ''}
        </button>
        <div class="topbar-avatar">
          <div class="avatar-ring"><span>A</span></div>
        </div>
      </div>
    </header>
  `;
}
