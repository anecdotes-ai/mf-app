import { AbstractControl, ValidationErrors } from '@angular/forms';

export async function jsonValidator(control: AbstractControl): Promise<ValidationErrors | null> {
  let jsonValid = true;
  if (control.value) {
    let v = await control.value.text();
    try {
      JSON.parse(v);
    } catch (e) {
      jsonValid = false;
    }
  }
  return jsonValid ? null : { json: true };
}
