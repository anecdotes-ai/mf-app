import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';

export function weakPasswordValidator(control: AbstractControl): ValidationErrors {
  const specialCharsRegex = /[$-/:-?{-~!"^_@`\[\]]/g;

  if (
    control.value?.length < 6 ||
    Validators.pattern(/[a-z]+/)(control) ||
    Validators.pattern(/[A-Z]+/)(control) ||
    Validators.pattern(/[0-9]+/)(control) ||
    Validators.pattern(specialCharsRegex)(control)
  ) {
    return { weakPassword: true };
  }

  return null;
}
