import { AbstractControl, ValidationErrors } from '@angular/forms';

export function matchingValidator(controlToMatchPath: string): (control: AbstractControl) => ValidationErrors {
    return (currentControl) => {
        const controlToMatch = currentControl.root.get(controlToMatchPath);

        if (!controlToMatch || currentControl.value === controlToMatch.value) {
            return null;
        }

        return { match: true };
    };
}
