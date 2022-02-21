import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { configureTestSuite } from 'ng-bullet';
import { mockNotification } from '../../mocks';
import { NotificationState } from '../../models';
import { NotificationsEventsService } from '../../services';
import { animationDelay, NotificationItemComponent } from './notification-item.component';

describe('NotificationItemComponent', () => {
  configureTestSuite();

  let component: NotificationItemComponent;
  let fixture: ComponentFixture<NotificationItemComponent>;
  let host;
  let eventsService: NotificationsEventsService;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      providers: [{ provide: NotificationsEventsService, useValue: {} }],
      declarations: [NotificationItemComponent],
    })
      .overrideComponent(NotificationItemComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationItemComponent);
    component = fixture.componentInstance;
    component.notification = mockNotification;

    eventsService = TestBed.inject(NotificationsEventsService);
    eventsService.trackNotificationClick = jasmine.createSpy('trackNotificationClick');
    eventsService.trackNotificationRemoval = jasmine.createSpy('trackNotificationRemoval');

    fixture.detectChanges();
    host = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('default icon should be notification', () => {
    expect(component.icon).toEqual('notification');
  });

  describe('#remove', () => {
    it('should emit removed eventEmmiter when executing remove method', fakeAsync(() => {
      // Arrange
      spyOn(component.removed, 'emit');

      // Act
      component.remove(new MouseEvent('click'));
      tick(animationDelay);

      // Assert
      expect(component.removed.emit).toHaveBeenCalled();
    }));

    it('should trigger event service trackNotificationOnRemoval method', () => {
      // Arrange
      component.path = 'bla';

      // Act
      component.remove(new MouseEvent('click'));

      // Assert
      expect(eventsService.trackNotificationRemoval).toHaveBeenCalledWith(
        component.notification.type,
        component.path,
        component.notification.data.resource_type,
        component.notification.state
      );
    });

    it('should call event.stopPropagation', () => {
      // Arrange
      const mouseEvent = new MouseEvent('click');
      spyOn(mouseEvent, 'stopPropagation');

      // Act
      component.remove(mouseEvent);

      // Assert
      expect(mouseEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should turnRemoval state to true', () => {
      // Act
      component.remove(new MouseEvent('click'));

      // Assert
      expect(component.removalState).toBeTrue();
    });
  });

  describe('#onClick', () => {
    it('should emit clicked eventemitter event', () => {
      // arrange
      spyOn(component.clicked, 'emit');

      // act
      host.dispatchEvent(new MouseEvent('click'));

      // assert
      expect(component.clicked.emit).toHaveBeenCalled();
    });

    it('should trackNotificationClick on click on host', () => {
      // arrange
      component.path = 'bla';
      spyOn(component.clicked, 'emit');

      // act
      fixture.detectChanges();
      host.dispatchEvent(new MouseEvent('click'));

      // assert
      expect(eventsService.trackNotificationClick).toHaveBeenCalledWith(
        component.notification.type,
        component.path,
        component.notification.data.resource_type,
        component.notification.state
      );
    });
  });

  describe('#unread', () => {
    [
      { state: NotificationState.New, result: true },
      { state: NotificationState.Seen, result: false },
    ].forEach((testCase) => {
      it(`unread should be ${testCase.result} when notification state is ${testCase.state}`, () => {
        // arrange
        component.notification.state = testCase.state;

        // act
        const result = component.unread;

        // assert
        expect(result).toEqual(testCase.result);
      });

      it(`host class should contain 'unread' class = ${testCase.result} when state is ${testCase.state}`, () => {
        // arrange
        component.notification.state = testCase.state;

        // act
        fixture.detectChanges();

        // assert
        expect(host.classList.contains('unread')).toEqual(testCase.result);
      });
    });
  });
});
