This patch implements a minimal, incremental MVP for a Selenium-backed StepShot runner.
- Client: basic UI to input JSON script, trigger run, view per-step results and artifacts.
- Server: runs actual WebDriver when available, otherwise simulates steps with placeholder screenshots.
- Artifacts: per-step results, final JSON and HTML reports generated under /reports and downloadable via API.