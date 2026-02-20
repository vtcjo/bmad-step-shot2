// Minimal server-side runner: executes JSON-formatted Selenium steps or falls back to simulation.
// This module intentionally imports server-side only dependencies.

import type { ScriptSpec, StepResult, StepDef } from '../types';
import 'chromedriver'; // ensure chromedriver binary is registered for selenium
import { By, Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import { generatePlaceholder } from './simulation';

type Step = StepDef;

export async function executeScript(script: ScriptSpec): Promise<{ results: StepResult[]; mode: 'driver'|'simulation' }> {
  const results: StepResult[] = [];
  let driver: any = null;
  let usingSim = false;
  let seleniumMod: any = null;

  // Attempt to initialize real WebDriver (Chrome)
  try {
    const selenium = await import('selenium-webdriver');
    seleniumMod = selenium;
    const chromeModule = await import('selenium-webdriver/chrome');
    const options = new chromeModule.Options();
    options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu');
    driver = new Builder().forBrowser('chrome').setChromeOptions(options).build();
  } catch (e) {
    // Fallback to simulation if WebDriver is not available
    usingSim = true;
  }

  const steps: Step[] = script.steps ?? [];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const start = Date.now();
    const result: StepResult = {
      index: i,
      action: step.action,
      status: 'pending',
      duration: 0
    };

    try {
      if (!usingSim) {
        const ByLocal = seleniumMod?.By ?? By;
        switch (step.action) {
          case 'navigate':
            if (step.target) {
              await (driver as any).get(step.target);
            }
            break;
          case 'click':
            if (step.selector?.value) {
              const value = step.selector.value;
              const type = (step.selector.type ?? 'css') as 'css'|'xpath';
              const by = type === 'css' ? ByLocal.css(value) : ByLocal.xpath(value);
              const el = await (driver as any).findElement(by);
              await el.click();
            }
            break;
          case 'type':
            if (step.selector?.value && typeof (step as any).value === 'string') {
              const value = (step as any).value;
              const type = (step.selector.type ?? 'css') as 'css'|'xpath';
              const by = type === 'css' ? ByLocal.css(step.selector.value) : ByLocal.xpath(step.selector.value);
              const el = await (driver as any).findElement(by);
              await el.clear();
              await el.sendKeys(value);
            }
            break;
          case 'select':
            if (step.selector?.value && typeof (step.value) === 'string') {
              const by = (step.selector.type ?? 'css') === 'css'
                ? ByLocal.css(step.selector.value)
                : ByLocal.xpath(step.selector.value);
              const selectEl = await (driver as any).findElement(by);
              // Try to select option by value attribute
              const option = await selectEl.findElement(ByLocal.xpath(`.//option[@value='${step.value}']`));
              await option.click();
            }
            break;
          default:
            // Unknown action: ignore for MVP
            break;
        }

        result.status = 'passed';
      } else {
        // Simulation path
        await new Promise((resolve) =>
          setTimeout(resolve, Math.random() * 120 + 60)
        );
        result.status = 'passed';
      }

      // Capture screenshot on success (or attempt)
      if (!usingSim) {
        try {
          const base64 = await (driver as any).takeScreenshot();
          result.screenshot = base64;
        } catch {
          // ignore
        }
      } else {
        // Generate placeholder for simulation
        result.screenshot = generatePlaceholder(i, script.name ?? 'StepShot');
      }
    } catch (err: any) {
      result.status = 'failed';
      result.error = err?.message ?? String(err);
      // Try to capture a final screenshot if possible
      if (!usingSim) {
        try {
          const base64 = await (driver as any).takeScreenshot();
          result.screenshot = base64;
        } catch {
          // ignore
        }
      } else {
        result.screenshot = generatePlaceholder(i, script.name ?? 'StepShot');
      }
    } finally {
      result.duration = Date.now() - start;
      results.push(result);
    }
  }

  // Quit driver if used
  if (!usingSim && (driver as any)) {
    try {
      await (driver as any).quit();
    } catch {
      // ignore
    }
  }

  const mode: 'driver'|'simulation' = usingSim ? 'simulation' : 'driver';
  return { results, mode };
}

// Expose a small helper for tests or UI
export function generatePlaceholderFor(scriptName: string, stepIndex: number): string {
  return generatePlaceholder(stepIndex, scriptName);
}