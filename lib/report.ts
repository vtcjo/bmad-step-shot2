// Simple HTML report generator for a given run
import type { RunReport } from '../types';

export function generateHtmlReport(report: RunReport): string {
  const { id, name, steps } = report;
  const rows = steps
    .map((s) => {
      const img = s.screenshot
        ? `<td><img src="${s.screenshot}" style="max-width:320px; width:320px; height:auto;" /></td>`
        : `<td>No screenshot</td>`;
      return `<tr>
        <td>${s.index + 1}</td>
        <td>${s.action}</td>
        <td>${s.status}</td>
        <td>${s.duration.toFixed(0)} ms</td>
        <td>${s.error ?? ''}</td>
        ${img}
      </tr>`;
    })
    .join('\n');

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>StepShot Report - ${name} (${id})</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: top; }
    th { background: #f3f4f6; }
  </style>
</head>
<body>
  <h1>StepShot Report</h1>
  <p><strong>Run:</strong> ${name} (${id})</p>
  <table>
    <thead>
      <tr>
        <th>Step</th>
        <th>Action</th>
        <th>Status</th>
        <th>Duration</th>
        <th>Error</th>
        <th>Screenshot</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
</body>
</html>`;
  return html;
}