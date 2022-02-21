import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-timeframe-view',
  templateUrl: './timeframe-view.component.html',
  styleUrls: ['./timeframe-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeframeViewComponent {
  @Input()
  timeFrameString: string;

  @Input()
  timeFrameDateFormat = 'MMM d, yy';

  @Input()
  fromTranslationKey: string;

  @Input()
  toTranslationKey: string;

  getTimeFrameObject(): { from: string; to: string } {
    try {
      const splittedString = this.timeFrameString.split(' - ');

      return { from: splittedString[0], to: splittedString[1] };
    } catch {
      return { from: null, to: null };
    }
  }
}
