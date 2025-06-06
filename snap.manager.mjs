import { createCard, generateCards } from "./cards.mjs";
import { $ } from "./lib/dom.mjs";

async function loadAllChunks() {
 let $facts = localStorage.facts;

 if($facts) {
  return await JSON.parse($facts);
 } else {
  const raw = await fetch("/data/facts.json");
  const facts = await raw.json();
 
  localStorage.facts = JSON.stringify(facts);
  
  return facts.flat();
 }
}

export class SnapScrollManager {
  container = $.get(".container");
  nav = $.get(".nav");
  hook = undefined;
  index = 0;
  static isActive = false;

  constructor() {
    // Uruchamiamy init z opóźnieniem (idle + fallback na interakcję)
    const runInit = async () => {
      if (!SnapScrollManager.isActive) {
        await this.init();
        SnapScrollManager.isActive = true;
      }
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(runInit, { timeout: 2000 });
    } else {
      // fallback: odpal przy pierwszej interakcji
      const onUserInteraction = () => {
        runInit();
        window.removeEventListener('scroll', onUserInteraction);
        window.removeEventListener('touchstart', onUserInteraction);
        window.removeEventListener('mousemove', onUserInteraction);
        window.removeEventListener('keydown', onUserInteraction);
      };

      window.addEventListener('scroll', onUserInteraction, { passive: true });
      window.addEventListener('touchstart', onUserInteraction, { passive: true });
      window.addEventListener('mousemove', onUserInteraction, { passive: true });
      window.addEventListener('keydown', onUserInteraction, { passive: true });

      // Timeout, jeśli użytkownik nic nie zrobi - 3s
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
 
  let facts = await loadAllChunks();
 
  generateCards(this.container, facts);
   
    this.snaps = $.getAll(".snap", this.container);
  }

  async collectLinks() {
    this.links = $.getAll(".link", this.nav);
  }

  async assignSnapId(snap) {
    if (!snap.id) snap.id = `snap_${++this.index}`;
  }

  async buildLink(snap) {
    let link = $.create("div");
    link.classList.add("link");
    link.dataset.snapRef = snap.id;

    link.addEventListener("click", () => {
      snap.scrollIntoView({ behavior: "smooth" });
    });

    this.nav.appendChild(link);
  }

  async buildNavigation() {
    this.snaps.forEach(snap => {
      this.assignSnapId(snap);
      this.buildLink(snap);
    });
    
    this.indicator = $.create("div");
this.indicator.classList.add("indicator");
this.nav.appendChild(this.indicator);

    if (this.nav.childElementCount > 10) {
      this.nav.classList.add("scrollable");
    }
  }

  async displayNavigation() {
    requestAnimationFrame(() => {
      this.nav.classList.add("visible");
    });

    clearTimeout(this.hook);
    this.hook = setTimeout(() => {
      this.nav.classList.remove("visible");
    }, 2500);
  }
  
  async setActiveLink(link, snapId) {
  let isActive = link.dataset.snapRef === snapId;
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
    behavior: "smooth",
    block: "center",
    inline: "center",
  });


  return true;
}

  

  async changingObserve({ snapTargetInline: x, snapTargetBlock: y }) {
    let snapId = (x ?? y).id;
    this.links.every(link => this.setActiveLink(link, snapId));
  }

  async addEvent(name, callback, options = { passive: true }) {
  this.container.addEventListener(name, callback, options);
}

  async scrollEvent() {
  const events = ["scroll", "touchstart", "mousemove", "wheel"];
  events.forEach(ev => {
    this.addEvent(ev, this.displayNavigation.bind(this), { passive: true });
  });
}

  async changingEvent() {
    this.addEvent("scrollsnapchanging", this.changingObserve.bind(this));
  }

  async assignEvents() {
    await this.scrollEvent();
    await this.changingEvent();
  }
}