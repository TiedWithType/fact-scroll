import { SnapScrollManager } from "./snap.manager.mjs";
import { injectSpeedInsights } from '@vercel/speed-insights';

injectSpeedInsights();

requestIdleCallback(() => {
 if(!SnapScrollManager.isActive) {
   new SnapScrollManager().init();
   SnapScrollManager.isActive = true;
 }
});