// Native SVG assets: motion stays inside the image so GitHub can display it.
export function hero(theme) {
  const dark = theme === 'dark';
  const fg = dark ? '#f0f6fc' : '#102544';
  const muted = dark ? '#a7bad6' : '#425b7b';
  const bars = Array.from({length: 32}, (_, i) => {
    const h = 12 + Math.pow(Math.sin(i * 1.7), 2) * 58 + Math.sin(i / 5) * 15;
    return `<rect class="voice" x="${590 + i * 7}" y="${103-h/2}" width="3.5" height="${h}" rx="2" fill="url(#wave)" style="transform-origin:${592+i*7}px 103px;animation-delay:-${(i*0.11).toFixed(2)}s"/>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="220" viewBox="0 0 900 220" role="img" aria-labelledby="title desc">
<title id="title">Aryan Jaiswal — Forward Deployed Engineer at Exotel</title>
<desc id="desc">Voice AI. Agentic systems. Backend engineering. Bangalore, India.</desc>
<defs><linearGradient id="bg" x2="1" y2="0.5"><stop stop-color="${dark?'#101c36':'#edf4ff'}"/><stop offset="1" stop-color="${dark?'#0a242a':'#e7faf2'}"/></linearGradient><linearGradient id="wave"><stop stop-color="#678cff"/><stop offset="1" stop-color="#2dd4a0"/></linearGradient></defs>
<style>text{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;fill:${fg}}.voice{animation:speak 2.8s ease-in-out infinite alternate}@keyframes speak{0%,100%{transform:scaleY(.45)}50%{transform:scaleY(1)}}@media(prefers-reduced-motion:reduce){.voice{animation:none}}</style>
<rect x="1" y="1" width="898" height="218" rx="20" fill="url(#bg)" stroke="${dark?'#29405e':'#cfdfed'}"/>
<path d="M530 25V195" stroke="${dark?'#29405e':'#cfdfed'}"/>
<text x="38" y="42" font-size="12" letter-spacing="2.4" font-weight="650" style="fill:${muted}">BUILD · EVALUATE · SHIP</text>
<text x="36" y="101" font-size="46" font-weight="750">Aryan Jaiswal</text>
<text x="38" y="138" font-size="19" font-weight="550">Forward Deployed Engineer @ Exotel</text>
<text x="38" y="176" font-size="14" style="fill:${muted}">Voice AI · Agentic systems · Backend engineering</text>
${bars}
<text x="700" y="176" text-anchor="middle" font-size="13" letter-spacing="1.5" style="fill:${muted}">IDEA → SIMULATION → PRODUCTION</text>
</svg>\n`;
}

export function skyline(calendar, theme, palette) {
  const p = palette;
  const days = calendar.weeks.flatMap((week, w) => week.contributionDays.map(d => ({...d,week:w})));
  const peak = days.reduce((a,b) => b.contributionCount>a.contributionCount?b:a);
  const max = Math.max(1, peak.contributionCount);
  const levels = ['NONE','FIRST_QUARTILE','SECOND_QUARTILE','THIRD_QUARTILE','FOURTH_QUARTILE'];
  const geometry = days.map(d => {
    const x = 34 + d.week * 13.2 + d.weekday * 5.1;
    const y = 191 + d.weekday * 10 - d.week * .65;
    const h = d.contributionCount ? 5 + 79*Math.sqrt(d.contributionCount/max) : 0;
    return {...d,x,y,h};
  }).sort((a,b)=>a.y-b.y || a.x-b.x);
  const buildings = geometry.map(d => {
    const {x,y,h} = d; const top = y-h;
    const fill = p.colors[levels.indexOf(d.contributionLevel)];
    const delay = (d.week*.023+d.weekday*.045).toFixed(3);
    return `<g class="building" style="transform-origin:${x}px ${y}px;animation-delay:${delay}s"><title>${d.date}: ${d.contributionCount} contributions</title>
<path d="M${x},${top}l10,-4 5,5 -10,4z" fill="${fill}" stroke="${p.border}" stroke-width=".35"/>
${h?`<path d="M${x},${top}l5,5v${h}l-5,-5z" fill="${fill}"/><path d="M${x+5},${top+5}l10,-4v${h}l-10,4z" fill="${fill}"/><path d="M${x+5},${top+5}l10,-4v${h}l-10,4z" fill="#000" opacity=".20"/>`:''}</g>`;
  }).join('');
  const mark = geometry.find(d=>d.date===peak.date);
  // Leader labels stay below the skyline so the calendar never collides with text.
  const peakLabel = peak.contributionCount ? `<path d="M${mark.x+5},${mark.y+8}V275H${mark.x>400?650:150}" fill="none" stroke="${p.muted}" stroke-width=".7" stroke-dasharray="3 4"/>
<text x="${mark.x>400?650:150}" y="293" text-anchor="middle" class="caption">Peak: ${peak.contributionCount} · ${peak.date}</text>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="336" viewBox="0 0 800 336" role="img" aria-labelledby="title desc">
<title id="title">Aryan's contribution skyline</title><desc id="desc">One building per calendar day. Height uses the square root of that day's contributions. ${calendar.totalContributions} GitHub-reported contributions; peak ${peak.contributionCount} on ${peak.date}.</desc>
<style>text{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;fill:${p.fg}}.caption{font-size:11px;fill:${p.muted}}.building{animation:rise .85s cubic-bezier(.2,.7,.3,1) both}@keyframes rise{from{transform:scaleY(.03);opacity:.25}to{transform:scaleY(1);opacity:1}}@media(prefers-reduced-motion:reduce){.building{animation:none}}</style>
<rect x=".5" y=".5" width="799" height="335" rx="14" fill="${p.bg}" stroke="${p.border}"/>
<text x="28" y="32" font-size="12" font-weight="650" letter-spacing="2">MY YEAR, BUILT IN CODE</text>
<text x="28" y="62" font-size="23" font-weight="700">${calendar.totalContributions.toLocaleString('en-US')} contributions</text>
<text x="772" y="32" text-anchor="end" class="caption">${days[0].date} → ${days.at(-1).date}</text>
<text x="772" y="58" text-anchor="end" class="caption">One building for each day</text>
${buildings}${peakLabel}
<text x="28" y="319" class="caption">Real GitHub activity · square-root height scale · refreshed daily</text>
</svg>\n`;
}
