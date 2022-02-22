import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { BadgeColorTypes } from '../models';
import { OnboardingCardComponent } from './onboarding-card.component';

describe('OnboardingCardComponent', () => {
  configureTestSuite();

  let component: OnboardingCardComponent;
  let fixture: ComponentFixture<OnboardingCardComponent>;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [OnboardingCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#badgeColorClass', () => {
    it('should return pink if passed color type is BadgeColorTypes.PINK', () => {
      // Arrange
      component.colorType = BadgeColorTypes.PINK;

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.badgeColorClass).toBe('pink');
    });

    it('should return orange if passed color type is BadgeColorTypes.ORANGE', () => {
      // Arrange
      component.colorType = BadgeColorTypes.ORANGE;

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.badgeColorClass).toBe('orange');
    });

    it('should return empty string if passed color type is unknown', () => {
      // Arrange
      component.colorType = null;

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.badgeColorClass).toBe('');
    });
  });
});
