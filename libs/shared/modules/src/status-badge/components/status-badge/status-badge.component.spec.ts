import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ResourceStatusEnum } from '../../../data/models';
import { StatusBadgeComponent } from './status-badge.component';

describe('StatusBadgeComponent', () => {
  let component: StatusBadgeComponent;
  let fixture: ComponentFixture<StatusBadgeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [StatusBadgeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.overrideComponent(StatusBadgeComponent, {
      set: new Component({
        template: `<div *ngIf="statusMapping[status] as resolvedStatus" class="status-badge" [class]="resolveClass(resolvedStatus)"></div>`,
        changeDetection: ChangeDetectionStrategy.Default,
      }),
    }).createComponent(StatusBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('if no status was passed, no badge should be displayed', () => {
    expect(fixture.debugElement.query(By.css('.status-badge'))).toBeFalsy();
  });

  describe('buildTranslationKey', () => {
    it('should return built translation key', () => {
      // Arrange
      const fakeRelativeKey = 'fakerelativekey';

      // Act
      const actual = component.buildTranslationKey(fakeRelativeKey);

      // Assert
      expect(actual).toBe(`components.statusBadge.${fakeRelativeKey}`);
    });
  });

  [
    { status: ResourceStatusEnum.APPROVED, hoverable: false, expectedClass: 'bg-blue-60' },
    { status: ResourceStatusEnum.ON_HOLD, hoverable: false, expectedClass: 'bg-navy-90' },
    { status: ResourceStatusEnum.PENDING, hoverable: false, expectedClass: 'bg-orange-70' },
    { status: ResourceStatusEnum.NOTSTARTED, hoverable: false, expectedClass: 'bg-pink-70' },

    { status: ResourceStatusEnum.APPROVED, hoverable: true, expectedClass: 'hoverable-bg-blue' },
    { status: ResourceStatusEnum.ON_HOLD, hoverable: true, expectedClass: 'hoverable-bg-navy' },
    { status: ResourceStatusEnum.PENDING, hoverable: true, expectedClass: 'hoverable-bg-orange' },
    { status: ResourceStatusEnum.NOTSTARTED, hoverable: true, expectedClass: 'hoverable-bg-pink' },
  ].forEach((testcase) => {
    describe(`when status is "${testcase.status} and hoverable is ${testcase.hoverable}" `, () => {
      it(`the badge should have ${testcase.expectedClass} class`, () => {
        // Arrange
        component.status = testcase.status;
        component.hoverable = testcase.hoverable;

        // Act
        fixture.detectChanges();

        const badge = fixture.debugElement.query(By.css('.status-badge'));

        // Assert
        expect(badge.classes[testcase.expectedClass]).toBeTruthy();
      });
    });
  });
});
