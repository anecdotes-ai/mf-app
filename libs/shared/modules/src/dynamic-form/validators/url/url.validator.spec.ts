import { FormControl } from '@angular/forms';
import { CustomValidators } from '../index';

describe('Custom url validator',()=>{

  it('should return null when control values passes validator', () => {
    // Arranage
    const control = new FormControl('https://github.com/svix/monorepo-private/pulls?q=is%3Apr+is%3Aclosed');

    // Act
    const validationResult = CustomValidators.url(control);

    // Assert
    expect(validationResult).toBeNull();
  });

  ['http://test.tst/query?type=test_case&sortBy=test-name&dir=ASC&user-type=admin@test&~someParam[^]',
    'test.tst/user/query?type=test^case&sortBy=test-name&dir=ASC&user-type=admin@test&~^someParam',
    'test.tst/_-^=&.?:;#@~!$'].forEach((url) => {
    it('should return object with property url set in true when control does not meet requirements', () => {
      // Arrenage
      const control = new FormControl(url);

      // Act
      const validationResult = CustomValidators.url(control);

      // Assert
      expect(validationResult.url).toBeTrue();
    });
  });
});
