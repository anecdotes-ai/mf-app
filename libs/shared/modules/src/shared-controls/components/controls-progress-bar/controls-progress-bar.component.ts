import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { CalculatedControl } from 'core/modules/data/models';
import { ControlStatusEnum } from 'core/modules/data/models/domain';
import { StatusBarDefinition } from 'core/modules/utils/types';
import { createSortCallback, groupBy } from 'core/utils';

export interface ControlsStatusBarSection {
  cssClass: string;
  controlsAmount: number;
  width: string;
}

export interface ControlsProgressBarDefinition {
  [key: string]: { count: number; cssClass: string };
}

const OrderedStatusAndClassMapping = {
  [ControlStatusEnum.NOTSTARTED]: 'bg-navy-60',
  [ControlStatusEnum.INPROGRESS]: 'bg-orange-50',
  [ControlStatusEnum.READY_FOR_AUDIT]: 'bg-blue-50',
  [ControlStatusEnum.GAP]: 'bg-pink-70',
  [ControlStatusEnum.ISSUE]: 'bg-orange-70',
  [ControlStatusEnum.APPROVED_BY_AUDITOR]: 'bg-blue-70',
  [ControlStatusEnum.MONITORING]: 'bg-navy-80'
};
const statusOrderingDictionary = Object.keys(OrderedStatusAndClassMapping).reduce(
  (dict, key, index) => ({ ...dict, [key]: index }),
  {}
);

@Component({
  selector: 'app-controls-progress-bar',
  templateUrl: './controls-progress-bar.component.html',
  styleUrls: ['./controls-progress-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlsProgressBarComponent {
  @HostBinding('class')
  private classes = "block";

  @Input()
  set controls(val: CalculatedControl[]) {
    this.statusBarDefinition = this.createStatusBarDefinition(val);
  }

  statusBarDefinition: StatusBarDefinition[];

  private createStatusBarDefinition(controls: CalculatedControl[]): StatusBarDefinition[] {
    if (controls?.length) {
      return groupBy(controls, (c) => c.control_status.status)
        .sort(createSortCallback((group) => statusOrderingDictionary[group.key]))
        .map(
          (group) =>
            ({
              cssClass: OrderedStatusAndClassMapping[group.key],
              count: group.values.length,
            } as StatusBarDefinition)
        );
    }

    return [];
  }
}
