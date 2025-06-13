export class DOMTools {
 static style(node, props = {}) {
  Object.assign(node.style, props);
 }
 
 static collection(tagName, rootEl = document) {
  let nodes = 
  Array.from(rootEl.querySelectorAll(tagName));
  
  return nodes.length > 1
  ? nodes
  : nodes[0] ?? null;
 }

 static create(tag, options = {}) {
  const isFragment = tag === 'fragment';
  const el = isFragment
   ? document.createDocumentFragment()
   : document.createElement(tag);

  for (const [key, value] of Object.entries(options)) {
   switch (key) {
    case 'style':
     if (!isFragment) {
      for (const [prop, val] of Object.entries(value)) {
       if (prop.startsWith('--')) {
        el.style.setProperty(prop, val);
       } else {
        el.style[prop] = val;
       }
      }
     }
     break;
    case 'dataset':
     if (!isFragment) Object.assign(el.dataset, value);
     break;
    case 'attributes':
     if (!isFragment) {
      for (const [attr, val] of Object.entries(value)) {
       el.setAttribute(attr, val);
      }
     }
     break;
    case 'children':
     for (const child of value) {
      el.append(
       typeof child === 'string' ? document.createTextNode(child) : child,
      );
     }
     break;
    case 'events':
     if (!isFragment) {
      for (const [event, handler] of Object.entries(value)) {
       el.addEventListener(event, handler);
      }
     }
     break;

    case 'nodeMap':
     const refs = {};
     Object.values(value).forEach((obj) => {
      Object.entries(obj).forEach(([name, node]) => {
       if (node instanceof Node) {
        refs[name] = node;
        el.appendChild(node);
       }
      });
     });
     el.refs = refs; // np. przypisz do elementu, żeby mieć dostęp na zewnątrz
     break;

    default:
     if (!isFragment) Reflect.set(el, key, value);
   }
  }

  return isFragment
   ? Object.assign(el, DOMTools.fragmentMethods)
   : Object.assign(el, DOMTools.methods);
 }

 static methods = {
  appendTo(parent) {
   parent.appendChild(this);
   return this;
  },
  prependTo(parent) {
   parent.prepend(this);
   return this;
  },
  replaceWith(newEl) {
   this.parent.replaceChild(newEl, this);
   return newEl;
  },
  wrapWith(wrapper) {
   this.replaceWith(wrapper);
   wrapper.appendChild(this);
   return wrapper;
  },
 };

 static fragmentMethods = {
  appendTo(parent) {
   parent.appendChild(this);
   return this;
  },
 };
}
