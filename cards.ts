import { DOMTools } from './lib/dom.tools';
import { v7 as uuidv7 } from 'https://cdn.jsdelivr.net/npm/uuid/dist/esm-browser/index.js';
import block from "./block";

export async function createCard(props) {
 return DOMTools.create('div', {
  className: 'snap card',
   dataset: {
   snapRef: uuidv7(),
  },
  style: {
   '--cardText': props.fg.trim(),
   '--cardBg': props.bg.trim(),
  },
  children: [
   DOMTools.create('span', {
    className: 'icon',
    textContent: props.icon.trim(),
   }),
   DOMTools.create('h2', {
    textContent: props.title.trim(),
   }),
   DOMTools.create('p', {
    innerHTML: props.text.trim(),
   }),
  ],
 });
}

export async function generateCards(container, source) {
 let fragment = DOMTools.create('fragment');

 const cardPromises = source.map(async (card) => {
  const cardElement = await block(card);
  cardElement.appendTo(fragment);
 });

 await Promise.all(cardPromises);

 container.appendChild(fragment);
}
