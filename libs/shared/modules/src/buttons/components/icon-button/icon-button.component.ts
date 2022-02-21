import { Component, HostBinding, Input } from '@angular/core';
import { ButtonType, ButtonSize, ButtonVerticalSize } from '../../types';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
})
export class IconButtonComponent {
  @Input()
  svgIconPath: string;

  @HostBinding('attr.type')
  @Input()
  type: ButtonType = 'primary';

  @HostBinding('class.disabled')
  @Input()
  disabled: boolean;

  @Input()
  size: ButtonSize = 'small';

  @Input()
  verticalSize: ButtonVerticalSize = 'medium';

  @HostBinding('class')
  private get classes(): string {
    return `btn ${this.size} vs-${this.verticalSize}`;
  }

  @HostBinding('attr.role')
  private role = 'button';
}
