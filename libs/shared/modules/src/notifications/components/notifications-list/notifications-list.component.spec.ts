import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationsFacadeService } from 'core/modules/notifications/services';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { mockNotification, notSortedMockNotifications, sortedMockNotifications } from '../../mocks';
import { Notification, NotificationResourceType, NotificationState } from '../../models';
import { NotificationsListComponent } from './notifications-list.component';

describe('NotificationsListComponent', () => {
  configureTestSuite();
  let component: NotificationsListComponent;
  let fixture: ComponentFixture<NotificationsListComponent>;
  let facade: NotificationsFacadeService;
  let notifications: Notification[];

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: NotificationsFacadeService, useValue: {} }],
      declarations: [NotificationsListComponent],
      imports: [TranslateModule.forRoot()],
    })
      .overrideComponent(NotificationsListComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
      .compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(NotificationsListComponent);
    component = fixture.componentInstance;

    facade = TestBed.inject(NotificationsFacadeService);
    facade.getAllNotifications = jasmine.createSpy('getAllNotifications').and.callFake(() => of(notifications));
    facade.markAsSeen = jasmine.createSpy('markAsSeen');
    facade.remove = jasmine.createSpy('remove');
  });

  describe('#notifications list is not empty', () => {
    beforeEach(async () => {
      notifications = notSortedMockNotifications;

      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should render notifications list', () => {
      // Act
      const notificationsList = fixture.debugElement.query(By.css('#notificationsList'));

      // Assert
      expect(notificationsList).toBeDefined();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it(`should have 'notifications.panel.' at the prefix of buildTranslationKey`, () => {
      expect(component.buildTranslationKey('')).toEqual('notifications.panel.');
    });

    it(`should sort notifications by date`, async () => {
      // act
      const notifications = await component.notifications$.pipe(take(1)).toPromise();

      // assert
      expect(notifications).toEqual(sortedMockNotifications);
    });

    it(`selectNotificationId should return notification id`, () => {
      // Act
      const nId = component.selectNotificationId(mockNotification);
      // Assert
      expect(nId).toEqual(mockNotification.id);
    });

    it('should call facade.remove when notificationRemoved is executed', () => {
      // Act
      component.notificationRemoved(mockNotification.id);

      // Assert
      expect(facade.remove).toHaveBeenCalledWith(mockNotification.id);
    });

    describe('#isComment', () => {
      const notification = mockNotification;
      [
        { type: NotificationResourceType.Comment, result: true },
        { type: NotificationResourceType.Thread, result: true },
        { type: undefined, result: false },
      ].forEach((testCase) => {
        it(`should be ${testCase.result} when notification resource type is ${testCase.type}`, () => {
          // Arrange
          notification.data.resource_type = testCase.type;

          // Act(
          const result = component.isComment(notification);

          expect(result).toEqual(testCase.result);
        });
      });
    });

    describe('#notificationClicked', () => {
      const notification = mockNotification;

      it(`should call facade mark as seen if state is new`, async () => {
        // Arrange
        notification.state = NotificationState.New;

        // Act(
        await component.notificationClicked(notification);

        // Assert
        expect(facade.markAsSeen).toHaveBeenCalledWith(notification.id);
      });

      it(`shouldnt call facade mark as seen if state is seen`, async () => {
        // Arrange
        notification.state = NotificationState.Seen;

        // Act(
        await component.notificationClicked(notification);

        // Assert
        expect(facade.markAsSeen).not.toHaveBeenCalled();
      });
    });
  });

  describe('#notifications list is empty', () => {
    beforeEach(async () => {
      notifications = [];

      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should render empty state', () => {
      // Act
      const emptyState = fixture.debugElement.query(By.css('#emptyState'));

      // Assert
      expect(emptyState).toBeDefined();
    });
  });
});
