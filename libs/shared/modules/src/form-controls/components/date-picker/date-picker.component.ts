import { ComponentType } from '@angular/cdk/portal';
import { Component, EventEmitter, HostBinding, Injector, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MenuAction } from 'core/modules/dropdown-menu';
import { AbstractValueAccessor, MakeProvider } from 'core/modules/form-controls/components/abstract-value-accessor';
import { CustomDateAdapter } from '../../date-picker-adapter';
import { DatePickerHeaderComponent } from '../date-picker-header/date-picker-header.component';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [MakeProvider(DatePickerComponent),
  {
    provide: MAT_DATE_FORMATS, useValue: {
      display: {
        dateInput: { year: 'numeric', month: 'short', day: 'numeric' },
        monthYearLabel: { year: 'numeric', month: 'long' },
        dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
        monthYearA11yLabel: { year: 'numeric', month: 'long' },
      },
    }
  },
  { provide: DateAdapter, useClass: CustomDateAdapter }
  ]
})
export class DatePickerComponent extends AbstractValueAccessor implements OnInit {
  required: boolean;
  index: number;
  validateOnDirty: boolean;
  selectedItem: MenuAction;
  datePickerHeader: ComponentType<any>;

  @HostBinding('class.dirty')
  get dirty(): boolean {
    return this.formControl?.dirty;
  }

  @HostBinding('class.invalid')
  get invalid(): boolean {
    return this.formControl?.invalid;
  }

  @HostBinding('class.has-value')
  get hasValue(): boolean {
    return this.value;
  }

  @HostBinding('class.active')
  isActive: boolean;

  @Input()
  infoTooltip: string | TemplateRef<any>;

  @Input()
  label: string;

  @Input()
  labelParamsObj: any;

  @Input()
  svgIconPath: string;

  @Input()
  type: string;

  @Input()
  placeholder: string;

  @Input()
  minDate: Date;

  @Input()
  isCustomHeader = true;

  @Output()
  select = new EventEmitter<MenuAction>();

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.datePickerHeader = this.isCustomHeader ? DatePickerHeaderComponent : null; 
  }

  get panelClass(): string[] {
    const classes = ['app-datepicker'];
    if (!this.type || this.type === 'orange') {
      classes.push('orange');
    }
    return classes;
  }

  dateChange(event: MatDatepickerInputEvent<Date>): void {
    try {
      this.value = event.value.toISOString();
    } catch {
      this.formControl.setErrors({ invalidDate: true });
    }
  }
}
