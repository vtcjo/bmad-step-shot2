import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { promises as fs } from 'fs';
import { ScriptSpec, StepResult } from '../../types';
import { executeScript } from '../../lib/runner';
import { generateHtmlReport } from '../../lib/report';

type ApiRunPayload = {
  script: ScriptSpec;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  let payload: ApiRunPayload;
  try {
    payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (e) {
    res.status(400).json({ error: 'Invalid JSON payload' });
    return;
  }

  const script: ScriptSpec = payload.script;
  if (!script || !Array.isArray(script.steps) || script.steps.length === 0) {
    return res.status(400).json({ error: 'Script must include at least one step' });
  }

  // Run the script using server-side runner (driver or simulation)
  const runId = `run_${Date.now()}`;
  let results: StepResult[] = [];

  try {
    results = await executeScript(script);
  } catch (e: any) {
    // Ensure we return something meaningful
    results = [
      {
        index: 0,
        action: script.steps?.[0]?.action ?? 'unknown',
        status: 'failed',
        duration: 0,
        error: e?.message ?? 'Runner error'
      }
    ];
  }

  // Persist a simple JSON report and an HTML report for download
  const reportsDir = path.resolve(process.cwd(), 'reports');
  await fs.mkdir(reportsDir, { recursive: true });
  const jsonPath = path.join(reportsDir, `${runId}.json`);
  const htmlPath = path.join(reportsDir, `${runId}.html`);

  const reportObj = {
    id: runId,
    name: script.name ?? 'Run',
    steps: results
  };

  await fs.writeFile(jsonPath, JSON.stringify(reportObj, null, 2), 'utf8');
  // HTML report generation for quick human-readable artifact
  const htmlContent = generateHtmlReport(reportObj);
  await fs.writeFile(htmlPath, htmlContent, 'utf8');

  res.status(200).json({
    runId,
    name: script.name ?? 'Run',
    steps: results,
    jsonUrl: `/api/reports/${runId}?format=json`,
    htmlUrl: `/api/reports/${runId}?format=html`
  });
}