
  const container = document.querySelector('.container');
  const sections = [...document.querySelectorAll('.section')];
  const dotNav = document.getElementById('dot-nav');

  // 🟠 Dots dynamiczne
  sections.forEach((section, index) => {
    const id = section.id || `section-${index + 1}`;
    section.id = id;

    const label = section.dataset.label || `Sekcja ${index + 1}`;
    const dot = document.createElement('a');
    dot.href = `#${id}`;
    dot.className = 'dot';
    dot.dataset.id = id;
    dot.dataset.tooltip = label;

    dot.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    });

    dotNav.appendChild(dot);
  });

  // 🟢 Podświetlanie aktywnej sekcji + adres URL
 /* const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      history.replaceState(null, '', `#${id}`);

      document.querySelectorAll('.dot').forEach((dot) => {
        dot.classList.toggle('active', dot.dataset.id === id);
        
      });
    });
  }, { threshold: 0.6 }); */
  
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;

    // Ustaw aktywny URL
    history.replaceState(null, '', `#${id}`);

    // Zmieniamy klasę active i kolor
    const activeColor = getComputedStyle(entry.target).backgroundColor;
    document.querySelectorAll('.dot').forEach((dot) => {
      const isActive = dot.dataset.id === id;
      dot.classList.toggle('active', isActive);
      if (isActive) {
        dot.style.backgroundColor = activeColor;
      } else {
        dot.style.backgroundColor = ''; // reset do domyślnego
      }
    });
  });
}, { threshold: 0.6 });

  sections.forEach(section => observer.observe(section));


  // 💤 Auto ukrywanie kropek po bezczynności
  let hideTimeout;
  function showDotNav() {
    dotNav.classList.remove('hidden');
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      dotNav.classList.add('hidden');
    }, 3000);
  }

  ['scroll', 'mousemove', 'click', 'touchstart'].forEach(e =>
    window.addEventListener(e, showDotNav)
  );

  showDotNav(); // uruchom od razu