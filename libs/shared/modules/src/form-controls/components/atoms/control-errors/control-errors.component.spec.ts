/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';

import { ControlErrorsComponent } from './control-errors.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgControl } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';
import { toKeyValueArray } from 'core/utils';

@Component({
  selector: 'app-host',
  template: ` <app-control-errors [errorTexts]="errorTexts"></app-control-errors> `,
})
class HostComponent {
  errorTexts: any;
}

describe('ControlErrorsComponent', () => {
  configureTestSuite();

  let componentUnderTest: ControlErrorsComponent;
  let hostComponent: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let ngControl: NgControl;

  beforeAll(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [HostComponent, ControlErrorsComponent],
      providers: [{ provide: NgControl, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    componentUnderTest = fixture.debugElement.query(By.directive(ControlErrorsComponent)).componentInstance;
    ngControl = TestBed.inject(NgControl);
    Object.defineProperty(ngControl, 'control', {
      get: () => undefined,
      configurable: true,
    });
  });

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  describe('buildErrorText function', () => {
    it('should return null when errorTests property is not specified', () => {
      // Arrange
      componentUnderTest.errorTexts = undefined;

      // Act
      const actual = componentUnderTest.buildErrorTexts();

      // Assert
      expect(actual).toBe(null);
    });

    it('should return null when control is not specified', () => {
      // Arrange
      componentUnderTest.errorTexts = {};
      spyOnProperty(ngControl, 'control').and.returnValue(undefined);

      // Act
      const actual = componentUnderTest.buildErrorTexts();

      // Assert
      expect(actual).toBe(null);
    });

    it('should return null when errorTests property of control is not specified', () => {
      // Arrange
      componentUnderTest.errorTexts = {};
      spyOnProperty(ngControl, 'control').and.returnValue({ errorText: undefined });

      // Act
      const actual = componentUnderTest.buildErrorTexts();

      // Assert
      expect(actual).toBe(null);
    });

    it('should return joined value of errorText', () => {
      // Arrange
      const errorTexts = {
        required: 'This is required',
        email: 'This is email',
      };
      hostComponent.errorTexts = errorTexts;
      spyOnProperty(ngControl, 'control').and.returnValue({
        errors: {
          required: true,
          email: true,
        },
      });

      // Act
      fixture.detectChanges();
      const actual = componentUnderTest.buildErrorTexts();

      // Assert
      expect(actual).toEqual([errorTexts.required, errorTexts.email]);
    });
  });

  describe('rendering', () => {
    it('should render items based on value returned by buildErrorText', async () => {
      // Arrange
      const firstText = 'This is required';
      const secondText = 'This is email';
      spyOn(componentUnderTest, 'buildErrorTexts').and.returnValue([firstText, secondText]);
      spyOnProperty(ngControl, 'control').and.returnValue({});

      // Act
      fixture.detectChanges();

      const span = fixture.debugElement.query(By.css('span'))?.nativeElement as HTMLElement;

      // Assert
      expect(span).toBeTruthy();
      expect(span.innerText).toBe(`${firstText} ${secondText}`);
    });
  });

  describe('resolvedErrorTexts', () => {
    toKeyValueArray({
      required: 'formControlErrors.required',
      email: 'formControlErrors.wrongEmailFormat',
      emailNotFound: 'formControlErrors.emailNotFound',
      url: 'formControlErrors.url'
    }).forEach((testCase) => {
      describe('errorTexts input is not passed', () => {
        it(`should have "${testCase.value}" value under "${testCase.key}" key`, () => {
          // Arrange
          hostComponent.errorTexts = undefined;

          // Act
          fixture.detectChanges();

          // Assert
          expect(componentUnderTest.resolvedErrorTexts).toEqual(
            jasmine.objectContaining({
              [testCase.key]: testCase.value,
            })
          );
        });
      });

      describe(`${testCase.key} key is overriden by a value in errorTexts input`, () => {
        it('should contain overriden value under the key', () => {
          // Arrange
          const fakeOverridenValue = 'fake overriden value 123';

          hostComponent.errorTexts = {
            [testCase.key]: fakeOverridenValue,
          };

          // Act
          fixture.detectChanges();

          // Assert
          expect(componentUnderTest.errorTexts).toEqual(
            jasmine.objectContaining({
              [testCase.key]: fakeOverridenValue,
            })
          );
        });
      });
    });
  });
});
