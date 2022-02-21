import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-chip',
  templateUrl: './chip.component.html',
})
export class ChipComponent {
  @HostBinding('class')
  private classes = 'inline-flex justify-center items-center px-3 py-0.5 rounded-full';
}
