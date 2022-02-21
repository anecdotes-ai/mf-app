import { ChangeDetectionStrategy, SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import {
  focusedReplyIdQueryParam,
  focusedThreadIdQueryParam,
} from 'core/modules/commenting/store/effects/focusing-inputs.effects';
import { configureTestSuite } from 'ng-bullet';
import { mockNotification } from '../../mocks';
import { Notification, NotificationResourceType } from '../../models';
import { CommentNotificationComponent } from './comment-notification.component';

describe('CommentNotificationComponent', () => {
  configureTestSuite();

  let component: CommentNotificationComponent;
  let fixture: ComponentFixture<CommentNotificationComponent>;
  let routerMock: Router;

  let expectedRoutingPath: string;
  let fakeNotification: Notification;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: {} }],
      declarations: [CommentNotificationComponent],
    })
      .overrideComponent(CommentNotificationComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentNotificationComponent);
    component = fixture.componentInstance;

    routerMock = TestBed.inject(Router);
    routerMock.navigate = jasmine.createSpy('navigate');

    fakeNotification = mockNotification;
    component.notification = fakeNotification;
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have comment icon set by default to comment', () => {
    fixture.detectChanges();
    expect(component.icon).toEqual('notifications/comment');
  });

  describe('#navigateTo', () => {
    function assertNavigation(commentType: string): void {
      const queryParams = { [commentType]: component.notification?.data?.resource_id };
      expect(routerMock.navigate).toHaveBeenCalledWith([expectedRoutingPath], {
        queryParams,
      });
    }

    [
      { navTo: focusedReplyIdQueryParam, resource_type: NotificationResourceType.Comment },
      { navTo: focusedThreadIdQueryParam, resource_type: NotificationResourceType.Thread },
    ].forEach((testCase) => {
      it(`should navigate to ${testCase.resource_type}`, async () => {
        // Arrange
        component.notification.data.resource_type = testCase.resource_type;
        expectedRoutingPath = '/frameworks/SOC 2/controls';

        // Act
        fixture.detectChanges();

        await component.onClick();

        // Assert
        assertNavigation(testCase.navTo);
      });
    });
  });

  describe('#isThread', () => {
    [
      { resource_type: NotificationResourceType.Comment, result: false },
      { resource_type: NotificationResourceType.Thread, result: true },
      { resource_type: undefined, result: false },
    ].forEach((testCase) => {
      it(`should be: ${testCase.result} if resource type is ${testCase.resource_type}`, () => {
        // Arrange
        component.notification.data.resource_type = testCase.resource_type;

        // Act
        fixture.detectChanges();
        const actualResult = component.isThread;

        // Assert
        expect(actualResult).toEqual(testCase.result);
      });
    });
  });

  describe('#path', () => {
    [
      { path: [], result: '' },
      { path: ['bla', 'bla', 'bla'], result: 'bla > bla > bla' },
      { path: undefined, result: undefined },
    ].forEach((testCase) => {
      it(`should be ${testCase.result} if path in extra prarams is ${testCase.path}`, () => {
        // Arrange
        component.notification.data.extraParams.path = testCase.path;
        const changes: SimpleChanges = {
          notification: new SimpleChange(null, component.notification, true),
        };

        // Act
        fixture.detectChanges();
        component.ngOnChanges(changes);

        // Assert
        expect(component.path).toEqual(testCase.result);
      });
    });
  });

  describe('#onClick', () => {
    it(`should navigate to thread after click`, async () => {
      // Act
      component.onClick();
      await fixture.whenStable();

      // Assert
      expect(routerMock.navigate).toHaveBeenCalled();
    });

    it(`should navigate emit clicked eventemitter`, async () => {
      // Arrange
      spyOn(component.clicked, 'emit');

      // Act
      await component.onClick();

      // Assert
      expect(component.clicked.emit).toHaveBeenCalled();
    });
  });
});
