import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-cross-button',
  templateUrl: './cross-button.component.html',
})
export class CrossButtonComponent {
  @HostBinding('attr.role')
  private role = 'button';

  @HostBinding('class')
  private classes = 'flex justify-center items-center rounded-md w-10 h-10 bg-transparent hover:bg-navy-30 vs-medium'
}
