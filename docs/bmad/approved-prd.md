# Approved PRD

- Cycle ID: 9ff7f117-2565-406f-a54f-52393e37f719
- Published at: 2026-02-20T08:21:36.986Z
- BMAD cycle version: 0.3.0
- Goal: Approved: Maintain Dual-Path MVP; enable real WebDriver integration with Chrome/Firefox
- Project: Step-shot
- Product: Step-shot
- PRD title: convert the MVP runner to an actual Selenium WebDriver integration (Chrome/Firefox) and wire real browser drivers, I can add a follow-up patch to replace the simulateRun logic with a real WebDriver-based runner, including handling for capabilities, headless mode, and local app readiness.
- PRD version: 0.1.0

## BMADC Agent Prompt Versions

| Agent | Prompt version |
| --- | --- |
| B | 0.2.10 |
| M | 0.2.0 |
| A | 0.2.0 |
| D | 0.2.0 |
| C | 0.2.0 |

## Peter Prompt Version

- P: Unversioned

## PRD Content

## 1. Understanding
- Restate the product idea or request

  Build a Next.js (TypeScript + Tailwind) StepShot testing app that loads JSON-formatted Selenium command scripts, executes them against a target web app via Selenium WebDriver, and for each step captures a screenshot, logs status/duration/errors, and generates per-step + final HTML/JSON reports. Provide a clean UI to create/edit/run scripts, view live progress, and download artifacts. Enforce safeguards to avoid known issues (server/client boundaries, development persistence, reliable WebDriver init, auto ChromeDriver config with fallbacks, stable Chrome launch args, simulation fallback if selenium-webdriver is unavailable, and comprehensive logging).

- Identify what problem we are solving

  - Make automated UI testing with visual evidence approachable in a modern Next.js app.
  - Provide traceable, per-step artifacts (screenshots, logs) and ready-to-share HTML/JSON reports.
  - Enable a smooth developer/QA workflow for authoring, executing, monitoring, and exporting test runs.
  - Mitigate common pitfalls that derail client/server bundling, development refreshes, and driver initialization.

- Identify who we are solving it for

  - QA engineers and test automation specialists who author and run UI test scripts.
  - Frontend developers and DevOps engineers who want an integrated, visually reportable testing workflow.
  - Test architects seeking an auditable, artifact-rich testing process for web apps.

---

## 2. Clarifying Questions
None.

(If future requirements arise, we can convert them into explicit PRD updates.)


---

## 3. PRD Draft

### 1. Product Overview
- **Vision:** Create an integrated, user-friendly StepShot testing workstation within a Next.js app that loads JSON-formatted Selenium scripts, runs them against a target web app using Selenium WebDriver, and produces per-step and final HTML/JSON reports with screenshots and logs. The UI enables script authoring/editing, execution, live progress, and artifact download, while ensuring safe client/server boundaries, reliable driver initialization, and robust development ergonomics.
- **Objective:** Deliver a secure, reliable, and observable testing experience that lowers the barrier to automation, improves test traceability, and enables quick iteration from script authoring to artifact retrieval.

### 2. Problem Statement
- **User Pain Points:**
  - Difficulty authoring, executing, and debugging Selenium-based scripts within modern front-end stacks.
  - Lack of per-step visual evidence and clear progress during test runs.
  - Fragile client/server builds due to server-side Node modules being imported on the client, causing bundling errors.
  - Inconsistent driver initialization, flaky local ChromeDriver configuration, and missing actionable logs.
  - No straightforward, shareable per-run HTML/JSON reports with artifacts.

- **Business Motivation:** Accelerate automation adoption, improve test reliability and traceability, reduce debugging time, and provide a shareable artifact suite for audits and collaboration.

### 3. Target Users & Personas

- **Name:** QA Engineer
  - **Description:** Primary author of test scripts; runs automated checks against web apps; values clear artifacts and reliable runs.
  - **Characteristics:** Comfortable with JSON scripts; desires UI for editing scripts; interested in per-step screenshots and status logs.
  - **Goals:** Create/edit/run scripts quickly; view live progress; download HTML/JSON reports and artifacts.
  - **Pain Points:** Friction in running Selenium-based tests from a front-end stack; unclear per-step status; missing robust failure diagnostics.

- **Name:** Frontend Automation Dev / DevOps
  - **Description:** Integrates test results into pipelines; ensures reliable driver setup; prefers predictable environment behavior.
  - **Characteristics:** Focus on stability, security of server boundaries, and maintainability.
  - **Goals:** Trigger runs from a UI or API, rely on server-side execution, obtain structured artifacts for pipelines.
  **Pain Points:** Client-side code importing server-only modules; inconsistent driver initialization; lack of safe development flow.

- Optional: **Name:** Test Architect
  - **Description:** Designs testing strategy and standards; wants reusable, exportable reports and scripts.
  - **Goals:** Enforce schema, provide validation, and maintain a library of scripts with clear provenance.

### 4. Goals & Success Metrics

- **Business Goals:**
  - Reduce time to author and execute end-to-end UI tests.
  - Improve test traceability with per-step artifacts and shareable reports.
  - Lower maintenance friction by enforcing clear boundaries between client and server responsibilities.

- **User Outcomes:**
  - Users can author, edit, and run JSON-form Selenium scripts from a clean UI.
  - Users receive real-time run progress, per-step screenshots, status, duration, and errors.
  - Users can export/download per-step HTML/JSON reports and artifacts.

- **KPIs:**
  - Run success rate (all steps completed) Target: 98%+
  - Average per-step screenshot capture/processing time Target: ≤ 3 seconds
  - Availability of generated reports/artifacts Target: 100% of completed runs
  - API response validation errors per run Target: ≤ 1%
  - Developer/runtime experience: perceived reliability during local dev (survey/feedback target)

### 5. Features & Requirements

For each feature, the table includes Priority, User Story, Acceptance Criteria, and Dependencies.

| Priority | User Story | Acceptance Criteria | Dependencies |
|----------|-----------|---------------------|--------------|
| MUST | As a [user], I want to author/edit a JSON-form Selenium script in the UI so that I can define steps clearly and validate structure before execution. | - UI provides a JSON script editor with syntax validation and schema checks for required fields (e.g., steps array). <br>- User can save, load, import, and export scripts. <br>- Clicking Run validates script and displays immediate validation errors. | API endpoints for script CRUD; client-side validation |
| MUST | As a [user], I want to run a script against a target web app so that each step is executed with a screenshot, status, duration, and any errors captured. | - Run initiates server-side execution via a dedicated runner. <br>- Each step captures a screenshot, logs duration, and status (success/failed). <br>- Errors are surfaced in the UI with per-step details. | Server-side runner module; Selenium/WebDriver environment |
| MUST | As a [user], I want real-time progress during a run so that I can monitor steps as they execute. | - Live progress updates are visible in the UI (step index, status, duration). <br>- UI handles step sequencing and client-side validation for step presence before rendering progress. | Real-time communication channel (e.g., API streaming, WebSocket/SSE) |
| MUST | As a [user], I want per-step and final HTML/JSON reports with artifacts (screenshots, logs) that I can download. | - After completion, per-step and final reports are generated in HTML and JSON formats. <br>- All artifacts (screenshots, logs) are downloadable. | Report generator, artifact store |
| MUST | As a [user], I want automated artifact generation and a stable driver initialization process that is robust to common failures. | - Driver initialization runs in a server-side context with try/catch, using new Builder() and async/await patterns. <br>- ChromeDriver auto-configured from npm package with fallback to system PATH. <br>- Chrome launch arguments include --no-sandbox, --disable-dev-shm-usage, --disable-gpu. | Server environment; proper npm packages installed |
| MUST | As a [user], I want a safe development experience with persistent in-memory stores to prevent Hot Module Reload data loss. | - In-memory stores are attached to Node.js global object for dev sessions to survive refreshes. <br>- Mechanism is clearly flagged as development-only and non-production. | Development mode only; global store management |
| MUST | As a [user], I want an immediate simulation fallback if selenium-webdriver is unavailable, producing visible placeholder screenshots instead of blanks. | - If the driver package is unavailable, a simulation mode generates placeholder images and logs indicating simulation. <br>- Runs do not crash; UI shows simulation status. | Optional simulation module; feature flag for dev/prod |
| MUST | As a [user], I want API responses to be validated and step existence guaranteed before rendering run details to prevent 404s and undefined data. | - API endpoints validate responses and schema shapes. <br>- Client rendering checks for steps existence before attempting to render progress or details. | API schema validation; defensive UI rendering |
| SHOULD | As a [user], I want the app to auto-configure ChromeDriver from the installed npm package, with a fallback to PATH, and consistent Chrome launch defaults. | - ChromeDriver auto-discovery uses the installed package; fallback path is checked. <br>- Launch args applied consistently across runs. | ChromeDriver package presence; environment PATH |

### 6. Constraints & Assumptions

| Type | Category | Description | Risk |
|------|----------|-------------|------|
| Constraint | Technical | Keep all Selenium WebDriver and Node.js-only imports strictly in server-side modules (e.g., API routes or a dedicated runner file) and never import them into client components to avoid Next.js client bundling errors. | High: Misplacing imports could reintroduce client bundling issues. |
| Constraint | Technical | Attach in-memory stores to the Node.js global object for dev persistence across refreshes; clearly domain-scoped (development-only). | Risk of memory leaks or conflicts in long-running dev sessions; ensure cleanup in dev tools. |
| Constraint | Technical | Initialize WebDriver with new Builder(), wrap in async/await with try/catch to avoid silent hangs. | Flaky runs if initialization fails silently; needs robust error handling. |
| Constraint | Technical | Auto-configure ChromeDriver from npm package with fallback to system PATH; use stable launch args: --no-sandbox, --disable-dev-shm-usage, --disable-gpu. | Dependency on package presence; environment variability. |
| Constraint | Technical | If selenium-webdriver is unavailable, provide immediate simulation fallback with visible placeholder screenshots. | User experience impacted if simulation mode is not clearly indicated; ensure fallback is discoverable. |
| Constraint | Operational | All API responses must be validated; steps must exist before rendering run details to prevent 404/undefined data. | Poor UX if not strict; must be resilient on edge cases. |
| Constraint | Security & Boundaries | Client code must not import server-only modules; separation of concerns between UI and runner. | Security risk if violated; must enforce at design level. |
| Constraint | UX & Performance | Live progress streaming should be low-latency; avoid excessive polling; prefer push-based updates. | Complexity in real-time channel; ensure scalability for dev/local usage. |
| Assumption | Development & Tools | ChromeDriver and selenium-webdriver packages are installed as part of dev/deploy environment. | If missing, fallback behaviors apply but may affect performance. |
| Assumption | Data Model | Script JSON follows a defined schema with at least a steps array; steps contain command definitions and targets. | Need to validate schema; future schema evolution should be versioned. |

### 7. Out of Scope
- Multi-browser or remote/browser-grid execution (Selenium Grid) beyond local Chrome/Chromium.
- Full-fledged CI/CD integration and pipelines tooling.
- Real-time collaboration or multi-user editing of scripts.
- Video capture of runs; only screenshots and logs.
- Complex data-driven testing (external data sources) beyond the defined JSON script format.
- Long-term storage strategies beyond per-run artifact download (e.g., archival services, databases) without explicit MVP scope.

### 8. Open Questions
- [HIGH] Do we require user authentication and multi-user access, or is this MVP a single-user tool for dev/testing?
- [MEDIUM] How should scripts and runs be stored long-term (local file storage, persistent database, or a hybrid)? Any preferred data retention policy?
- [MEDIUM] Should runs be strictly sequential to conserve resources, or do we want configurable concurrency limits for multiple simultaneous runs?
- [LOW] Which browsers/driver configurations should be supported beyond Chrome/Chromium (e.g., Firefox, Edge) in MVP?
- [MEDIUM] How should API endpoints be exposed for triggering runs (GraphQL vs REST, WebSocket/SSE for progress)? Is there an existing UI pattern we must align with?
- [LOW] Are there existing reporting formats or schemas we must align with (e.g., accessibility checks, additional per-step metadata)?

### 9. Version & Approval History
The table is system-managed from authoritative `prd_versions` records.
Do not manually write or append table rows in PRD content.

### 10. Version Impact
- Recommended bump: minor
- Rationale: This revision introduces a new, broader set of requirements and constraints (server-side execution boundaries, in-development persistence, safer driver initialization, simulation fallback, enhanced logging, and reporting capabilities) that expand the product’s scope beyond the previous draft without breaking existing product intents. A minor version bump communicates an extended capability surface and policy changes without a breaking UI/UX overhaul.

---

## 4. Next Steps
- [ ] Review PRD with stakeholders
- [ ] Resolve open questions
- [ ] Obtain approval
- [ ] Hand off to Builder Ben for BMAD cycle