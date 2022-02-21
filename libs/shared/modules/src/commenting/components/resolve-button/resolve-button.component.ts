import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-resolve-button',
  templateUrl: './resolve-button.component.html',
})
export class ResolveButtonComponent {
  @HostBinding('class')
  private classes = 'inline-block w-10 h-10 rounded-md bg-transparent hover:bg-blue-70';

  @HostBinding('attr.role')
  private role = 'button';
}
