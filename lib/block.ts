import { DOMTools } from './dom.tools';

const uuid = () => {
 return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
  (
   c ^
   (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
  ).toString(16),
 );
};

const style = {
 card: {
  height: 'calc(100dvh - var(--cardOffset))',
  width: 'calc(100vw - var(--cardOffset))',
  margin:
   window.innerWidth >= 621
    ? 'auto var(--cardOffset)'
    : 'var(--cardOffset) auto',
  scrollSnapAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  placeItems: 'center',
  placeContent: 'center',
  gap: '0.5rem',
  flexShrink: '0',
  fontFamily: 'Quicksand, sans',
  padding: '1.5rem',
  borderWidth: 'var(--linkSize)',
  borderColor: 'var(--linkActiveBackground)',
  borderStyle: 'solid',
  borderRadius: 'calc(var(--linkSize) * 2)',
  contain: 'content',
  transition: 'border-color 0.1s ease-in',
  willChange: 'border-color',
  color: 'var(--cardText, var(--textColor))',
  background: 'var(--cardBg, var(--bgColor))',
 },
 header: {
  fontSize: 'clamp(1.4rem, 3vw, 3rem)',
  lineHeight: 'clamp(1.2, 1.5vw, 1.4)',
  textAlign: 'center',
  marginBottom: '0.5rem',
  willChange: 'opacity, transform',
  transition: 'all 0.6s var(--bounce)',
  transitionDelay: '.9s',
  opacity: '0',
  transform: 'scale(0.1)',
 },
 content: {
  fontSize: 'clamp(1rem, 1.5vw, 1.75rem)',
  lineHeight: 'clamp(1.4, 2vw, 2)',
  textAlign: 'center',
  margin: 0,
  textWrap: 'pretty',
  willChange: 'opacity, transform',
  transition: 'all 0.6s var(--bounce)',
  transitionDelay: '1.5s',
  opacity: '0',
  transform: 'scale(0.1)',
 },
};

export const block = (props = {}) => {
 const { visited } = props;

 return DOMTools.create('div', {
  dataset: {
   snapRef: uuid(),
  },
  style: {
   ...style.card,
   '--cardText': props.fg,
   '--cardBg': props.bg,
  },
  children: [
   ...(props.icon
    ? [
       DOMTools.create('span', {
        style: {
         fontSize: 'clamp(2.2rem, 5vw, 4rem)',
         fontFamily: 'Symbols',
         marginBottom: '0.65rem',
         color: 'var(--cardText, var(--textColor))',
         opacity: visited ? '1' : '0',
         transform: `scale(${visited ? '1' : '0.1'})`,
         willChange: 'opacity, transform',
         transition: 'all 0.6s var(--bounce)',
         transitionDelay: '.3s',
        },
        textContent: props.icon,
       }),
      ]
    : []),

   ...(props.title
    ? [
       DOMTools.create('h2', {
        style: {
         ...style.header,
         opacity: visited ? '1' : '0',
         transform: `scale(${visited ? '1' : '0.1'})`,
        },
        textContent: props.title,
       }),
      ]
    : []),

   ...(Array.isArray(props.text)
    ? props.text.map((t) =>
       DOMTools.create('p', {
        style: {
         ...style.content,
         opacity: visited ? '1' : '0',
         transform: `scale(${visited ? '1' : '0.1'})`,
        },
        innerHTML: t,
       }),
      )
    : props.text
      ? [
         DOMTools.create('p', {
          style: {
           ...style.content,
           opacity: visited ? '1' : '0',
           transform: `scale(${visited ? '1' : '0.1'})`,
          },
          innerHTML: props.text,
         }),
        ]
      : []),
  ],
 });
}
