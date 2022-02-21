import { FormControl } from '@angular/forms';
import { CustomValidators } from '../index';

const STR_TO_BE_MATCHED = 'string';

describe('exactMatchValidator', () => {
    it('should return null when control passes validator', () => {
        // Arranage
        const control = new FormControl("string");

        // Act
        const validationResult = CustomValidators.exactMatchValidator(STR_TO_BE_MATCHED)(control);

        // Assert
        expect(validationResult).toBeNull();
    });

    it('should return object with control name set in true when control does not meet requirements', () => {
        // Arranage
        const control = new FormControl("differnet_string");

        // Act
        const validationResult = CustomValidators.exactMatchValidator(STR_TO_BE_MATCHED)(control);

        // Assert
        expect(validationResult.exact_match).toBeTrue();
    });
});
