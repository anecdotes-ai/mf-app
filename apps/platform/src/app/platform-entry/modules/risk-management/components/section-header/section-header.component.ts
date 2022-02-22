import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { ButtonType } from 'core/modules/buttons/types';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeader {
  @Input()
  tooltipText: string | TemplateRef<any>;

  @Input()
  headerText: string;

  @Input()
  buttonText: string;

  @Input()
  buttonIcon: string;

  @Input()
  buttonType: ButtonType = 'primary';

  @Output()
  buttonClicked = new EventEmitter();

  buildTranslationKey(relativeKey: string): string {
    return `riskManagement.mitigateControls.${relativeKey}`;
  }
}
