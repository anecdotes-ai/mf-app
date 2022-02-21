import { ControlValueAccessor, FormControl } from '@angular/forms';
import { isFunction } from 'util';

/**
 * Function that binds value accessor on state changes of form control
 * @param control A form control that value accessor will be subscribed on state changes of
 * @param valueAccessor Value accessor
 */
export function setupControl(control: FormControl, valueAccessor: ControlValueAccessor): void {
  if (typeof valueAccessor.registerOnChange === 'function') {
    valueAccessor.registerOnChange((v) => {
      control.setValue(v);
    });
  }

  if (typeof valueAccessor.setDisabledState === 'function') {
    control.registerOnDisabledChange((v) => {
      valueAccessor.setDisabledState(v);
    });
  }

  control.registerOnChange((v) => {
    valueAccessor.writeValue(v);
  });

  valueAccessor.writeValue(control.value);
  valueAccessor.setDisabledState(control.disabled);
}
