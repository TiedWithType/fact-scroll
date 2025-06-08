window.addEventListener("load", async () => {
 if (import.meta.env.DEV) {
  let eruda = await import('eruda');
  eruda.init();
 }
 
 let { showUserAgreementDialog
 } = await import("./agreements.mjs");
 
 const agreed = 
 await showUserAgreementDialog();
 
 if(import.meta.env.PROD && agreed) {
  const {
   injectSpeedInsights
  } = await import("@vercel/speed-insights");
  injectSpeedInsights();
 }
 
 const { SnapScrollManager
 } = await import("./snap.manager.mjs");
  
 new SnapScrollManager();
});