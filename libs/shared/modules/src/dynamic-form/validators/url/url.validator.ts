import { AbstractControl, Validators, ValidationErrors } from '@angular/forms';

const regexp = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=%.]+$/;

export function url(control: AbstractControl): ValidationErrors {
  const patternErr = Validators.pattern(regexp)(control);
  return patternErr ? { url: true } : null;
}
