import { ChangeDetectionStrategy, Component, HostBinding, HostListener, Input } from '@angular/core';
import { ExclusiveFeatureModalService } from '../../services';
import { ButtonType, ButtonSize, ButtonVerticalSize } from 'core/modules/buttons/types';
import { AccountFeatureEnum } from 'core/modules/data/models/domain';

@Component({
  selector: 'app-exclusive-feature-button',
  templateUrl: './exclusive-feature-button.component.html',
  styleUrls: ['./exclusive-feature-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// It defines all common behaviors/styles in the app so that we won't smear
// behaviors / styles in each component that requires the use of buttons.
export class ExclusiveFeatureButtonComponent {
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
  feature = AccountFeatureEnum.AdoptFramework;

  @HostBinding('class')
  private get classes(): string {
    return `btn ${this.size} vs-${this.verticalSize}`;
  }

  @HostBinding('attr.role')
  private role = 'button';

  constructor(private exclusiveFeatureModalService: ExclusiveFeatureModalService) {}

  @HostListener('click')
  private onClick(): void {
    this.exclusiveFeatureModalService.openExclusiveFeatureModal(this.feature);
  }
}
