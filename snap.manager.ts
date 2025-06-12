import { createCard, generateCards } from './cards';
import { $ } from './lib/dom';
import { DOMTools } from './lib/dom.tools';
import { loadFacts } from './lib/facts';

export class SnapScrollManager {
 container = $.get('.container');
 hook = undefined;
 static isActive = false;
 events = ['scroll', 'touchstart', 'mousemove', 'wheel'];

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
    window.addEventListener(event, interaction, { passive: true }),
   );

   setTimeout(runInit, 3000);
  }
 }

 async init() {
  await this.collectSnaps();
  await this.buildNavigation();
  await this.collectLinks();
  await this.assignEvents();

  window.addEventListener('resize', () => {
   this.trackByIndicator.bind(this, { snapRef: this.link.dataset.snapRef });
  });
 }

 async collectSnaps() {
  let f = await loadFacts();
  
  await generateCards(this.container, f);
  this.snaps = $.getAll('[data-snap-ref]', this.container);
  
  console.log({snaps: this.snaps })
 }

 async collectLinks() {
  this.links = $.getAll('[data-snap-ref]', this.nav);
  
  console.log({links: this.links })
 }

 buildLink(snap) {
  return DOMTools.create('div', {
   className: 'link',
   dataset: {
    snapRef: snap.dataset.snapRef,
   },
   events: {
    click: () =>
     snap.scrollIntoView({ behavior: 'smooth' }),
   },
  });
 }

 async buildNavigation() {
  this.nav = DOMTools.create('div', {
   className: `nav${this.snaps.length > 10 ? ' scrollable' : ''}`,
   children: [
    DOMTools.create('fragment', {
     children: this.snaps.map((snap) => this.buildLink(snap)),
    }),
    DOMTools.create('div', {
     className: 'indicator',
    }),
   ],
  }).appendTo(this.container);

  this.indicator = this.nav.lastElementChild;
 }

 async displayNavigation() {
  requestAnimationFrame(() => {
   this.nav.classList.add('visible');
   document.querySelector('.switch').classList.add('active');
  });

  clearTimeout(this.hook);
  this.hook = setTimeout(() => {
   this.nav.classList.remove('visible');
   document.querySelector('.switch').classList.remove('active');
  }, 4000);
 }

 async trackByIndicator(link, { snapRef }) {
  let isActive = link.dataset.snapRef === snapRef;
  if (!isActive) return false;

  const indicator = this.indicator;

  const _type = window.innerWidth >= 621 ? 'left' : 'top';

  const offset = window.innerWidth >= 621 ? link.offsetLeft : link.offsetTop;

  indicator.style[_type] = `${offset}px`;

  this.link = link;

  link.scrollIntoView({
   behavior: 'smooth',
   block: 'center',
   inline: 'center',
  });

  return true;
 }

 async changingObserve({ snapTargetInline: x, snapTargetBlock: y }) {
  let target = x ?? y;

  requestAnimationFrame(() => {
   [...target.children].forEach(child =>
    Object.assign(child.style, {
     opacity: "1",
     transform: "scale(1)"
    })
   )
  });

  this.links.every((link) => this.trackByIndicator(link, target.dataset));
 }

 async addEvent(name, callback) {
  this.container.addEventListener(name, callback.bind(this), {
   passive: true,
  });
 }

 async scrollEvent() {
  this.events.forEach((ev) => {
   this.addEvent(ev, this.displayNavigation);
  });
 }

 async changingEvent() {
  this.addEvent('scrollsnapchanging', this.changingObserve);
 }

 async assignEvents() {
  await this.scrollEvent();
  await this.changingEvent();
 }
}
