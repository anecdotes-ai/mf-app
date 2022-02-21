import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-dropdown-button',
  templateUrl: './dropdown-button.component.html',
  styleUrls: ['./dropdown-button.component.scss'],
})
export class DropdownButtonComponent {
  @HostBinding('class')
  private hostClasses =
    'flex flex-row justify-between items-center cursor-pointer relative w-full border-navy-40 hover:border-navy-90 bg-white font-main text-base';

  @Input()
  value: string;

  @Input()
  placeholder: string;

  @HostBinding('class.open')
  @HostBinding('class.border-navy-90')
  @Input()
  isOpen: boolean;

  @HostBinding('class.pointer-events-none')
  @Input()
  disabled: boolean;
}
