import { DOMTools } from './lib/dom.tools';
import block from "./block";

export async function generateCards(container, source) {
  const fragment = DOMTools.create('fragment');

  for (const card of source) {
    const cardElement = await block(card);
    cardElement.appendTo(fragment);

    // Oddaj kontrolę pętli, by UI się odświeżył
    await new Promise(resolve =>
    setTimeout(resolve, 0)); 
  }

  container.appendChild(fragment);
}