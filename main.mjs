import { injectSpeedInsights } from '@vercel/speed-insights';

injectSpeedInsights();

window.addEventListener("load", async () => {
  const { SnapScrollManager } = await import("./snap.manager.mjs");
  new SnapScrollManager();
});