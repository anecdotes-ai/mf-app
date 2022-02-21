import { animate, state, style, transition, trigger } from '@angular/animations';

const removedSize = { height: 0, width: 0, transform: 'translateX(-100%)', 'border-width': 0 };
const removedOpacity = { opacity: 0 };
const notRemoved = { opacity: 1, transform: 'translateX(0)', height: '*', width: '*', 'border-width': '*' };
const opacityTimings = '0.1.5s ease-in';
const sizeTimings = '0.25s ease-out';

export const removeAnimation = trigger('removeAnimation', [
  state('false', style(notRemoved)),
  state('true', style({ ...removedOpacity, ...removedSize })),
  transition('false <=> true', [
    animate(opacityTimings, style(removedOpacity)),
    animate(sizeTimings, style(removedSize)),
  ]),
]);
