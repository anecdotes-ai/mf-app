import { FormControl, FormGroup } from '@angular/forms';
import { CustomValidators } from '../index';

const START_KEY = 'start';
const END_KEY = 'end';

describe('dateValidator', () => {
    it('should return null when control passes validator', () => {
        // Arranage
        const child1 = new FormControl(new Date("2021-12-01T22:00:00.000Z"));
        const child2 = new FormControl(new Date("2021-12-02T22:00:00.000Z"));

        const control = new FormGroup({
            [START_KEY]: child1,
            [END_KEY]: child2
        }
        );

        // Act
        const validationResult = CustomValidators.dateRangeValidator(START_KEY, END_KEY)(control);

        // Assert
        expect(validationResult).toBeNull();
    });

    it('should return null when both control childs values are not defined', () => {
        // Arranage
        const child1 = new FormControl();
        const child2 = new FormControl();

        const control = new FormGroup({
            [START_KEY]: child1,
            [END_KEY]: child2
        }
        );

        // Act
        const validationResult = CustomValidators.dateRangeValidator(START_KEY, END_KEY)(control);

        // Assert
        expect(validationResult).toBeNull();
    });

    it('should return object with property audit_range set in true when control does not meet requirements', () => {
        // Arranage
        const child1 = new FormControl(new Date("2021-12-10T22:00:00.000Z"));
        const child2 = new FormControl(new Date("2021-12-02T22:00:00.000Z"));

        const control = new FormGroup({
            [START_KEY]: child1,
            [END_KEY]: child2
        }
        );

        // Act
        const validationResult = CustomValidators.dateRangeValidator(START_KEY, END_KEY)(control);

        // Assert
        expect(validationResult.audit_range).toBeTrue();
    });

    it('should return object with property audit_range set in true when one of the control childs value is not defined', () => {
        // Arranage
        const child1 = new FormControl(new Date());
        const child2 = new FormControl(new Date("2021-12-02T22:00:00.000Z"));

        const control = new FormGroup({
            [START_KEY]: child1,
            [END_KEY]: child2
        }
        );

        // Act
        const validationResult = CustomValidators.dateRangeValidator(START_KEY, END_KEY)(control);

        // Assert
        expect(validationResult.audit_range).toBeTrue();
    });
});
