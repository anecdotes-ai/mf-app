import { FormControl } from '@angular/forms';
import { CustomValidators } from '../index';

describe('CustomEmailValidator', () => {
  it('should return null when control passes validator', () => {
    // Arranage
    const control = new FormControl('test@test.com');

    // Act
    const validationResult = CustomValidators.emailCustomValidator(control);

    // Assert
    expect(validationResult).toBeNull();
  });


  ['a@bc.com','test@test.com', 'a.aA@b.co'].forEach((email) => {
    it(`should return null when control passes validator with value ${email}`, () => {
      // Arranage
    const control = new FormControl(email);

    // Act
    const validationResult = CustomValidators.emailCustomValidator(control);

    // Assert
    expect(validationResult).toBeNull();
    });
  });

  ['a@bc','abcdefg', 'A!@b.com', 'a@b!.com', 'a.a@b.co!'].forEach((email) => {
    it(`should return object with property "email" set in true when control does not meet requirements with value ${email}`, () => {
      // Arrenage
      const control = new FormControl(email);

      // Act
      const validationResult = CustomValidators.emailCustomValidator(control);

      // Assert
      expect(validationResult.email).toBeTrue();
    });
  });
});
