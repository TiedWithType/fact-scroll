export class DOMTools {
 static create(tag, options = {}) {
  const isFragment = tag === 'fragment'
  const el = isFragment
   ? document.createDocumentFragment()
   : document.createElement(tag)

  for (const [key, value] of Object.entries(options)) {
   switch (key) {
    case 'style':
     if (!isFragment) {
      for (const [prop, val] of Object.entries(value)) {
       if (prop.startsWith('--')) {
        el.style.setProperty(prop, val)
       } else {
        el.style[prop] = val
       }
      }
     }
     break
    case 'dataset':
     if (!isFragment) Object.assign(el.dataset, value)
     break
    case 'attributes':
     if (!isFragment) {
      for (const [attr, val] of Object.entries(value)) {
       el.setAttribute(attr, val)
      }
     }
     break
    case 'children':
     for (const child of value) {
      el.append(
       typeof child === 'string'
        ? document.createTextNode(child)
        : child,
      )
     }
     break
    case 'events':
     if (!isFragment) {
      for (const [event, handler] of Object.entries(value)) {
       el.addEventListener(event, handler)
      }
     }
     break
    default:
     if (!isFragment) Reflect.set(el, key, value)
   }
  }

  return isFragment
   ? Object.assign(el, DOMTools.fragmentMethods)
   : Object.assign(el, DOMTools.methods)
 }

 static methods = {
  appendTo(parent) {
   parent.appendChild(this)
   return this
  },
  prependTo(parent) {
   parent.prepend(this)
   return this
  },
  replaceWith(newEl) {
   this.replaceWith(newEl)
   return newEl
  },
  wrapWith(wrapper) {
   this.replaceWith(wrapper)
   wrapper.appendChild(this)
   return wrapper
  },
 }

 static fragmentMethods = {
  appendTo(parent) {
   parent.appendChild(this)
   return this
  },
 }
}