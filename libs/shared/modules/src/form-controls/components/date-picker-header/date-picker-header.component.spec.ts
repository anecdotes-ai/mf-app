import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerHeaderComponent } from './date-picker-header.component';
import { MatCalendar } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Subject } from 'rxjs';
import { CustomDateAdapter } from '../../date-picker-adapter';

describe('DatePickerHeaderComponent', () => {
  let component: DatePickerHeaderComponent<any>;
  let fixture: ComponentFixture<DatePickerHeaderComponent<any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatePickerHeaderComponent],
      providers: [
        { provide: MatCalendar, useValue: { stateChanges: new Subject<void>(), activeDate: new Date() } },
        { provide: DateAdapter, useClass: CustomDateAdapter },
        {
          provide: MAT_DATE_FORMATS, useValue: {
            display: {
              dateInput: { year: 'numeric', month: 'short', day: 'numeric' },
              monthYearLabel: { year: 'numeric', month: 'long' },
              dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
              monthYearA11yLabel: { year: 'numeric', month: 'long' },
            },
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatePickerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
