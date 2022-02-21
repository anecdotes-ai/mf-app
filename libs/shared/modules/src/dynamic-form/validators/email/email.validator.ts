import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';

export function emailCustomValidator(control: AbstractControl): ValidationErrors {
  const specialCharsRegex = /[a-zA-Z0-9._%+-]+(?:\.[a-zA-Z0-9._%+-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])$/g;

  if (
    control.value?.length < 6 ||
    Validators.pattern(specialCharsRegex)(control)
  ) {
    return { email: true };
  }
  return null;
}
