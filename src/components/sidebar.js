// ─── Sidebar ─────────────────────────────────────────────────────────────────
import { AppState } from '../store/appState.js';
import { PAGES } from '../utils/constants.js';

const NAV_ITEMS = [
  { page: PAGES.DASHBOARD,     label: 'Dashboard',    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>` },
  { page: PAGES.CALLS,         label: 'Calls',        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1.07h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>` },
  { page: PAGES.APPOINTMENTS,  label: 'Appointments', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>` },
  { page: PAGES.CRM,           label: 'Contacts',     icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>` },
  { page: PAGES.ANALYTICS,     label: 'Analytics',    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>` },
  { page: PAGES.TRANSCRIPTS,   label: 'Transcripts',  icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>` },
  { page: PAGES.NOTIFICATIONS, label: 'Alerts',       icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>`, badge: true },
  { page: PAGES.VOICE_CONFIG,  label: 'Voice Config', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg>` },
  { page: PAGES.SETTINGS,      label: 'Settings',     icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>` },
];

export function renderSidebar() {
  const unread = AppState.unreadCount;
  return `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-brand">
        <div class="sidebar-logo">
          <svg viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="20" fill="url(#logoGrad)"/>
            <defs>
              <radialGradient id="logoGrad" cx="30%" cy="30%">
                <stop offset="0%" stop-color="#818CF8"/>
                <stop offset="100%" stop-color="#4F46E5"/>
              </radialGradient>
            </defs>
            <path d="M13 14a7 7 0 0114 0v5a7 7 0 01-14 0v-5z" fill="white" opacity="0.9"/>
            <circle cx="20" cy="30" r="2" fill="white" opacity="0.7"/>
            <rect x="17" y="26" width="6" height="4" rx="1" fill="white" opacity="0.3"/>
          </svg>
        </div>
        <div class="sidebar-name">
          <span class="sidebar-brand-title">Vaaniai</span>
          <span class="sidebar-brand-sub">Voice AI Platform</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        ${NAV_ITEMS.map(item => `
          <button class="nav-item ${AppState.currentPage === item.page ? 'active' : ''}"
                  data-page="${item.page}" onclick="window.__navigate('${item.page}')">
            <span class="nav-icon">${item.icon}</span>
            <span class="nav-label">${item.label}</span>
            ${item.badge && unread > 0 ? `<span class="nav-badge">${unread}</span>` : ''}
          </button>
        `).join('')}
      </nav>

      <div class="sidebar-footer">
        <div class="agent-status ${AppState.voiceActive ? 'online' : 'offline'}">
          <span class="status-dot"></span>
          <span class="status-text">${AppState.voiceActive ? 'Agent Active' : 'Agent Idle'}</span>
        </div>
      </div>
    </aside>
  `;
}
