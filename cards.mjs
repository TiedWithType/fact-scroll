import { DOMTools } from "./lib/dom.tools.mjs";

export function createCard(props) {
 return DOMTools.create("div", {
  className: "snap card",
  style: {
   "--cardText": props.fg.trim(),
   "--cardBg": props.bg.trim()
  },
  children: [
   DOMTools.create("span", {
    className: "icon",
    textContent: props.icon.trim()
   }),
   DOMTools.create("h2", {
    textContent: props.title.trim()
   }),
   DOMTools.create("p", {
    innerHTML: props.text.trim()
   })
  ],
 });
}

export function generateCards(container, source) {
 let fragment = DOMTools.create('fragment');
 
 source.forEach(card => 
  createCard(card).appendTo(fragment)
 );
 
 container.appendChild(fragment);
}