import { DOMTools } from './dom.tools';
import block from './block';

export class SnapScrollManager {
 container = DOMTools.collection('.container');
 sw = DOMTools.collection('.switch');
 hook = undefined;
 
 async init(timer = 4000) {
  this.timer = timer;
  await this.collectSnaps();
  await this.buildNavigation();
  await this.collectLinks();
  await this.assignEvents();
 }
 
 async batchLoad(chunkName, count) {
  const { loadFacts } = await import("./facts");
  
  for(let x = 0; x < count; x++) {
   let chunk = await loadFacts(`${chunkName}${x}`);
   
   for(let chunkData of chunk) {
    await block(chunkData).appendTo(this.container);
   }
   
   await new Promise(r => setTimeout(r, 0));
  }
 }
 
 async nonbatchLoad(file) {
  const { loadFacts } = await import("./facts");
  const data = await loadFacts(file);
  
  for(const obj of data) {
   await block(obj).appendTo(this.container);
  }
 }

 async collectSnaps() {
  await this.nonbatchLoad("facts");

  this.snaps =
   DOMTools.collection('[data-snap-ref]',
   this.container);
 }

 async collectLinks() {
  this.links = 
   DOMTools.collection('[data-snap-ref]', this.nav);
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
   className: `nav
    ${this.snaps.length > 10 && 'scrollable'}`,
   children: [
    DOMTools.create('fragment', {
     children: this.snaps.map((snap) =>
      this.buildLink(snap)),
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
   this.sw.classList.add('active');
  });

  clearTimeout(this.hook);
  
  this.hook = setTimeout(() => {
   this.nav.classList.remove('visible');
   this.sw.classList.remove('active');
  }, this.timer);
 }

 async trackByIndicator(link, { snapRef }) {
  if (link.dataset.snapRef != snapRef) return false;
  
  let data = (window.innerWidth >= 621)
  ? { type: 'left', offset: link.offsetLeft }
  : { type: 'top',  offset: link.offsetTop }
  
  DOMTools.style(this.indicator, {
   [data.type]: `${data.offset}px`
  });

  link.scrollIntoView({
   behavior: 'smooth',
   block: 'center',
   inline: 'center',
  });

  return true;
 }

 async changingObserve({
  snapTargetInline,
  snapTargetBlock
 }) {
  let target = snapTargetInline ?? snapTargetBlock;

  requestAnimationFrame(() => {
   [...target.children].forEach((child) =>
    DOMTools.style(child, {
     opacity: '1',
     transform: 'scale(1)',
    }),
   );
  });

  this.links.every((link) =>
   this.trackByIndicator(link, target.dataset));
 }

 addEvent(name, cb, options = {}) {
  const ref = this.container;
  name = name.toLowerCase();
  
  ref.addEventListener(name, cb.bind(this), {
   ...options,
   passive: true,
  });
 }
 
 mapEvents(map, options = {}) {
  Object.entries(map).forEach(([key, value]) => {
   Array.isArray(value)
   ? [...value].forEach(handler =>
    this.addEvent(key, handler, options)
   ) : this.addEvent(key, value, options)
  });
 }

 async assignEvents() {
  this.mapEvents({
   scrollsnapchanging: [
    this.changingObserve,
    this.displayNavigation
   ]
  })
 }
}