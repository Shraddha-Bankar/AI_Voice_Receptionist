// ─── Charts ──────────────────────────────────────────────────────────────────

export function renderBarChart(data, options = {}) {
  const { width = 500, height = 160, color = '#818CF8' } = options;
  const max  = Math.max(...data.map(d => d.value), 1);
  const barW = Math.floor((width - 40) / data.length) - 4;

  const bars = data.map((d, i) => {
    const h = Math.max(4, ((d.value / max) * (height - 40)));
    const x = 20 + i * (barW + 4);
    const y = height - 24 - h;
    return `
      <g class="bar-group">
        <rect x="${x}" y="${y}" width="${barW}" height="${h}" rx="3" fill="${color}" opacity="0.85" class="bar-rect"/>
        <text x="${x + barW / 2}" y="${height - 6}" text-anchor="middle" class="bar-label">${d.label}</text>
        <title>${d.label}: ${d.value}</title>
      </g>`;
  }).join('');

  return `
    <svg viewBox="0 0 ${width} ${height}" class="bar-chart" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="10" x2="20" y2="${height - 24}" stroke="var(--border)" stroke-width="1"/>
      <line x1="20" y1="${height - 24}" x2="${width - 10}" y2="${height - 24}" stroke="var(--border)" stroke-width="1"/>
      ${bars}
    </svg>`;
}

export function renderDonutChart(segments, options = {}) {
  const { size = 120, strokeWidth = 18 } = options;
  const r = (size - strokeWidth) / 2;
  const cx = size / 2, cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const total = segments.reduce((s, d) => s + d.value, 0) || 1;

  let offset = 0;
  const arcs = segments.map(seg => {
    const pct     = seg.value / total;
    const dashLen = pct * circumference;
    const arc = `
      <circle cx="${cx}" cy="${cy}" r="${r}"
        fill="none" stroke="${seg.color}" stroke-width="${strokeWidth}"
        stroke-dasharray="${dashLen} ${circumference - dashLen}"
        stroke-dashoffset="${-offset * circumference / total}"
        transform="rotate(-90 ${cx} ${cy})" class="donut-arc">
        <title>${seg.label}: ${seg.value}</title>
      </circle>`;
    offset += seg.value;
    return arc;
  });

  return `
    <svg viewBox="0 0 ${size} ${size}" class="donut-chart" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--border)" stroke-width="${strokeWidth}"/>
      ${arcs.join('')}
      <text x="${cx}" y="${cy + 5}" text-anchor="middle" class="donut-center">${total}</text>
    </svg>`;
}

export function renderSentimentBar(positive, neutral, negative) {
  const total = positive + neutral + negative || 1;
  const posW = (positive / total * 100).toFixed(1);
  const neuW = (neutral  / total * 100).toFixed(1);
  const negW = (negative / total * 100).toFixed(1);
  return `
    <div class="sentiment-bar-wrap">
      <div class="sentiment-bar">
        <div class="seg positive" style="width:${posW}%" title="Positive: ${positive}"></div>
        <div class="seg neutral"  style="width:${neuW}%" title="Neutral: ${neutral}"></div>
        <div class="seg negative" style="width:${negW}%" title="Negative: ${negative}"></div>
      </div>
      <div class="sentiment-legend">
        <span class="leg positive">● Positive ${posW}%</span>
        <span class="leg neutral">● Neutral ${neuW}%</span>
        <span class="leg negative">● Negative ${negW}%</span>
      </div>
    </div>`;
}

export function renderSparkline(values, color = '#818CF8') {
  if (!values.length) return '';
  const w = 100, h = 30;
  const max = Math.max(...values, 1);
  const min = Math.min(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  return `<svg viewBox="0 0 ${w} ${h}" class="sparkline"><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
}

export function renderLineChart(series, options = {}) {
  const { width = 500, height = 180 } = options;
  const labels   = series[0]?.data.map(d => d.label) || [];
  const allValues = series.flatMap(s => s.data.map(d => d.value));
  const max = Math.max(...allValues, 1);
  const padLeft = 30, padBottom = 24, padTop = 10, padRight = 10;
  const chartW = width - padLeft - padRight;
  const chartH = height - padBottom - padTop;

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(pct => {
    const y   = padTop + chartH - pct * chartH;
    const val = Math.round(pct * max);
    return `<line x1="${padLeft}" y1="${y}" x2="${width - padRight}" y2="${y}" stroke="var(--border)" stroke-width="1" stroke-dasharray="4,4"/>
             <text x="${padLeft - 4}" y="${y + 4}" text-anchor="end" class="axis-label">${val}</text>`;
  }).join('');

  const xLabels = labels.map((l, i) => {
    const x = padLeft + (i / (labels.length - 1)) * chartW;
    return `<text x="${x}" y="${height - 4}" text-anchor="middle" class="axis-label">${l}</text>`;
  }).join('');

  const lines = series.map(s => {
    const pts = s.data.map((d, i) => {
      const x = padLeft + (i / (s.data.length - 1)) * chartW;
      const y = padTop + chartH - (d.value / max) * chartH;
      return `${x},${y}`;
    }).join(' ');
    return `<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
  }).join('');

  return `
    <svg viewBox="0 0 ${width} ${height}" class="line-chart" xmlns="http://www.w3.org/2000/svg">
      ${gridLines}${lines}${xLabels}
    </svg>`;
}
