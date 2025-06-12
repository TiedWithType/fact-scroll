

   import block from "./block";



const themeSwitch = () => {
  const sw = document.querySelector('.switch');
  if (!sw) return;

  const nodes = Array.from(sw.children);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  const disableSnapAnimationsTemporarily = () => {
    document.documentElement.classList.add('theme-changing');
    setTimeout(() => {
      document.documentElement.classList.remove('theme-changing');
    }, 300);
  };

  const setTheme = (theme) => {
    disableSnapAnimationsTemporarily();

    const appliedTheme = theme === 'auto'
      ? (prefersDark.matches ? 'dark' : 'light')
      : theme;

    document.documentElement.setAttribute('data-theme', appliedTheme);
    localStorage.setItem('theme', theme);

    nodes.forEach((n) => {
      n.classList.toggle('active', n.dataset.theme === theme);
    });
  };

  const savedTheme = localStorage.getItem('theme') || 'auto';
  setTheme(savedTheme);

  nodes.forEach((node) => {
    node.addEventListener('click', ({ currentTarget }) => {
      const theme = currentTarget.dataset.theme;
      if (theme) setTheme(theme);
    });
  });

  prefersDark.addEventListener('change', () => {
    if (localStorage.getItem('theme') === 'auto') {
      setTheme('auto');
    }
  });
};

themeSwitch();

window.addEventListener('load', async () => {
 await document.fonts.ready;
 
 setTimeout(() => {
  document.querySelector
  (".container").style.opacity="1"
 }, 100);
 
 block({
 title: "Witaj w FactScroll",
 text: [
  "Przed Tobą ponad 100 ciekawych faktów",
  "Przewijaj po wiedzy!!!"
 ],
 visited: true
}).appendTo(
document.querySelector(".container"))


  const { SnapScrollManager } = await import('./snap.manager');
  new SnapScrollManager();

  const { showUserAgreementDialog } = await import('./agreements');
  const agreed = await showUserAgreementDialog();
});