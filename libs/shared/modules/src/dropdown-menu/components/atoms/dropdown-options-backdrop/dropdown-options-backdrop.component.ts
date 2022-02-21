import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-dropdown-options-backdrop',
  templateUrl: './dropdown-options-backdrop.component.html',
  styleUrls: ['./dropdown-options-backdrop.component.scss']
})
export class DropdownOptionsBackdropComponent {
  @HostBinding('class')
  private classes = 'bg-white';
}
