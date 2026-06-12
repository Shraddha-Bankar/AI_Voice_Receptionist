// ─── Dashboard Page ──────────────────────────────────────────────────────────
import { AppState } from '../store/appState.js';
import { renderBarChart, renderSentimentBar, renderDonutChart } from '../components/charts.js';
import { renderVoiceOrb } from '../components/voiceOrb.js';
import { formatRelative, formatDuration } from '../utils/formatters.js';
import { INTENTS, PAGES } from '../utils/constants.js';
import { getIntentLabel, getIntentColor } from '../services/intentDetector.js';

export function renderDashboard() {
  const calls = AppState.calls;
  const now = new Date();
  const todayCalls = calls.filter(c => new Date(c.time).toDateString() === now.toDateString());
  const totalToday = todayCalls.length;
  const completed  = todayCalls.filter(c => c.status === 'completed').length;
  const missed     = todayCalls.filter(c => c.status === 'missed').length;
  const avgDur     = completed > 0
    ? Math.round(todayCalls.filter(c => c.duration > 0).reduce((s, c) => s + c.duration, 0) / Math.max(completed, 1))
    : 0;
  const pos = calls.filter(c => c.sentiment === 'positive').length;
  const neu = calls.filter(c => c.sentiment === 'neutral').length;
  const neg = calls.filter(c => c.sentiment === 'negative').length;

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now); d.setDate(d.getDate() - (6 - i));
    return {
      label: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      value: calls.filter(c => new Date(c.time).toDateString() === d.toDateString()).length,
    };
  });

  const intentCounts = Object.values(INTENTS).reduce((acc, k) => {
    acc[k] = calls.filter(c => c.intent === k).length; return acc;
  }, {});
  const intentSegments = Object.entries(intentCounts)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ label: getIntentLabel(k), value: v, color: getIntentColor(k) }));

  const recentCalls = calls.slice(0, 5);

  return `
    <div class="page-content dashboard-page">
      <div class="dashboard-grid">
        <div class="stats-row">
          ${statCard('Total Calls Today', totalToday, '#818CF8')}
          ${statCard('Completed', completed, '#6EE7B7')}
          ${statCard('Missed', missed, '#F87171')}
          ${statCard('Avg Duration', formatDuration(avgDur), '#FCD34D')}
        </div>

        <div class="main-row">
          <div class="card orb-card">
            <div class="card-header">
              <span class="card-title">Live Voice Agent</span>
              <span class="card-badge ${AppState.voiceActive ? 'badge-green' : 'badge-gray'}">
                ${AppState.voiceActive ? '● Live' : '○ Idle'}
              </span>
            </div>
            ${renderVoiceOrb()}
          </div>
          <div class="card recent-calls-card">
            <div class="card-header">
              <span class="card-title">Recent Calls</span>
              <button class="card-link" onclick="window.__navigate('${PAGES.CALLS}')">View all →</button>
            </div>
            <div class="recent-calls-list">
              ${recentCalls.map(c => `
                <div class="recent-call-row" onclick="window.__viewCall('${c.id}')">
                  <div class="call-avatar ${c.sentiment}">${(c.caller || 'U')[0]}</div>
                  <div class="call-info">
                    <div class="call-name">${c.caller}</div>
                    <div class="call-meta">${formatRelative(c.time)} · ${formatDuration(c.duration)}</div>
                  </div>
                  <div class="call-right"><span class="status-pill ${c.status}">${c.status}</span></div>
                </div>`).join('')}
              ${recentCalls.length === 0 ? '<div class="empty-state-sm">No calls yet</div>' : ''}
            </div>
          </div>
        </div>

        <div class="charts-row">
          <div class="card chart-card">
            <div class="card-header"><span class="card-title">Call Volume — Last 7 Days</span></div>
            <div class="chart-wrap">${renderBarChart(days, { width: 460, height: 150, color: '#818CF8' })}</div>
          </div>
          <div class="card chart-card small">
            <div class="card-header"><span class="card-title">Intent Breakdown</span></div>
            <div class="donut-wrap">
              ${intentSegments.length > 0 ? renderDonutChart(intentSegments, { size: 110, strokeWidth: 16 }) : '<div class="empty-state-sm">No data yet</div>'}
              <div class="intent-legend">
                ${intentSegments.map(s => `
                  <div class="legend-row">
                    <span class="legend-dot" style="background:${s.color}"></span>
                    <span class="legend-label">${s.label}</span>
                    <span class="legend-val">${s.value}</span>
                  </div>`).join('')}
              </div>
            </div>
          </div>
          <div class="card chart-card small">
            <div class="card-header"><span class="card-title">Sentiment Overview</span></div>
            <div class="sentiment-wrap">
              ${renderSentimentBar(pos, neu, neg)}
              <div class="sentiment-stats">
                <div class="sent-stat pos"><span class="sent-num">${pos}</span><span class="sent-lbl">Positive</span></div>
                <div class="sent-stat neu"><span class="sent-num">${neu}</span><span class="sent-lbl">Neutral</span></div>
                <div class="sent-stat neg"><span class="sent-num">${neg}</span><span class="sent-lbl">Negative</span></div>
              </div>
            </div>
          </div>
        </div>

        <div class="card appt-card">
          <div class="card-header">
            <span class="card-title">Upcoming Appointments</span>
            <button class="card-link" onclick="window.__navigate('${PAGES.APPOINTMENTS}')">View all →</button>
          </div>
          <div class="appt-list">
            ${AppState.appointments.filter(a => a.status !== 'completed').slice(0, 4).map(a => `
              <div class="appt-row">
                <div class="appt-dot"></div>
                <div class="appt-info">
                  <span class="appt-name">${a.name}</span>
                  <span class="appt-detail">${a.doctor} · ${a.type}</span>
                </div>
                <div class="appt-time">
                  <span>${new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  <span class="appt-clock">${a.time}</span>
                </div>
              </div>`).join('')}
            ${AppState.appointments.filter(a => a.status !== 'completed').length === 0 ? '<div class="empty-state-sm">No upcoming appointments</div>' : ''}
          </div>
        </div>
      </div>
    </div>`;
}

function statCard(label, value, color) {
  return `<div class="stat-card" style="--accent:${color}"><div class="stat-value">${value}</div><div class="stat-label">${label}</div></div>`;
}
