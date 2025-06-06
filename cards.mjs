const cardTemplate = document.createElement("template");

export function createCard({ icon, title, text, fg, bg }) {
 cardTemplate.innerHTML = `
  <div
   class="snap card"
   style="--textColor: ${fg}; --bgColor: ${bg}">
   <span class="material-symbols-outlined">
    ${icon}
   </span>
   <h2>${title}</h2>
   <p>${text}</p>
  </div>
 `.trim();

 return cardTemplate.content.
 firstElementChild.cloneNode(true);
}

export function generateCards(container, source) {
 source.forEach(fact => {
  let card = createCard(fact);
  container.appendChild(card)
 })
}