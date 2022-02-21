import { Directive } from '@angular/core';
import { ControlContextService } from '../../services';

@Directive({
  selector: '[sharedContextAccessor]',
  exportAs: 'sharedContextAccessor',
})
export class SharedContextAccessorDirective {
  constructor(public context: ControlContextService) {}
}
