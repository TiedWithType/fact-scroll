import { createCard, generateCards } from "./cards.mjs";

async function loadAllChunks() {
  const manifest = [
   "chunk_1", "chunk_2", "chunk_3"
  ];

  const chunks = await Promise.all(
    manifest.map(filename =>
      fetch(`./chunks/${filename}.json`).then(res => res.json())
    )
  );

  return chunks.flat();
}

class $ {
  static create(tag) {
    return document.createElement(tag);
  }

  static get(query, root = document) {
    return root.querySelector(query);
  }

  static getAll(query, root = document) {
    return Array.from(root.querySelectorAll(query));
  }
}

export class SnapScrollManager {
  container = $.get(".container");
  nav = $.get(".nav");
  hook = undefined;
  index = 0;
  static isActive = false;

  constructor() {
   
  }

  async init() {
    await this.collectSnaps();
    await this.buildNavigation();
    await this.collectLinks();
    await this.assignEvents();
    
  }
 
  async collectSnaps() {
 
  let chunks = await loadAllChunks();
 
  generateCards(this.container, chunks);
   
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
    }, 1500);
  }

  async setActiveLink(link, snapId) {
    let active = link.dataset.snapRef === snapId;
    link.classList.toggle("active", active);

    if (active) {
      link.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }

  async changingObserve({ snapTargetInline: x, snapTargetBlock: y }) {
    let snapId = (x ?? y).id;
    this.links.forEach(link => this.setActiveLink(link, snapId));
  }

  async addEvent(name, callback) {
    this.container.addEventListener(name, callback);
  }

  async scrollEvent() {
    this.addEvent("scroll", this.displayNavigation.bind(this));
  }

  async changingEvent() {
    this.addEvent("scrollsnapchanging", this.changingObserve.bind(this));
  }

  async assignEvents() {
    await this.scrollEvent();
    await this.changingEvent();
  }
}