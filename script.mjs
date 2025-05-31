import { 
 $, randomColor, autoShowClose
} from "./lib/dom.mjs";

const container = $("fact-container");
let $scroll = container.hasAttribute("show-scroll");

if($scroll) {
 let scroll = document.createElement("fact-scroll");
 container.appendChild(scroll);
 
 scroll.classList.add("hidden")
}

const factCards = $('fact-card', container);
const factScroll = $('fact-scroll', container);

factCards.forEach((card, id) => {
 let text = `Card ${id + 1}`;
 
 if(!card.id) {
  card.id = text.split(" ").join("-").toLowerCase();
 }
 
 const link = document.createElement('a');

 link.className = 'fact-scroll-link';
 link.dataset.id = card.id;
 link.dataset.tooltip = card.dataset.tooltip || text;

 link.addEventListener('click', (e) => {
  e.preventDefault();
  
  $(`#${card.id}`).scrollIntoView({
   behavior: 'smooth',
   block: "center" 
  });
 });

 factScroll.appendChild(link);
});

container.addEventListener("scrollsnapchanging", ({ snapTargetBlock }) => {
 const activeId = snapTargetBlock.id;

 $('.fact-scroll-link').forEach(link => {
  let isActive = link.dataset.id === activeId;  
  link.classList.toggle('active', isActive); 
 });
});

[
 'scroll', 'mousemove',
 'click', 'touchstart'
].forEach(e =>
 window.addEventListener(e, () =>
  autoShowClose({ target: factScroll })
 )
);

let firstLink = $('.fact-scroll-link')[0];
firstLink.classList.add("active");

setTimeout(() => {
 autoShowClose({ target: factScroll });
}, 100);