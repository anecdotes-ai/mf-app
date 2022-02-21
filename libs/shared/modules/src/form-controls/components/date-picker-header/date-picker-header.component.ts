import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DateAdapter, MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import { SubscriptionDetacher } from 'core/utils';

@Component({
  selector: 'app-date-picker-header',
  templateUrl: './date-picker-header.component.html',
  styleUrls: ['./date-picker-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerHeaderComponent<D> implements OnDestroy, OnInit {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  get periodLabel(): string {
    return this._dateAdapter
      .format(this._calendar.activeDate, this._dateFormats.display.monthYearA11yLabel);
  }

  constructor(
    private _calendar: MatCalendar<D>, private _dateAdapter: DateAdapter<D>,
    @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this._calendar.stateChanges
      .pipe(this.detacher.takeUntilDetach())
      .subscribe(() => this.cdr.markForCheck());
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  previousClicked(): void {
    this._calendar.activeDate = this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1);
  }

  nextClicked(): void {
    this._calendar.activeDate = this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1);
  }
}
