export function createCard({ icon, title, text, fg, bg }) {
 const card = document.createElement("div");
 card.className = "snap card";

 card.style.color = fg.trim();
 card.style.background = bg.trim();
 
 card.innerHTML = `
    <span class="material-icons">${icon}</span>
    <h2>${title}</h2>
    <p>${text}</p>
  `;
 return card;
}

export function generateCards(container, source) {
 source.forEach(fact => {
  let card = createCard(fact);
  container.appendChild(card)
 })
}