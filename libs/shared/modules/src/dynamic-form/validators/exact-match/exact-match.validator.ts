import { AbstractControl, ValidatorFn } from '@angular/forms';

export function exactMatchValidator(stringToBeMatched: string): ValidatorFn {
    return (control: AbstractControl) => {

        if (control.value === stringToBeMatched) {
            return null;
        }
    
        return { exact_match: true };
    };
}
