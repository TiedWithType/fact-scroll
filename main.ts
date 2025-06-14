import { SnapScrollManager } from "./lib/snap.manager";
import { themeSwitch } from "./lib/themes";
import { block } from "./lib/block";

themeSwitch();

window.addEventListener('load', async () => {
 await document.fonts.ready;

 setTimeout(() => {
  document.querySelector('.container')
  .classList.add("render");
 }, 200);
 
 block({
  title: 'Witaj w FactScroll',
  text: ['Przed Tobą ponad 100 ciekawych faktów', 'Przewijaj po wiedzy!!!'],
  visited: true,
  fg: "#fff",
  bg: `
  linear-gradient( #202124,
   var(--pink), var(--indigo),
    #202124
  )
 `.trim(),
 }).appendTo(document.querySelector('.container'));
 
 Reflect.construct(SnapScrollManager, []).init();
});
