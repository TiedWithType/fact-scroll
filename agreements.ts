import { DOMTools } from './lib/dom.tools';

export function getCookie(name) {
 const cookies = document.cookie.split('; ').map((c) => c.split('='));
 for (const [key, val] of cookies) {
  if (key === name) return decodeURIComponent(val);
 }
 return null;
}

export function setCookie(name, value, days) {
 const expires = days ? '; max-age=' + days * 24 * 60 * 60 : '';
 document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax`;
}

export function showUserAgreementDialog() {
 return new Promise((resolve) => {
  if (getCookie('userAgreement_v2')) return resolve(true);

  const dialog = DOMTools.create('dialog').appendTo(document.body);

  dialog.innerHTML = `
      <h2>Informacja o przetwarzaniu danych</h2>
      <p>Dane są przechowywane lokalnie w postaci JSON.</p>
      <p>Informacja o zgodzie użytkownika zapisywana jest jako cookie przez 30 dni.</p>
      <p>Dane wydajnościowe zbierane są anonimowo przez Vercel Speed Insights. <a href="https://vercel.com/docs/speed-insights/privacy-policy?utm_source=chatgpt.com" target="groupA" rel="noopener" >Kliknij tu, aby przeczytać</a>.</p>
      <p>W każdej chwili możesz usunąć przechowywane dane za pomocą funkcji przeglądarki</p>
      <menu>
        <button id="accept">Akceptuję</button>
        <button id="decline">Odrzucam</button>
      </menu>
    `;

  DOMTools.create('style', {
   innerHTML: `
       dialog, dialog * {
  outline: 0;
}

dialog {
  font-family: 'Quicksand', sans-serif;
  position: fixed;
  inset: 0;
  padding: 1.5rem;
  border-radius: 12px;
  background-color: var(--textColor);

  color: var(--bgColor);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 80vh;
  margin: auto;
  width: 80%;
  overflow-y: auto;

  /* start hidden: przesunięty w dół i niewidoczny */
  opacity: 0;
  transform: translateY(100%);
  transition: opacity 0.5s ease, transform 0.5s ease;
  pointer-events: none;
}

dialog[open]:not([close]) {
  /* widoczny i na właściwym miejscu */
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

dialog[close] {
  opacity: 0;
  transform: translateY(100%);
  pointer-events: none;
}

/* reszta bez zmian */
dialog h2 {
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
}

dialog p {
  font-size: 1rem;
  line-height: 1.4;
  margin: 0;
  text-wrap: pretty;
}

dialog a, a:visited, a:active, a:hover {
  text-decoration: none;
  color: #4CAF50;
}

dialog menu {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0;
  border: none;
}

dialog button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  font-family: 'Quicksand', sans-serif;
  font-size: 0.95rem;
}

#accept {
  background-color: #4CAF50;
  color: white;
}

#accept:hover {
  /* tu możesz dodać efekt hover */
}

#decline {
  color: #FF5252;
  background: transparent;
  border: solid 1px;
}

#decline:hover {
  /* tu możesz dodać efekt hover */
}
      `,
  }).appendTo(document.head);

  setTimeout(() => {
   dialog.setAttribute('tabindex', '-1');

   requestAnimationFrame(() => {
    dialog.showModal();
    dialog.removeAttribute('close');
    dialog.focus();
   });
  }, 3000);

  dialog.addEventListener('cancel', (e) => {
   e.preventDefault();
   dialog.setAttribute('close', '');
   setTimeout(() => dialog.close(), 250);
  });

  dialog.querySelector('#accept').addEventListener('click', () => {
   setCookie('userAgreement_v2', 'accepted', 30);
   dialog.setAttribute('close', '');
   setTimeout(() => {
    dialog.close();
    resolve(true);
   }, 250);
  });

  dialog.querySelector('#decline').addEventListener('click', () => {
   sessionStorage.removeItem('facts');
   localStorage.removeItem('facts');
   dialog.setAttribute('close', '');
   setTimeout(() => {
    dialog.close();
    resolve(false);
   }, 250);
  });
 });
}
