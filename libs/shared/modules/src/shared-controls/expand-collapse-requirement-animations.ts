import { animate, state, style, transition, trigger } from '@angular/animations';

const transitionDuration = 150; // common duration for expand/collapse

export const ExpandCollapseRequirementAnimations = [
  trigger('parent', [transition(':enter', [])]),
  // To prevent initial animation
  // https://stackoverflow.com/questions/44111239/angular-is-there-a-way-to-skip-enter-animation-on-initial-render
  trigger('expandCollapseReq', [
    state('expandCollapseState', style({ height: '*' })),
    transition('* => void', [style({ height: '*' }), animate(transitionDuration, style({ height: '0' }))]),
    transition('void => *', [style({ height: '0' }), animate(transitionDuration, style({ height: '*' }))]),
  ]),
  trigger('evidenceAddRemoveAnimation', [
    transition(':enter', [
      style({ height: '0px' }), // initial
      animate('0.3s', style({ height: '*' })), // final
    ]),
    transition(':leave', [
      style({ height: '*' }), // initial
      animate('0.3s', style({ height: '0px' })), // final
    ]),
  ]),
];
