import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RegularDateFormatMMMdyyyy } from 'core/constants/date';

const millisecondsInDay = 86400000;
const limitDaysInMonthToSupport = 30;

@Component({
  selector: 'app-time-ago-date-view',
  templateUrl: './time-ago-date-view.component.html',
  styleUrls: ['./time-ago-date-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeAgoDateViewComponent {
  dateFormat = RegularDateFormatMMMdyyyy;

  @Input()
  descriptionTranslationKey: string;

  @Input()
  date: string | Date;

  amount: number;

  resolveDisplayedDateMessage(): string {
    const difference = Math.floor(this.getDifferenceBetweenDates());
    if (difference < 1) {
      return this.buildTranslationKey('today');
    }
    if (difference >= 1 && difference < limitDaysInMonthToSupport) {
      this.amount = difference;
      return this.buildTranslationKey('day');
    }
    if (difference >= limitDaysInMonthToSupport) {
      this.amount = Math.floor(difference / limitDaysInMonthToSupport);
      return this.buildTranslationKey('month');
    }
  }

  buildTranslationKey(relativeKey: string): string {
    return `evidences.evidenceCollectionDate.${relativeKey}`;
  }

  private getDifferenceBetweenDates(): number {
    return (new Date().getTime() - this.getDate().getTime()) / millisecondsInDay;
  }

  private getDate(): Date {
    if (typeof this.date === 'string') {
      return new Date(this.date);
    }
    return this.date;
  }
}
