import { FormControl } from '@angular/forms';
import { CustomValidators } from '../index';

describe('CustomJsonValidator', () => {
  it('should return error when control validator fails', async () => {
    // Arranage
    const control = new FormControl();
    const file: File = {} as any;
    file.text = jasmine.createSpy('text').and.returnValue("blalala");
    control.setValue(file);

    // Act
    let res = await CustomValidators.jsonValidator(control);

    // Assert
    expect(res).not.toBeNull();
  });

  it('should return null when control validator success', async () => {
    // Arranage
    const control = new FormControl();
    const file: File = {} as any;
    file.text = jasmine.createSpy('text').and.returnValue("{\"bla\": \"blala\"}");
    control.setValue(file);

    // Act
    let res = await CustomValidators.jsonValidator(control);

    // Assert
    expect(res).toBeNull();
  });
});
