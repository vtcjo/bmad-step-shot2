import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { runId } = req.query;
  const format = (req.query.format ?? 'json') as string;

  if (!runId || typeof runId !== 'string') {
    res.status(400).json({ error: 'Missing runId' });
    return;
  }

  const reportsDir = path.resolve(process.cwd(), 'reports');
  const jsonPath = path.join(reportsDir, `${runId}.json`);
  const htmlPath = path.join(reportsDir, `${runId}.html`);

  try {
    if (format === 'json') {
      const data = await fs.readFile(jsonPath, 'utf8');
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${runId}.json"`);
      return res.send(data);
    } else if (format === 'html') {
      const data = await fs.readFile(htmlPath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `attachment; filename="${runId}.html"`);
      return res.send(data);
    } else {
      res.status(400).json({ error: 'Invalid format' });
    }
  } catch (e) {
    res.status(404).json({ error: 'Report not found' });
  }
}