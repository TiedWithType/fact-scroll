const themeSwitch = () => {
 const DEBUG = false;
 const log = (...args) => DEBUG && console.log("%c[ThemeSwitch]", "color: goldenrod", ...args);

 const sw = document.querySelector(".switch");
 if (!sw) return;

 const nodes = Array.from(sw.children);
 const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

 // 🔧 Tymczasowo wyłącz animacje .snap.visited *
 const disableSnapAnimationsTemporarily = () => {
  document.documentElement.classList.add("theme-changing");
  setTimeout(() => {
   document.documentElement.classList.remove("theme-changing");
  }, 300); // Dopasuj do najdłuższej delay/transition w .snap.visited *
 };

 // 🔄 Główna funkcja zmieniająca motyw
 const setTheme = theme => {
  disableSnapAnimationsTemporarily(); // 🛑 zablokuj animacje .snap

  let appliedTheme = theme;
  if (theme === "auto") {
   appliedTheme = prefersDark.matches ? "dark" : "light";
  }

  document.documentElement.setAttribute("data-theme", appliedTheme);
  localStorage.setItem("theme", theme);

  nodes.forEach(n =>
   n.classList.toggle("active", n.dataset.theme === theme)
  );

  log("Ustawiono motyw:", theme, `(realnie: ${appliedTheme})`);
 };

 // 🔃 Ustaw motyw na starcie
 const savedTheme = localStorage.getItem("theme") || "auto";
 setTheme(savedTheme);

 // 🖱 Obsługa kliknięć
 nodes.forEach(node => {
  node.addEventListener("click", e => {
   const theme = e.currentTarget.dataset.theme;
   if (theme) setTheme(theme);
  });
 });

 // 🌙 Reakcja na zmianę motywu systemowego, jeśli aktywny "auto"
 prefersDark.addEventListener("change", () => {
  if (localStorage.getItem("theme") === "auto") {
   setTheme("auto");
  }
 });
};

themeSwitch();


window.addEventListener("load", async () => {
 if (import.meta.env.DEV) {
  let eruda = await import('eruda');
  eruda.init();
 }
 
 const { SnapScrollManager
 } = await import("./snap.manager.mjs");
  
 new SnapScrollManager();
 
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
});