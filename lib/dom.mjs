export class $ {
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
