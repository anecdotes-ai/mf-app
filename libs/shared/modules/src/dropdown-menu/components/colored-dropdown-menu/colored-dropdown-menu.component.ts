import { ChangeDetectorRef, Component, Input, TemplateRef } from '@angular/core';
import { DropdownBaseComponent } from '../dropdown-base/dropdown-base.component';

@Component({
  selector: 'app-colored-dropdown-menu',
  templateUrl: './colored-dropdown-menu.component.html',
  styleUrls: ['./colored-dropdown-menu.component.scss'],
})
export class ColoredDropdownMenuComponent extends DropdownBaseComponent {
  @Input()
  buttonBackgroundClass: string;

  @Input()
  buttonText: string;

  @Input()
  tooltip: string | TemplateRef<any>;

  @Input()
  tooltipPlacement = 'top';

  @Input()
  radius: 'small' | 'large' = 'small';

  @Input()
  verticalSize: 'small' | 'medium' = 'medium';

  @Input()
  buttonIcon: string;

  @Input()
  isReadOnly = false;

  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }
}
