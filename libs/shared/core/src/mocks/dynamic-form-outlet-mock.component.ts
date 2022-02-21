import { Component, Input } from '@angular/core';
import { DynamicFormGroup } from 'core/modules/dynamic-form';

@Component({
  selector: 'app-dynamic-form-outlet',
  template: '',
})
export class DynamicFormOutletMockComponent {
  @Input()
  dynamicFormGroup: DynamicFormGroup<any>;
}
