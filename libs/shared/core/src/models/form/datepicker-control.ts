import { AbstractDynamicControl, ControlConfiguration } from 'core/modules/dynamic-form';
import { DatePickerComponent } from 'core/modules/form-controls';

export class DatepickerControl extends AbstractDynamicControl<DatePickerComponent, any, any, boolean> {
  constructor(config: ControlConfiguration<any, any, boolean>) {
    super(config, DatePickerComponent);
  }
}
