import { SnapScrollManager } from "./snap.manager.mjs";

requestIdleCallback(() => {
 if(!SnapScrollManager.isActive) {
   new SnapScrollManager().init();
   SnapScrollManager.isActive = true;
 }
});