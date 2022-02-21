import { FormControl } from '@angular/forms';
import { CustomValidators } from '../index';

describe('WeakPasswordValidator', () => {
  it('should return null when control passes validator', () => {
    // Arranage
    const control = new FormControl('Screen789!');

    // Act
    const validationResult = CustomValidators.weakPasswordValidator(control);

    // Assert
    expect(validationResult).toBeNull();
  });

  ['1', 'a', 'password', 'qweqr121', 'e4cbrAg21', '123agsg!'].forEach((password) => {
    it('should return object with property "weakPassword" set in true when control does not meet requirements', () => {
      // Arrenage
      const control = new FormControl(password);

      // Act
      const validationResult = CustomValidators.weakPasswordValidator(control);

      // Assert
      expect(validationResult.weakPassword).toBeTrue();
    });
  });
});
