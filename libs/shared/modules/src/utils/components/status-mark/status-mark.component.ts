import { Component, Input } from '@angular/core';

enum StatusEnum {
  NOTSTARTED = 'NOT_STARTED',
  INPROGRESS = 'IN_PROGRESS',
  COMPLIANT = 'COMPLIANT'
}

const statusMappingConst = {
  [StatusEnum.NOTSTARTED]: {
    icon: 'status_not_started',
    class: 'text-pink-50',
    translationKey: 'notStarted',
  },
  [StatusEnum.INPROGRESS]: {
    icon: 'status_in_progress',
    class: 'text-orange-50',
    translationKey: 'inProgress',
  },
  [StatusEnum.COMPLIANT]: {
    icon: 'status_complete',
    class: 'text-blue-50',
    translationKey: 'compliant',
  },
};

@Component({
  selector: 'app-status-mark',
  templateUrl: './status-mark.component.html',
  styleUrls: ['./status-mark.component.scss']
})
export class StatusMarkComponent {
  @Input()
  status: StatusEnum | string;

  statusMapping = statusMappingConst;

  buildTranslationKey(relativeKey: string): string {
    return `components.statusBadge.${relativeKey}`;
  }
}
