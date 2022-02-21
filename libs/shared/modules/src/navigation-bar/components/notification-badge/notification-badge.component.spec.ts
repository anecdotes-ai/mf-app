import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NotificationsFacadeService } from 'core/modules/notifications/services';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { PositionX } from '../../models/navigation.model';
import { NotificationBadgeComponent } from './notification-badge.component';

describe('NotificationBadgeComponent', () => {
  configureTestSuite();
  let component: NotificationBadgeComponent;
  let fixture: ComponentFixture<NotificationBadgeComponent>;
  let notificationsFacade: NotificationsFacadeService;
  let anyNotifications: boolean;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationBadgeComponent],
      providers: [ {provide: NotificationsFacadeService, useValue: {}}]
    })
      .overrideComponent(NotificationBadgeComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationBadgeComponent);
    component = fixture.componentInstance;

    notificationsFacade = TestBed.inject(NotificationsFacadeService);
    notificationsFacade.getAreThereAnyNewNotifications = jasmine.createSpy('getAreThereAnyNewNotifications').and.callFake(() => of(anyNotifications));
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });

  describe('#anyNotifications', () => {
    [true, false].forEach((displayBadge) => {
      it(`badge display: ${displayBadge} if getAreThereAnyNewNotifications is ${displayBadge}`, async () => {
        // Arrange
        anyNotifications = displayBadge;

        // Act
        fixture.detectChanges();
        await fixture.whenStable();

        // Expect
        const badge = fixture.debugElement.query(By.css('svg-icon'));
        expect(!!badge).toBe(displayBadge);
      });
    });
  });

  describe('#xPosition', () => {
    [
      { position: PositionX.LEFT, class: 'right-4' },
      { position: PositionX.RIGHT, class: 'right-0' },
    ].forEach((testCase) => {
      it(`should have class ${testCase.class} if positionX is ${testCase.position}`, () => {
        // Arrange
        anyNotifications = true;
        component.xPosition = testCase.position;

        // Act
        fixture.detectChanges();
        // Expect
        const badge = fixture.debugElement.query(By.css('svg-icon'));
        expect(badge.classes[testCase.class]).toBeTrue();
      });
    });
  });
});
