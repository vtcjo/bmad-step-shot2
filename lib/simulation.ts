// Simple in-memory-like placeholder generator for simulation screenshots
export function generatePlaceholder(stepIndex: number, runName: string): string {
  const w = 800;
  const h = 480;
  const text = `Simulation - ${runName} - Step ${stepIndex + 1}`;
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="grad" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stop-color="#e2e8f0"/>
        <stop offset="100%" stop-color="#cbd5e1"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
      fill="#334155" font-family="Arial, Helvetica, sans-serif" font-size="28">
      ${text}
    </text>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}