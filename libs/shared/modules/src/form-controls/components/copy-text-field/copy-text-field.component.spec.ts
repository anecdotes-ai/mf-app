import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { TextFieldComponent } from '../text-field/text-field.component';
import { CopyTextFieldComponent } from './copy-text-field.component';

describe('CopyTextFieldComponent', () => {
  let component: CopyTextFieldComponent;
  let fixture: ComponentFixture<CopyTextFieldComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CopyTextFieldComponent, TextFieldComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyTextFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#copyText', () => {
    it(`should copy textField text to clipboard`, async () => {
      // Arrange
      let copyText = 'some-value-to-copy';
      component.valueToPass = copyText;
      navigator.clipboard.writeText = jasmine.createSpy('writeText');

      // Act
      fixture.detectChanges();
      await fixture.whenStable();
      component.copyText();

      // Assert
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(copyText);
    });

    it(`should call copy method when copy button pressed`, async () => {
      // Arrange
      spyOn(component, 'copyText');

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      fixture.debugElement
        .query(By.directive(TextFieldComponent))
        .query(By.css('.copy-button'))
        .triggerEventHandler('click', null);

      // Assert
      expect(component.copyText).toHaveBeenCalled();
    });
  });

  describe('#buildTranslationKey', () => {
    it('should return translationKey based on relativeKey', () => {
      // Arrange
      const relativeKey = 'someRelativeKey';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toBe(`core.formControls.copyTextField.${relativeKey}`);
    });
  });
});
