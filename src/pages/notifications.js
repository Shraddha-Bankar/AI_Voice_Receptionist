// ─── Notifications Page ───────────────────────────────────────────────────────
import { AppState } from '../store/appState.js';
import { formatRelative } from '../utils/formatters.js';

const NOTIF_ICONS = {
  escalation: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  system:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  appointment:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  call:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1.07h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>`,
};
const NOTIF_COLORS = { escalation: '#F87171', system: '#818CF8', appointment: '#6EE7B7', call: '#FCD34D' };

export function renderNotifications() {
  const notifs = AppState.notifications;
  const unread = AppState.unreadCount;
  return `
    <div class="page-content">
      <div class="page-toolbar">
        <div class="toolbar-left">
          ${unread > 0 ? `<span class="result-count">${unread} unread</span>` : '<span class="result-count">All caught up!</span>'}
        </div>
        <div class="toolbar-right">
          ${unread > 0 ? `<button class="btn btn-ghost" onclick="window.__markAllRead()">Mark all as read</button>` : ''}
          <button class="btn btn-ghost danger-text" onclick="window.__clearAllNotifs()">Clear all</button>
        </div>
      </div>
      <div class="notif-list card" id="notifList">
        ${notifItems(notifs)}
        ${notifs.length === 0 ? '<div class="empty-state">No notifications</div>' : ''}
      </div>
    </div>`;
}

function notifItems(notifs) {
  return notifs.map(n => `
    <div class="notif-item ${n.read ? '' : 'unread'}" data-id="${n.id}" onclick="window.__readNotif('${n.id}')">
      <div class="notif-icon" style="color:${NOTIF_COLORS[n.type]||'#818CF8'};background:${NOTIF_COLORS[n.type]||'#818CF8'}18">
        ${NOTIF_ICONS[n.type] || NOTIF_ICONS.system}
      </div>
      <div class="notif-body">
        <div class="notif-title">${n.title}</div>
        <div class="notif-message">${n.message}</div>
        <div class="notif-time">${formatRelative(n.time)}</div>
      </div>
      ${!n.read ? '<div class="notif-dot"></div>' : ''}
      <button class="action-btn notif-dismiss" title="Dismiss" onclick="event.stopPropagation();window.__dismissNotif('${n.id}')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>`).join('');
}

export function initNotifications() {
  window.__readNotif = (id) => {
    AppState.markNotificationRead(id);
    const el = document.querySelector(`.notif-item[data-id="${id}"]`);
    if (el) { el.classList.remove('unread'); el.querySelector('.notif-dot')?.remove(); }
  };
  window.__markAllRead = () => { AppState.markAllRead(); const l = document.getElementById('notifList'); if (l) l.innerHTML = notifItems(AppState.notifications); };
  window.__dismissNotif = (id) => {
    AppState.notifications = AppState.notifications.filter(n => n.id !== id);
    AppState.notify();
    const l = document.getElementById('notifList');
    if (l) l.innerHTML = notifItems(AppState.notifications) || '<div class="empty-state">No notifications</div>';
  };
  window.__clearAllNotifs = () => { if (confirm('Clear all notifications?')) { AppState.notifications = []; AppState.notify(); } };
}
