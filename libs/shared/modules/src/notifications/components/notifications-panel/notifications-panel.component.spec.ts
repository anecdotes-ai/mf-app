import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { mockNotifications } from '../../mocks';
import { of } from 'rxjs';
import { NotificationsEventsService, NotificationsFacadeService } from '../../services';
import { NotificationsPanelComponent } from './notifications-panel.component';

describe('NotificationsPanelComponent', () => {
  let component: NotificationsPanelComponent;
  let fixture: ComponentFixture<NotificationsPanelComponent>;
  let facade: NotificationsFacadeService;
  let eventsService: NotificationsEventsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: NotificationsFacadeService, useValue: {} },
        { provide: NotificationsEventsService, useValue: {} },
      ],
      declarations: [NotificationsPanelComponent],
    })
      .overrideComponent(NotificationsPanelComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
      .compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(NotificationsPanelComponent);
    component = fixture.componentInstance;

    facade = TestBed.inject(NotificationsFacadeService);
    facade.getNotificationsCount = jasmine.createSpy('getNotificationsCount');
    facade.getAllNotifications = jasmine.createSpy('getAllNotifications').and.callFake(() => of(mockNotifications));
    facade.remove = jasmine.createSpy('remove');

    eventsService = TestBed.inject(NotificationsEventsService);
    eventsService.trackNotificationsClearAll = jasmine.createSpy('trackNotificationsClearAll');

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#clearAll', () => {
    it('should call trackNotificationsClearAll method', async () => {
      // Act
      await component.clearAll();

      // Assert
      expect(eventsService.trackNotificationsClearAll).toHaveBeenCalledWith(mockNotifications);
    });

    it('should call notificationsFacade remove', async () => {
      // Act
      await component.clearAll();

      // Assert
      expect(facade.remove).toHaveBeenCalled();
    });
  });
});
