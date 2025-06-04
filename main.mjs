import { SnapScrollManager } from "./snap.manager.mjs";
import { injectSpeedInsights } from '@vercel/speed-insights';

injectSpeedInsights();

new SnapScrollManager();