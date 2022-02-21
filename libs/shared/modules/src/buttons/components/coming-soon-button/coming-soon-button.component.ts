import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { ButtonType, ButtonSize, ButtonVerticalSize } from '../../types';

@Component({
  selector: 'app-coming-soon-button',
  templateUrl: './coming-soon-button.component.html',
  styleUrls: ['./coming-soon-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// It defines all common behaviors/styles in the app so that we won't smear
// behaviors / styles in each component that requires the use of buttons.
export class ComingSoonButtonComponent {
  @Input()
  svgIconPath: string;

  @HostBinding('attr.type')
  @Input()
  type: ButtonType = 'primary';

  @HostBinding('class.disabled')
  @Input()
  disabled: boolean;

  @Input()
  size: ButtonSize = 'medium';

  @Input()
  verticalSize: ButtonVerticalSize = 'medium';

  @Input()
  labelTranslationKey = 'core.comingSoon';

  @HostBinding('class')
  private get classes(): string {
    return `btn ${this.size} vs-${this.verticalSize}`;
  }

  @HostBinding('attr.role')
  private role = 'button';
}
