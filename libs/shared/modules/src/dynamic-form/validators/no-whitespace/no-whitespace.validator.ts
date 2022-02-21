import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noWhiteSpace(control: AbstractControl): ValidationErrors {
    return control.value?.trim() ? null : { required: true };
}
