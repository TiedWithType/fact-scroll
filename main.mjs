window.addEventListener("load", async () => {
 const { SnapScrollManager
 } = await import("./snap.manager.mjs");
  
 new SnapScrollManager();
 
 if(import.meta.env.PROD) {
  const {
   injectSpeedInsights
  } = await import("@vercel/speed-insights");
  injectSpeedInsights();
 }
});