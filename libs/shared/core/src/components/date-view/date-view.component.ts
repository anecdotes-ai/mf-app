import { RegularDateFormat } from './../../constants/date';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-date-view',
  templateUrl: './date-view.component.html',
  styleUrls: ['./date-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateViewComponent {
  @Input()
  dateFormat = RegularDateFormat;

  @Input()
  date: string | Date;

  @Input()
  descriptionTranslationKey: string;
  
  @Input()
  icon: string;
}
