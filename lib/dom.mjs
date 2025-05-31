export const $ = (selector, parent = document.body) => {
 if (typeof parent == "string")
  parent = document.querySelector(parent)
 ?? document.body;
 
 let arr = parent.querySelectorAll(selector) ?? [];
 
 if(arr.length > 0)
  return arr.length === 1 ? arr[0] : [...arr];
};

export const randomColor = (alpha = 1) => {
 const r = Math.floor((Math.random() * 127) + 127);
 const g = Math.floor((Math.random() * 127) + 127);
 const b = Math.floor((Math.random() * 127) + 127);
 
 return `rgb(${r}, ${g}, ${b}, ${alpha})`;
}

let hideTimeout = null;

export const autoShowClose = (
{target, className, timer}) => {
 target.classList.remove(className ?? "hidden");
 clearTimeout(hideTimeout);
 
 hideTimeout = setTimeout(() => {
  target.classList.add(className ?? "hidden");
 }, timer ?? 3000);
}