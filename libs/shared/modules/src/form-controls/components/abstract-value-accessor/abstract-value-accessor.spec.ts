import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { Component, DebugElement, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { AbstractValueAccessor } from './abstract-value-accessor';

class NgControlMock extends NgControl {
  viewToModelUpdate = jasmine.createSpy('viewToModelUpdate');
  control = new FormControl();
}

@Component({
  selector: 'app-host',
  template: `
    <app-abstract-value-accessor
      [errorTexts]="errorTexts"
      [required]="required"
      [index]="index"
      [validateOnDirty]="validateOnDirty"
      [isDisabled]="isDisabled"
    ></app-abstract-value-accessor>
  `,
})
class HostComponent {
  errorTexts: { [key: string]: string | (() => string) | TemplateRef<any> };
  required: boolean;
  index: number;
  validateOnDirty: boolean;
  isDisabled: boolean;
}

describe('AbstractValueAccessor', () => {
  configureTestSuite();
  let hostComponent: HostComponent;
  let componentUnderTest: AbstractValueAccessor;
  let fixture: ComponentFixture<HostComponent>;

  let ngControlMock: NgControl;

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [TranslateModule.forRoot(), ReactiveFormsModule, FormsModule],
        declarations: [HostComponent, AbstractValueAccessor, AbstractValueAccessor],
        providers: [{ provide: NgControl, useClass: NgControlMock }],
      }).compileComponents();
    })
  );

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
  }
  
  function getAbstractValueAccessorNativeElement(): HTMLElement {
    return getAbstractValueAccessorDebugElement().nativeElement;
  }

  function getAbstractValueAccessorDebugElement(): DebugElement {
    return fixture.debugElement.query(By.directive(AbstractValueAccessor));
  }

  beforeEach(async () => {
    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    componentUnderTest = fixture.debugElement.query(By.directive(AbstractValueAccessor)).componentInstance;
    ngControlMock = TestBed.inject(NgControl);
    await detectChanges();
  });

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  describe('dirty property', () => {
    it('should return false and remove "dirty" class if text-area component is not in "dirty" state', async () => {
      // Arrange
      ngControlMock.control.markAsPristine();

      // Act
      fixture.detectChanges(true);
      await fixture.whenStable();

      // Assert
      expect(componentUnderTest.dirty).toBeFalsy();
      expect(getAbstractValueAccessorNativeElement().classList.contains('dirty')).toBeFalsy();
    });

    it('should return true and set "dirty" class if text-area is on dirty state', async () => {
      // Arrange
      ngControlMock.control.markAsDirty();

      // Act
      await detectChanges();

      // Assert
      expect(componentUnderTest.dirty).toBeTruthy();
      expect(getAbstractValueAccessorNativeElement().classList.contains('dirty')).toBeTrue();
    });
  });

  describe('errorsDisplayed property', () => {
    [
      { dirty: true, validateOnDirty: false, invalid: true, expected: true },
      { dirty: true, validateOnDirty: true, invalid: true, expected: true },
      { dirty: false, validateOnDirty: true, invalid: true, expected: false },
      { dirty: false, validateOnDirty: true, invalid: false, expected: false },
      { dirty: true, validateOnDirty: true, invalid: false, expected: false },
      { dirty: true, validateOnDirty: false, invalid: false, expected: false },
      { dirty: false, validateOnDirty: true, invalid: false, expected: false },
    ].forEach((testCase) => {
      describe(`dirty is ${testCase.dirty}, validateOnDirty is ${testCase.validateOnDirty} and invalid is ${testCase.invalid}`, () => {
        it(`should return ${testCase.expected}`, async () => {
          // Arrange
          componentUnderTest.validateOnDirty = testCase.validateOnDirty;

          if (testCase.dirty) {
            ngControlMock.control.markAsDirty();
          } else {
            ngControlMock.control.markAsPristine();
          }

          if (testCase.invalid) {
            ngControlMock.control.setErrors({ fakeError: true });
          } else {
            ngControlMock.control.setErrors(null);
          }

          // Act
          await detectChanges();

          // Assert
          expect(!!componentUnderTest.errorsDisplayed).toBe(testCase.expected);
        });
      });
    });
  });

  describe('invalid property', () => {
    it('should return false and remove "invalid" class if control is valid', async () => {
      // Arrange
      ngControlMock.control.setErrors(null);

      // Act
      await detectChanges();

      // Assert
      expect(componentUnderTest.invalid).toBeFalsy();
      expect(getAbstractValueAccessorNativeElement().classList.contains('invalid')).toBeFalsy();
    });

    it('should return true and set "invalid" class if control is invalid', async () => {
      // Arrange
      ngControlMock.control.setErrors({ fakeError: true });

      // Act
      await detectChanges();

      // Assert
      expect(componentUnderTest.invalid).toBeTruthy();
      expect(getAbstractValueAccessorNativeElement().classList.contains('invalid')).toBeTruthy();
    });
  });

  describe('value property', () => {
    it('should remove "has-value" class if congrol.value is not specified', async () => {
      // Arrange
      componentUnderTest.value = undefined;

      // Act
      await detectChanges();

      // Assert
      expect(getAbstractValueAccessorNativeElement().classList.contains('has-value')).toBeFalsy();
    });

    it('should set "has-value" class if congrol.value is specified', async () => {
      // Arrange
      componentUnderTest.value = 'fake-value';

      // Act
      await detectChanges();

      // Assert
      expect(getAbstractValueAccessorNativeElement().classList.contains('has-value')).toBeTrue();
    });
  });
});
