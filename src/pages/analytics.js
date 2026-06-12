// ─── Analytics Page ──────────────────────────────────────────────────────────
import { AppState } from '../store/appState.js';
import { renderBarChart, renderLineChart, renderDonutChart, renderSentimentBar } from '../components/charts.js';
import { formatDuration } from '../utils/formatters.js';
import { getIntentLabel, getIntentColor } from '../services/intentDetector.js';
import { INTENTS } from '../utils/constants.js';

export function renderAnalytics() {
  const calls = AppState.calls;
  const now = new Date();
  const total = calls.length;
  const completed = calls.filter(c => c.status === 'completed').length;
  const missed = calls.filter(c => c.status === 'missed').length;
  const escalated = calls.filter(c => c.status === 'escalated').length;
  const resolution = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;
  const avgDur = completed > 0 ? Math.round(calls.filter(c => c.duration > 0).reduce((s, c) => s + c.duration, 0) / completed) : 0;

  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now); d.setDate(d.getDate() - (13 - i));
    return { label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), value: calls.filter(c => new Date(c.time).toDateString() === d.toDateString()).length };
  });

  const hourly = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 8;
    const label = hour > 12 ? `${hour - 12}PM` : hour === 12 ? '12PM' : `${hour}AM`;
    return { label, value: calls.filter(c => new Date(c.time).getHours() === hour).length };
  });

  const intentCounts = Object.values(INTENTS).reduce((acc, k) => { acc[k] = calls.filter(c => c.intent === k).length; return acc; }, {});
  const intentSegments = Object.entries(intentCounts).filter(([, v]) => v > 0).map(([k, v]) => ({ label: getIntentLabel(k), value: v, color: getIntentColor(k) }));

  const pos = calls.filter(c => c.sentiment === 'positive').length;
  const neu = calls.filter(c => c.sentiment === 'neutral').length;
  const neg = calls.filter(c => c.sentiment === 'negative').length;

  const weeks = Array.from({ length: 6 }, (_, i) => {
    const ws = new Date(now); ws.setDate(ws.getDate() - (5 - i) * 7);
    const we = new Date(ws); we.setDate(we.getDate() + 6);
    return { label: `W${i + 1}`, value: calls.filter(c => { const d = new Date(c.time); return d >= ws && d <= we; }).length };
  });

  return `
    <div class="page-content analytics-page">
      <div class="stats-row">
        ${kpi('Total Calls', total, '#818CF8')}
        ${kpi('Resolution Rate', resolution + '%', '#6EE7B7')}
        ${kpi('Avg Handle Time', formatDuration(avgDur), '#FCD34D')}
        ${kpi('Escalations', escalated, '#F87171')}
        ${kpi('Missed', missed, '#FB923C')}
      </div>
      <div class="analytics-grid">
        <div class="card chart-card wide">
          <div class="card-header"><span class="card-title">Call Volume — Last 14 Days</span></div>
          <div class="chart-wrap">${renderBarChart(last14, { width: 700, height: 160, color: '#818CF8' })}</div>
        </div>
        <div class="card chart-card">
          <div class="card-header"><span class="card-title">Weekly Trend</span></div>
          <div class="chart-wrap">${renderLineChart([{ color: '#818CF8', data: weeks }], { width: 340, height: 160 })}</div>
        </div>
        <div class="card chart-card">
          <div class="card-header"><span class="card-title">Hourly Distribution</span><span class="card-badge badge-gray">8AM – 7PM</span></div>
          <div class="chart-wrap">${renderBarChart(hourly, { width: 340, height: 160, color: '#6EE7B7' })}</div>
        </div>
        <div class="card chart-card">
          <div class="card-header"><span class="card-title">Intent Breakdown</span></div>
          <div class="donut-wrap">
            ${intentSegments.length > 0 ? renderDonutChart(intentSegments, { size: 120, strokeWidth: 18 }) : '<div class="empty-state-sm">No data yet</div>'}
            <div class="intent-legend">${intentSegments.map(s => `<div class="legend-row"><span class="legend-dot" style="background:${s.color}"></span><span class="legend-label">${s.label}</span><span class="legend-val">${s.value}</span></div>`).join('')}</div>
          </div>
        </div>
        <div class="card chart-card">
          <div class="card-header"><span class="card-title">Sentiment Distribution</span></div>
          <div class="sentiment-wrap" style="padding:1rem 0">
            ${renderSentimentBar(pos, neu, neg)}
            <div class="sentiment-stats" style="margin-top:1rem">
              <div class="sent-stat pos"><span class="sent-num">${pos}</span><span class="sent-lbl">Positive</span></div>
              <div class="sent-stat neu"><span class="sent-num">${neu}</span><span class="sent-lbl">Neutral</span></div>
              <div class="sent-stat neg"><span class="sent-num">${neg}</span><span class="sent-lbl">Negative</span></div>
            </div>
          </div>
        </div>
        <div class="card chart-card">
          <div class="card-header"><span class="card-title">Call Outcome Split</span></div>
          <div class="donut-wrap">
            ${renderDonutChart([{label:'Completed',value:completed,color:'#6EE7B7'},{label:'Missed',value:missed,color:'#F87171'},{label:'Escalated',value:escalated,color:'#FB923C'}].filter(s=>s.value>0),{size:120,strokeWidth:18})}
            <div class="intent-legend">
              <div class="legend-row"><span class="legend-dot" style="background:#6EE7B7"></span><span class="legend-label">Completed</span><span class="legend-val">${completed}</span></div>
              <div class="legend-row"><span class="legend-dot" style="background:#F87171"></span><span class="legend-label">Missed</span><span class="legend-val">${missed}</span></div>
              <div class="legend-row"><span class="legend-dot" style="background:#FB923C"></span><span class="legend-label">Escalated</span><span class="legend-val">${escalated}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

function kpi(label, value, color) {
  return `<div class="stat-card" style="--accent:${color}"><div class="stat-value">${value}</div><div class="stat-label">${label}</div></div>`;
}
