import { statusesKeys } from './../../models/control-status.constants';
import { RegularDateFormat } from 'core/constants/date';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ControlStatus, ControlStatusEnum } from 'core/modules/data/models/domain';

@Component({
  selector: 'app-control-status-tooltip',
  templateUrl: './control-status-tooltip.component.html',
  styleUrls: ['./control-status-tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlStatusTooltipComponent {
  readonly controlStatusesEnum = ControlStatusEnum;
  readonly tooltipDateFormat = RegularDateFormat;
  readonly statusesKeysConst = statusesKeys;

  @Input()
  controlStatus: ControlStatus;

  @Input()
  controlLastEditTime?: string;

  get date(): string {
    const strDate = this.controlStatus?.last_edit_time || this.controlLastEditTime;
    return strDate ? new Date(strDate).toISOString() : '';
  }

  buildTranslationKey(relativeKey: string): string {
    return `statusMenuTooltip.${relativeKey}`;
  }
}
