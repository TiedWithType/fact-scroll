import { DOMTools } from './lib/dom.tools';
import block from "./block";

export async function generateCards(container, source) {
 let fragment = DOMTools.create('fragment');

 const cardPromises = source.map(async (card) => {
  const cardElement = await block(card);
  cardElement.appendTo(fragment);
 });

 await Promise.all(cardPromises);

 container.appendChild(fragment);
}
