import { Component, HostBinding, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-colored-dropdown-menu-button',
  templateUrl: './colored-dropdown-menu-button.component.html',
  styleUrls: ['./colored-dropdown-menu-button.component.scss'],
})
export class ColoredDropdownMenuButtonComponent {
  @Input()
  radius: 'small' | 'large';

  @Input()
  buttonIcon: string;

  @HostBinding('class.pointer-events-none')
  @Input()
  isReadOnly = false;

  @Input()
  buttonBackgroundClass: string;

  @Input()
  tooltip: string | TemplateRef<any>;

  @Input()
  verticalSize: 'small' | 'medium';

  @Input()
  horizontalSize: 'small' | 'medium' = 'medium';

  @Input()
  tooltipPlacement = 'top';

  @Input()
  keepTooltipOnOver = false;
  
  @Input()
  arrowEnabled: boolean;

  @HostBinding('class.active')
  @Input()
  isOpen: boolean;
}
