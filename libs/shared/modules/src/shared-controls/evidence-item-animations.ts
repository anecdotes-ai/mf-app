import { animate, style, transition, trigger } from '@angular/animations';

export const EvidenceItemAnimations = [
  trigger('expandCollapse', [
    transition(':enter', [
      style({ height: '0px' }), // initial
      animate('0.2s', style({ height: '*' })), // final
    ]),
    transition(':leave', [
      style({ height: '*' }), // initial
      animate('0.2s', style({ height: '0px' })), // final
    ]),
  ]),
  trigger('hideStatus', [
    transition(':leave', [
      style({ transform: 'translate3d(0, 0, 0)' }), // initial
      animate('0.3s ease-out', style({ transform: 'translate3d(-100%, 0, 0)', visibility: 'hidden' })), // final
    ]),
  ]),
];
