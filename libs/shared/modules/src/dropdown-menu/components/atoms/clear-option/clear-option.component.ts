import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-clear-option',
  templateUrl: './clear-option.component.html',
})
export class ClearOptionComponent {
  @Input()
  text: string;
}
