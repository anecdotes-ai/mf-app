import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { CalculatedPolicy, ResourceStatusEnum } from 'core/modules/data/models';

@Component({
  selector: 'app-policy-status',
  templateUrl: './policy-status.component.html',
  styleUrls: ['./policy-status.component.scss'],
})
export class PolicyStatusComponent {
  @Input()
  policy: CalculatedPolicy;

  @Output()
  clicked = new EventEmitter<any>();

  @ViewChild('approvedTooltip')
  approvedTooltip: TemplateRef<any>;

  @ViewChild('onHoldTooltip')
  onHoldTooltip: TemplateRef<any>;

  @ViewChild('notStartedTooltip')
  notStartedTooltip: TemplateRef<any>;

  get statusTooltip(): TemplateRef<any> | string {
    switch (this.policy.status) {
      case ResourceStatusEnum.ON_HOLD:
        return this.onHoldTooltip;
      case ResourceStatusEnum.NOTSTARTED:
        return this.notStartedTooltip;
      default:
        return '';
    }
  }

  buildTranslationKey(relativeKey: string): string {
    return `policyManager.policy.statusTooltips.${relativeKey}`;
  }

  onBadgeClick(): void
  {
    if(this.policy.status === ResourceStatusEnum.APPROVED || this.policy.status === ResourceStatusEnum.PENDING)
    {
      return;
    }

    this.clicked.emit();
  }
}
