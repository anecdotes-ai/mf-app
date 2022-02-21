import { AddCustomControlAction, EditCustomControlAction, UpdateControlOwnerAction } from 'core/modules/data/store';
import { CustomControlFormData } from 'core/modules/data/services/controls/models/add-customer-control.model';
import { TestBed } from '@angular/core/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { ActionDispatcherService, TrackOperations, FrameworksFacadeService, SnapshotsFacadeService} from 'core/modules/data/services';
import { of } from 'rxjs';
import { ControlsFacadeService } from './controls-facade.service';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { ControlEventDataProperty, UserEvents } from 'core/models/user-events/user-event-data.model';
import { OperationsTrackerService } from '../../operations-tracker/operations-tracker.service';

describe('ControlsFacadeService', () => {
  let service: ControlsFacadeService;
  let actionDispatcher: ActionDispatcherService;
  let userEventHub: UserEventService;
  let frameworkFacadeService: FrameworksFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        ControlsFacadeService,
        {
          provide: ActionDispatcherService,
          useValue: {
            dispatchActionAsync: (action: Action, operationId: string, operationPartition?: string): Promise<any> => {
              return of({}).toPromise();
            },
          },
        },
        { provide: UserEventService, useValue: {} },
        { provide: FrameworksFacadeService, useValue: {} },
        { provide: OperationsTrackerService, useValue: {} },
        { provide: SnapshotsFacadeService, useValue: {} },
      ],
    });
    service = TestBed.inject(ControlsFacadeService);
    actionDispatcher = TestBed.inject(ActionDispatcherService);

    userEventHub = TestBed.inject(UserEventService);
    userEventHub.sendEvent = jasmine.createSpy('sendEvent').and.callFake(() => of({}));

    frameworkFacadeService = TestBed.inject(FrameworksFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Custom Controls related functions', () => {
    const framework_id = 'framework_id_test_id';
    const control_id = 'control_id';
    const payload: CustomControlFormData = {
      control_id: 'test_control_id',
      control_name: 'test_name',
      control_description: 'test_control_desc',
      control_framework_category: 'random Category',
    };
    const framework = {
      framework_id,
      framework_name: 'test',
    };

    beforeEach(() => {
      actionDispatcher.dispatchActionAsync = jasmine
        .createSpy('dispatchActionAsync')
        .and.returnValue(of(payload.control_id).toPromise());
      frameworkFacadeService.getFrameworkById = jasmine.createSpy('getFrameworkById').and.callFake(() => of(framework));
    });

    describe('addCustomControl', () => {
      it(`should return result (control_id) from actionDispatcher of operation ${TrackOperations.ADD_CUSTOM_CONTROL}`, async () => {
        // Arrange
        // Act
        const res = await service.addCustomControl(framework_id, payload);
        // Assert
        expect(actionDispatcher.dispatchActionAsync).toHaveBeenCalledWith(
          new AddCustomControlAction(framework_id, payload, framework.framework_name),
          TrackOperations.ADD_CUSTOM_CONTROL
        );

        expect(res).toBe(payload.control_id);

        expect(userEventHub.sendEvent).toHaveBeenCalledWith(UserEvents.CONTROL_CREATE_CONTOL, {
          [ControlEventDataProperty.ControlCategory]: payload.control_framework_category,
          [ControlEventDataProperty.FrameworkName]: framework.framework_name,
          [ControlEventDataProperty.ControlName]: payload.control_name,
        });
      });
    });

    describe('editCustomControl', () => {
      it(`should call actionDispatcher for operation ${TrackOperations.UPDATE_CUSTOM_CONTOL}`, async () => {
        // Arrange
        service.getControl = jasmine.createSpy('getControl').and.returnValue(of(undefined));

        // Act
        const res = await service.editCustomControl(framework_id, control_id, payload);

        // Assert
        expect(actionDispatcher.dispatchActionAsync).toHaveBeenCalledWith(
          new EditCustomControlAction(control_id, payload),
          TrackOperations.UPDATE_CUSTOM_CONTOL
        );

        expect(userEventHub.sendEvent).toHaveBeenCalledWith(UserEvents.CONTROL_UPDATE_CONTROL, {
          [ControlEventDataProperty.ControlCategory]: payload.control_framework_category,
          [ControlEventDataProperty.FrameworkName]: framework.framework_name,
          [ControlEventDataProperty.ControlName]: payload.control_name,
          [ControlEventDataProperty.NameChanged]: true,
          [ControlEventDataProperty.CategoryChanged]: true,
        });
      });
    });

    describe('updateControlOwner', () => {
      it(`should call actionDispatcher for operation ${TrackOperations.UPDATE_CONTROL_OWNER}`, async () => {
        const newOwner = 'new-owner';
        // Arrange
        // Act
        const res = await service.updateControlOwner(control_id, newOwner);

        // Assert
        expect(actionDispatcher.dispatchActionAsync).toHaveBeenCalledWith(
          new UpdateControlOwnerAction(control_id, newOwner),
          TrackOperations.UPDATE_CONTROL_OWNER
        );
      });
    });
  });
});
