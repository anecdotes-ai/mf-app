import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { UserEvents, MessageBusService, RouterExtensionService } from 'core';
import { ActionDispatcherService, ControlsFacadeService, TrackOperations } from 'core/modules/data/services';
import { RequirementsFacadeService } from './requirements-facade.service';
import { FrameworksFacadeService } from 'core/modules/data/services';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { of } from 'rxjs/internal/observable/of';
import { Requirement, ControlRequirement } from 'core/modules/data/models/domain';
import { AddRequirementAction } from 'core/modules/data/store';
import { configureTestSuite } from 'ng-bullet';

describe('RequirementsFacadeService', () => {
  configureTestSuite();

  let service: RequirementsFacadeService;
  let dispatcher: ActionDispatcherService;
  let frameworkFacade: FrameworksFacadeService;
  let controlFacade: ControlsFacadeService;
  let userService: UserEventService;

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        RequirementsFacadeService,
        { provide: ControlsFacadeService, useValue: {} },
        { provide: UserEventService, useValue: {} },
        { provide: ActionDispatcherService, useValue: {} },
        { provide: MessageBusService, useValue: {} },
        { provide: RouterExtensionService, useValue: {} },
        { provide: UserEvents, useValue: {} },
        { provide: FrameworksFacadeService, useValue: {} },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(RequirementsFacadeService);
    dispatcher = TestBed.inject(ActionDispatcherService);
    frameworkFacade = TestBed.inject(FrameworksFacadeService);
    controlFacade = TestBed.inject(ControlsFacadeService);
    userService = TestBed.inject(UserEventService);

    userService.sendEvent = jasmine.createSpy('sendEvent').and.callFake((() => { }));
    controlFacade.getControl = jasmine.createSpy('getControl').and.returnValue(of({ control_id: 'test-control' }));
    frameworkFacade.getFrameworkById = jasmine.createSpy('getFrameworkById').and.returnValue(of({ framework_id: 'fff' }));
    dispatcher.dispatchActionAsync = jasmine.createSpy('dispatchActionAsync').and.callFake(() => Promise.resolve());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addExistingRequirement', async () => {
    let relatedControlsSpy;
    let relatedFrameworksSpy;

    const testReq: Requirement = {
      requirement_id: 'bla',
      requirement_related_controls: ['control2'],
      requirement_related_frameworks: ['framework1'],
    };
    const actualReq: ControlRequirement = { requirement_name: 'reqName' };

    beforeEach(() => {
      relatedControlsSpy = spyOn(service, 'requirementRelatedControls');
      relatedFrameworksSpy = spyOn(service, 'requirementRelatedFrameworks');
      service.getRequirement = jasmine.createSpy('getRequirement').and.returnValue(of(actualReq));
    });

    [
      { relatedFrameworks: undefined, relatedControls: ['control1'] },
      { relatedFrameworks: ['framework2'], relatedControls: undefined },
      { relatedFrameworks: ['framework2'], relatedControls: ['control1'] },
    ].forEach((testCase) => {
      it(`shouldnt throw exception if relatedFrameworks ${testCase.relatedFrameworks} and relatedControls ${testCase.relatedControls}`, async () => {
        // Arrange
        relatedControlsSpy.and.returnValue(of(testCase.relatedControls));
        relatedFrameworksSpy.and.returnValue(of(testCase.relatedFrameworks));

        // Act
        try {
          await service.addExistingRequirement(testReq);
        } catch {
          fail('expected not throwing exception');
        }
      });
    });

    it(`should call dispatchActionAsync with AddRequirementAction`, async() => {
      // Arrange
      relatedControlsSpy.and.returnValue(of(['control1']));
      relatedFrameworksSpy.and.returnValue(of(['framework2']));
      
      // Act
      await service.addExistingRequirement(testReq);
      
      // Assert
      const expectedReq = { ...testReq };
      expectedReq.requirement_related_frameworks.push('framework2');
      expectedReq.requirement_related_controls.push('control1');
      const expectedAction = new AddRequirementAction({
        requirement: expectedReq,
        isExistingRequirement: true,
      });

      expect(dispatcher.dispatchActionAsync).toHaveBeenCalledWith(expectedAction, TrackOperations.ADD_REQUIREMENT);
    });
  });
});
