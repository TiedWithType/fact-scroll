import { DOMTools } from "./lib/dom.tools.mjs";

export function getCookie(name) {
  const cookies = document.cookie.split("; ").map(c => c.split("="));
  for (const [key, val] of cookies) {
    if (key === name) return decodeURIComponent(val);
  }
  return null;
}

export function setCookie(name, value, days) {
  const expires = days
    ? "; max-age=" + days * 24 * 60 * 60
    : "";
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax`;
}

export function showUserAgreementDialog() {
  return new Promise(resolve => {
    if (getCookie("userAgreement")) return resolve(true);

    const dialog = DOMTools.create("dialog").appendTo(document.body);

    dialog.innerHTML = `
      <h2>Informacja o ochronie danych</h2>
      <p>Fakty są przechowywane lokalnie w postaci (JSON).</p>
      <p>Informacja o zgodzie użytkownika zapisywana jest jako cookie (30 dni).</p>
      <p>Dane wydajnościowe zbierane są anonimowo przez Vercel Speed Insights. <a href="https://vercel.com/docs/speed-insights/privacy-policy?utm_source=chatgpt.com" target="_blank" focus="false">Szczegóły</a>.</p>
      <p>W każdej chwili możesz usunąć przechowywane dane za pomocą funkcji przeglądarki</p>
      <menu>
        <button id="accept">Akceptuję</button>
        <button id="decline">Odrzucam</button>
      </menu>
    `;

    DOMTools.create("style", {
      innerHTML: `
        dialog {
          font-family: 'Quicksand', sans-serif;
          position: fixed;
          inset: 0;
          padding: 1.5rem;
          border-radius: 12px;
          background-color: #fff;
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
          color: #222;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 80vh;
          margin: auto;
          width: 80%;
          overflow-y: auto;
          opacity: 0;
          transform: scale(0);
          transition: opacity .5s ease, transform .5s ease;
          pointer-events: none;
        }

        dialog[open]:not([close]) {
          opacity: 1;
          transform: scale(1);
          pointer-events: auto;
        }

        dialog[close] {
          opacity: 0;
          transform: scale(0);
          pointer-events: none;
        }

        h2 {
          font-size: 1.5rem;
          margin: 0 0 0.5rem 0;
        }

        p {
          font-size: 1rem;
          line-height: 1.4;
          margin: 0;
        }

        menu {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          padding: 0;
          border: none;
        }

        button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-family: 'Quicksand', sans-serif;
          font-size: 0.875rem;
        }

        #accept {
          background-color: #4caf50;
          color: white;
        }

        #accept:hover {
          background-color: #43a047;
        }

        #decline {
          background-color: #f44336;
          color: white;
        }

        #decline:hover {
          background-color: #e53935;
        }
      `
    }).appendTo(document.head);
    
    

    setTimeout(() => {
     dialog.setAttribute("tabindex", "-1");

requestAnimationFrame(() => {
  dialog.showModal();
  dialog.removeAttribute("close");
  dialog.focus();
});
    }, 100)

    dialog.addEventListener("cancel", e => {
      e.preventDefault();
      dialog.setAttribute("close", "");
      setTimeout(() => dialog.close(), 250);
    });

    dialog.querySelector("#accept").addEventListener("click", () => {
      setCookie("userAgreement", "accepted", 30);
      dialog.setAttribute("close", "");
      setTimeout(() => {
        dialog.close();
        resolve(true);
      }, 250);
    });

    dialog.querySelector("#decline").addEventListener("click", () => {
      sessionStorage.removeItem("facts");
      localStorage.removeItem("facts");
      dialog.setAttribute("close", "");
      setTimeout(() => {
        dialog.close();
        resolve(false);
      }, 250);
    });
  });
}