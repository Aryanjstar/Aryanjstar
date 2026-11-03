import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Only aggregate calendar data is saved. No token, repository names or event payloads.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const query = `query { user(login: "Aryanjstar") { contributionsCollection {
  contributionCalendar { totalContributions weeks { contributionDays {
    date contributionCount contributionLevel weekday
  } } }
} } }`;
const fixture = process.argv.indexOf('--input');
let response;
if (fixture >= 0) {
  response = JSON.parse(readFileSync(process.argv[fixture + 1], 'utf8'));
} else {
  const result = spawnSync('gh', ['api', 'graphql', '-f', `query=${query}`], {
    encoding: 'utf8', timeout: 60_000,
  });
  if (result.status !== 0) throw new Error('GitHub calendar fetch failed; keeping the last good assets.');
  response = JSON.parse(result.stdout);
}
const calendar = response?.data?.user?.contributionsCollection?.contributionCalendar;
const levels = ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE'];
if (response.errors || !Number.isInteger(calendar?.totalContributions) || calendar.totalContributions < 0 ||
    !Array.isArray(calendar.weeks) || calendar.weeks.length < 50 || calendar.weeks.length > 54) {
  throw new Error('Invalid calendar response; keeping the last good assets.');
}
const days = calendar.weeks.flatMap(w => w.contributionDays);
if (days.length < 350 || days.length > 380 || days.some(d =>
    !/^\d{4}-\d{2}-\d{2}$/.test(d.date) || !Number.isInteger(d.contributionCount) ||
    d.contributionCount < 0 || !levels.includes(d.contributionLevel) ||
    !Number.isInteger(d.weekday) || d.weekday < 0 || d.weekday > 6) ||
    new Set(days.map(d => d.date)).size !== days.length ||
    days.some((d, i) => i && d.date <= days[i - 1].date)) {
  throw new Error('Invalid calendar days; keeping the last good assets.');
}
const dates = `${days[0].date} to ${days.at(-1).date}`;
const activeDays = days.filter(d => d.contributionCount > 0).length;
const palettes = {
  light: { bg: '#ffffff', border: '#d1d9e0', fg: '#1f2328', muted: '#59636e', colors: ['#eff2f5', '#aceebb', '#4ac26b', '#2da44e', '#116329'] },
  dark: { bg: '#0d1117', border: '#30363d', fg: '#f0f6fc', muted: '#9198a1', colors: ['#151b23', '#033a16', '#196c2e', '#2ea043', '#56d364'] },
};
function render(theme) {
  const p = palettes[theme];
  let previousMonth = '';
  const labels = calendar.weeks.map((week, i) => {
    const first = week.contributionDays[0];
    const month = first.date.slice(0, 7);
    if (month === previousMonth) return '';
    previousMonth = month;
    if (i > calendar.weeks.length - 3) return '';
    const label = new Date(`${first.date}T12:00:00Z`).toLocaleString('en', { month: 'short', timeZone: 'UTC' });
    return `<text x="${34 + i * 14}" y="91" class="small">${label}</text>`;
  }).join('');
  const cells = calendar.weeks.map((week, x) => week.contributionDays.map(d =>
    `<rect x="${34 + x * 14}" y="${104 + d.weekday * 14}" width="11" height="11" rx="2" fill="${p.colors[levels.indexOf(d.contributionLevel)]}"><title>${d.date}: ${d.contributionCount} contributions</title></rect>`
  ).join('')).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="244" viewBox="0 0 800 244" role="img" aria-labelledby="title desc">
<title id="title">Aryan Jaiswal — GitHub contribution calendar</title>
<desc id="desc">${calendar.totalContributions} GitHub-reported contributions. ${activeDays} active days in the displayed calendar, ${dates}. Contribution counts are activity, not a measure of code quality.</desc>
<style>text{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;fill:${p.fg}}.small{font-size:11px;fill:${p.muted}}.caption{font-size:12px;fill:${p.muted}}</style>
<rect x="0.5" y="0.5" width="799" height="243" rx="12" fill="${p.bg}" stroke="${p.border}"/>
<text x="28" y="34" font-size="13" font-weight="600">A YEAR OF BUILDING</text>
<text x="28" y="62" font-size="22" font-weight="650">${calendar.totalContributions.toLocaleString('en-US')} contributions</text>
<text x="772" y="33" text-anchor="end" class="caption">${dates}</text>
<text x="772" y="58" text-anchor="end" class="caption">${activeDays} active days</text>
${labels}${cells}
<text x="28" y="223" class="small">Source: GitHub contribution calendar · refreshed daily</text>
<text x="644" y="223" class="small">Less</text>
${p.colors.map((c, i) => `<rect x="${674 + i * 14}" y="213" width="11" height="11" rx="2" fill="${c}"/>`).join('')}
<text x="750" y="223" class="small">More</text>
</svg>\n`;
}
const outputs = Object.fromEntries(Object.keys(palettes).map(theme => [theme, render(theme)]));
mkdirSync(path.join(root, 'assets'), { recursive: true });
for (const [theme, svg] of Object.entries(outputs)) writeFileSync(path.join(root, 'assets', `contributions-${theme}.svg`), svg);
writeFileSync(path.join(root, 'assets', 'contributions.json'), JSON.stringify({ source: 'GitHub GraphQL contributionCalendar', ...calendar }, null, 2) + '\n');
console.log(`Rendered ${days.length} calendar days; ${calendar.totalContributions} GitHub-reported contributions; ${activeDays} active days.`);
