/* tslint:disable:no-unused-variable */
import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { StatusMarkComponent } from './status-mark.component';

/* tslint:disable:component-selector */
@Component({
  selector: 'svg-icon',
  template: ``,
})
export class SvgIconMockComponent {
  @Input()
  src: string;
}

describe('StatusMarkComponent', () => {
  configureTestSuite();

  let componentUnderTest: StatusMarkComponent;
  let fixture: ComponentFixture<StatusMarkComponent>;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [StatusMarkComponent, SvgIconMockComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusMarkComponent);
    componentUnderTest = fixture.componentInstance;
  });

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function getTextElement(): HTMLElement {
    return fixture.debugElement.query(By.css('span')).nativeElement;
  }

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  describe('buildTranslationKey', () => {
    it('should return built translation key', () => {
      // Arrange
      const fakeRelativeKey = 'fakerelativekey';

      // Act
      const actual = componentUnderTest.buildTranslationKey(fakeRelativeKey);

      // Assert
      expect(actual).toBe(`components.statusBadge.${fakeRelativeKey}`);
    });
  });

  [
    {
      status: 'NOT_STARTED',
      icon: 'status_not_started',
      class: 'text-pink-50',
      translationKey: 'notStarted',
    },
    {
      status: 'IN_PROGRESS',
      icon: 'status_in_progress',
      class: 'text-orange-50',
      translationKey: 'inProgress',
    },
    {
      status: 'COMPLIANT',
      icon: 'status_complete',
      class: 'text-blue-50',
      translationKey: 'compliant',
    },
  ].forEach((testCase) => {
    describe(`when status is ${testCase.status}`, () => {
      beforeEach(() => {
        componentUnderTest.status = testCase.status as any;
      });

      describe('svg-icon', () => {
        it(`should have ${testCase.icon} as src attribute`, async () => {
          // Arrange
          // Act
          await detectChanges();

          // Assert
          expect((fixture.debugElement.query(By.css('svg-icon')).componentInstance as SvgIconMockComponent).src).toBe(
            testCase.icon
          );
        });
      });

      describe('text', () => {
        it(`should be ${testCase.translationKey} capitalized`, async () => {
          // Arrange
          spyOn(componentUnderTest, 'buildTranslationKey').and.callFake((relativeKey) => relativeKey);

          // Act
          await detectChanges();

          // Assert
          expect(getTextElement().innerText).toBe(
            testCase.translationKey.charAt(0).toUpperCase() + testCase.translationKey.slice(1) // expectation capitalization
          );
        });
      });

      describe('class for text', () => {
        it(`should be ${testCase.class}`, async () => {
          // Arrange
          // Act
          await detectChanges();

          // Assert
          expect(getTextElement().classList.contains(testCase.class)).toBeTrue();
        });
      });
    });
  });
});
