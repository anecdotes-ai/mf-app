import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { PusherMessageType } from 'core/models/pusher-message-type.model';
import { ControlsFacadeService } from 'core/modules/data/services/';
import { ControlOwnerUpdatedAction } from 'core/modules/data/store';
import { ControlOwnerChangedHandler } from './control-owner-chnaged-handler';

describe('ControlOwnerChangedHandler', () => {
  let serviceUnderTest: ControlOwnerChangedHandler;
  let controlsFacadeMock: ControlsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore(), ControlOwnerChangedHandler, 
        { provide: ControlsFacadeService, useValue: {} }],
    });
    serviceUnderTest = TestBed.inject(ControlOwnerChangedHandler);

    controlsFacadeMock = TestBed.inject(ControlsFacadeService);
    controlsFacadeMock.controlOwnerUpdated = jasmine.createSpy('controlOwnerUpdated');
  });

  it('should be created', () => {
    expect(serviceUnderTest).toBeTruthy();
  });

  describe('#handle', () => {
    it('should dispatch UpdateControlAction if message_object is defined', () => {
      // Arrange
      const control_id = 'some-control-id';
      const control_owner = 'owner';
      const message = {
        message_type: PusherMessageType.ControlOwnerChanged,
        message_object: { updated_control: {control_id, control_owner} },
      };

      // Act
      serviceUnderTest.handle(message);

      // Assert
      expect(controlsFacadeMock.controlOwnerUpdated).toHaveBeenCalledWith(control_id, control_owner);
    });
  });
});
