import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ResourceStatusEnum } from '../../../data/models';
import { statusTranslateMapping } from 'core/modules/data/models/resource-status.enum';


const statusMappingConst = {
  [ResourceStatusEnum.NOTSTARTED]: {
    class: 'bg-pink-70',
    hoverableClass: 'hoverable-bg-pink',
    translationKey: statusTranslateMapping[ResourceStatusEnum.NOTSTARTED],
  },

  [ResourceStatusEnum.ON_HOLD]: {
    class: 'bg-navy-90',
    hoverableClass: 'hoverable-bg-navy',
    translationKey: statusTranslateMapping[ResourceStatusEnum.ON_HOLD],
  },

  [ResourceStatusEnum.PENDING]: {
    class: 'bg-orange-70',
    hoverableClass: 'hoverable-bg-orange',
    translationKey: statusTranslateMapping[ResourceStatusEnum.PENDING],
  },

  [ResourceStatusEnum.APPROVED]: {
    class: 'bg-blue-60',
    hoverableClass: 'hoverable-bg-blue',
    translationKey: statusTranslateMapping[ResourceStatusEnum.APPROVED],
  },
};

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss'], 
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusBadgeComponent {
  @Input()
  status: ResourceStatusEnum | string;

  @Input()
  hoverable: boolean;

  @Input()
  loading: boolean;

  statusMapping = statusMappingConst;

  resolveClass(resolvedStatus: { class: string; hoverableClass: string }): string {
    return this.hoverable ? resolvedStatus.hoverableClass : resolvedStatus.class;
  }

  buildTranslationKey(relativeKey: string): string {
    return `components.statusBadge.${relativeKey}`;
  }
}
