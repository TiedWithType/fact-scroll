window.addEventListener('load', async () => {
 const themes = await import("./lib/themes");
 
 await themes.themeSwitch();
 await document.fonts.ready;

 setTimeout(() => {
  document.querySelector('.container')
  .classList.add("render");
 }, 200);
 
 let block = await import('./lib/block');
 
 block.default({
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

 const { SnapScrollManager } =
 await import('./lib/snap.manager');
 
 Reflect.construct(SnapScrollManager, []).init();
});
