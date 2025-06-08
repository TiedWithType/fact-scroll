import { createCard, generateCards } from './cards.mjs';
import { $ } from './lib/dom.mjs';
import { DOMTools } from "./lib/dom.tools.mjs";
import { loadFacts } from './lib/facts.mjs';

export class SnapScrollManager {
 container = $.get('.container');
 hook = undefined;
 static isActive = false;
 events = [
  'scroll', 'touchstart', 'mousemove', 'wheel'
 ];

 constructor() {
  const runInit = async () => {
   if (!SnapScrollManager.isActive) {
    await this.init();
    SnapScrollManager.isActive = true;
   }
  };

  if ('requestIdleCallback' in window) {
   requestIdleCallback(runInit, { timeout: 2000 });
  } else {
   const interaction = () => {
    runInit();
    this.events.forEach((event) =>
     window.removeEventListener(event, interaction),
    );
   };

   this.events.forEach((event) =>
    window.addEventListener(event, interaction, 
    { passive: true }),
   );

   setTimeout(runInit, 3000);
  }
 }

 async init() {
  await this.collectSnaps();
  await this.buildNavigation();
  await this.collectLinks();
  await this.assignEvents();
 }

 async collectSnaps() {
  generateCards(this.container, await loadFacts());
  this.snaps = $.getAll('.snap', this.container);
 }

 async collectLinks() {
  this.links = $.getAll('.link', this.nav);
 }
 
 buildLink(snap) {
  let uid = `
   snap_${Math.random().toString(36).slice(3)}
  `.trim();

  return DOMTools.create("div", {
   className: "link",
   dataset: { 
    snapRef: snap.dataset.snapRef ||= uid
   },
   events: {
    click: () =>
    snap.scrollIntoView({ behavior: 'smooth' })
   }
  });
 }

 async buildNavigation() {
  this.nav = DOMTools.create("div", {
   className: "nav navigator"
  }).appendTo(document.body);
  
  DOMTools.create("fragment", {
   children: this.snaps.map(snap => 
    this.buildLink(snap)) 
  }).appendTo(this.nav);
  
  this.indicator = DOMTools.create("div", {
   className: "indicator"
  }).appendTo(this.nav);

  if (this.nav.childElementCount > 10) {
   this.nav.classList.add('scrollable');
  }
 }

 async displayNavigation() {
  requestAnimationFrame(() => {
   this.nav.classList.add('visible');
  });

  clearTimeout(this.hook);
  this.hook = setTimeout(() => {
   this.nav.classList.remove('visible');
  }, 2500);
 }

 async trackByIndicator(link, { snapRef }) {
  let isActive = link.dataset.snapRef === snapRef;
  
  if (!isActive) return false;

  const { offsetTop, offsetLeft } = link;
  const indicator = this.indicator;

  const isRow = window.innerWidth >= 621;

  if (isRow) {
   indicator.style.left = `${offsetLeft}px`;
  } else {
   indicator.style.top = `${offsetTop}px`;
  }

  link.scrollIntoView({
   behavior: 'smooth',
   block: 'center',
   inline: 'center',
  });

  return true;
 }

 async changingObserve(
  { snapTargetInline: x, snapTargetBlock: y }
 ) {
  let target = (x ?? y);
  
  requestAnimationFrame(() => {
   target.classList.add('visited')
  })
  
  this.links.every((link) => 
   this.trackByIndicator(link, target.dataset));
 }

 async addEvent(name, callback) {
  this.container.addEventListener(
   name, callback.bind(this), {
   passive: true
  });
 }

 async scrollEvent() {
  this.events.forEach((ev) => {
   this.addEvent(ev, this.displayNavigation);
  });
 }

 async changingEvent() {
  this.addEvent('scrollsnapchanging', 
   this.changingObserve);
 }

 async assignEvents() {
  await this.scrollEvent();
  await this.changingEvent();
 }
}