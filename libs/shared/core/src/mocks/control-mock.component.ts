import { Component } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-control-mock',
  template: '',
})
export class ControlMockComponent implements ControlValueAccessor {
  value: any;

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {}

  registerOnTouched(fn: any): void {}

  setDisabledState?(isDisabled: boolean): void {}
}
