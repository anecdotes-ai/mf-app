import { AbstractControl, ValidatorFn } from '@angular/forms';

export function dateRangeValidator(startDateControlName: string, endDateControlName: string): ValidatorFn {
    return (control: AbstractControl) => {
        const startDate = control.get(startDateControlName);
        const endDate = control.get(endDateControlName);
    
        if ((startDate.value && endDate.value && startDate.value <= endDate.value) ||
            (!startDate.value && !endDate.value)) {
            return null;
        }
    
        return { audit_range: true };
    };
}
