const themeSwitch = () => {
 const DEBUG = false;
 const log = (...args) =>
  DEBUG && console.log('%c[ThemeSwitch]', 'color: goldenrod', ...args);

 const sw = document.querySelector('.switch');
 if (!sw) return;

 const nodes = Array.from(sw.children);
 const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

 // ðŸ”§ Tymczasowo wyÅ‚Ä…cz animacje .snap.visited *
 const disableSnapAnimationsTemporarily = () => {
  document.documentElement.classList.add('theme-changing');
  setTimeout(() => {
   document.documentElement.classList.remove('theme-changing');
  }, 300); // Dopasuj do najdÅ‚uÅ¼szej delay/transition w .snap.visited *
 };

 // ðŸ”„ GÅ‚Ã³wna funkcja zmieniajÄ…ca motyw
 const setTheme = (theme) => {
  disableSnapAnimationsTemporarily(); // ðŸ›‘ zablokuj animacje .snap

  let appliedTheme = theme;
  if (theme === 'auto') {
   appliedTheme = prefersDark.matches ? 'dark' : 'light';
  }

  document.documentElement.setAttribute('data-theme', appliedTheme);
  localStorage.setItem('theme', theme);

  nodes.forEach((n) => n.classList.toggle('active', n.dataset.theme === theme));

  log('Ustawiono motyw:', theme, `(realnie: ${appliedTheme})`);
 };

 // ðŸ”ƒ Ustaw motyw na starcie
 const savedTheme = localStorage.getItem('theme') || 'auto';
 setTheme(savedTheme);

 // ðŸ–± ObsÅ‚uga klikniÄ™Ä‡
 nodes.forEach((node) => {
  node.addEventListener('click', (e) => {
   const theme = e.currentTarget.dataset.theme;
   if (theme) setTheme(theme);
  });
 });

 // ðŸŒ™ Reakcja na zmianÄ™ motywu systemowego, jeÅ›li aktywny "auto"
 prefersDark.addEventListener('change', () => {
  if (localStorage.getItem('theme') === 'auto') {
   setTheme('auto');
  }
 });
};

themeSwitch();

window.addEventListener('load', async () => {
 const { SnapScrollManager } = await import('./snap.manager');

 new SnapScrollManager();

 let { showUserAgreementDialog } = await import('./agreements');

 const agreed = await showUserAgreementDialog();
});
