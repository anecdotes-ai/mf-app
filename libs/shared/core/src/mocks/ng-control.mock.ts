import { AbstractControl, FormControl, NgControl } from '@angular/forms';

export class NgControlMock extends NgControl {
  viewToModelUpdate = jasmine.createSpy('viewToModelUpdate');
  control = new FormControl();
}
