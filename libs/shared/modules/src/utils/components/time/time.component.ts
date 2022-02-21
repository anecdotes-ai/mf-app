import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';
import { RegularDateFormat } from 'core/constants';
import { interval, Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TimeAgoViewModel, TimeHandler } from './time-handler.service';

const defaultUpdateInterval = 5000; // every 5 seconds

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
  providers: [TimeHandler],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeComponent implements OnInit {
  @Input()
  date: string | Date;

  @Input()
  dateFormat = RegularDateFormat;

  @Input()
  updateInterval = defaultUpdateInterval;

  timeAgo$: Observable<TimeAgoViewModel>;

  constructor(private timeHandler: TimeHandler) { }

  ngOnInit(): void {
    const timeAgo = this.getTimeAgoText();
    switch (timeAgo.timeKind) {
      case 'second':
      case 'minute':
      case 'hour': {
        this.timeAgo$ = interval(this.updateInterval).pipe(map(() => this.getTimeAgoText()), startWith(timeAgo));
        break;
      }
      default: {
        this.timeAgo$ = of(timeAgo);
      }
    }
  }

  buildTranslationKey(relativeKey: string): string {
    return `time.${relativeKey}`;
  }

  private getTimeAgoText(): TimeAgoViewModel {
    return this.timeHandler.getTimeAgo(this.getTodayDate(), this.getDate());
  }

  private getTodayDate(): Date {
    return new Date();
  }

  private getDate(): Date {
    if (typeof this.date === 'string') {
      return new Date(this.date);
    }

    return this.date;
  }
}
