/* tslint:disable:no-unused-variable */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CalculatedControl } from 'core/modules/data/models';
import { ControlRequirement } from 'core/modules/data/models/domain';
import { ControlsFacadeService } from 'core/modules/data/services';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { ControlContextService } from '../..';
import { MessageBusService } from 'core';
import { ModalWindowService } from 'core/modules/modals';
import { ControlsState } from 'core/modules/data/store/reducers';
import { ControlRequirementListComponent } from './control-requirement-list.component';
import { RequirementCustomizationModalService } from 'core/modules/shared-controls/modules/customization/requirement/services';
import {ActivatedRoute} from "@angular/router";

describe('ControlRequirementListComponent', () => {
  configureTestSuite();

  let component: ControlRequirementListComponent;
  let fixture: ComponentFixture<ControlRequirementListComponent>;
  let store: MockStore;
  let modalWindowService: ModalWindowService;
  let controlsFacade: ControlsFacadeService;
  let requirementCustomizationModalService: RequirementCustomizationModalService;
  let controlContext: ControlContextService;
  let control: CalculatedControl = {
    control_calculated_requirements: [{ requirement_id: 'some-requirement-id' }],
  };
  let activatedRoute: ActivatedRoute;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [ControlRequirementListComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        provideMockStore({}),
        { provide: ControlContextService, useValue: {} },
        MessageBusService,
        { provide: ControlsFacadeService, useValue: {} },
        { provide: RequirementCustomizationModalService, useValue: {} },
        { provide: ControlContextService, useValue: {} },
        { provide: ActivatedRoute, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(inject([MockStore], (injectedStore: MockStore) => {
    fixture = TestBed.createComponent(ControlRequirementListComponent);
    component = fixture.componentInstance;
    store = injectedStore;
    modalWindowService = TestBed.inject(ModalWindowService);
    controlsFacade = TestBed.inject(ControlsFacadeService);
    controlsFacade.getSingleControl = jasmine.createSpy('getSingleControl').and.callFake(() => of(control));
    controlsFacade.getSingleControlOrSnapshot = jasmine.createSpy('getSingleControlOrSnapshot').and.callFake(() => of(control));
    requirementCustomizationModalService = TestBed.inject(RequirementCustomizationModalService);

    controlContext = TestBed.inject(ControlContextService);
    controlContext.getControlNewRequirements = jasmine.createSpy('getControlNewRequirements').and.callFake(() => of(new Set<string>()));

    activatedRoute = TestBed.inject(ActivatedRoute);
    activatedRoute.queryParams = of();

    component.controlInstance = {};
    component.framework = {};
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('buildTranslationKey', () => {
    it('should build translation key full path based on relative key', () => {
      // Arrange
      const relativeKey = 'someKey';

      // Act
      const actual = component.buildTraslationKey(relativeKey);

      // Assert
      expect(actual).toBe(`requirements.${relativeKey}`);
    });
  });

  describe('reqTrackBy', () => {
    it('should track control requirement by requirement_id', () => {
      // Arrange
      const controlRequirement: ControlRequirement = { requirement_id: 'someId' };

      // Act
      const actual = component.reqTrackBy(0, controlRequirement);

      // Assert
      expect(actual).toBe(controlRequirement.requirement_id);
    });

    it('should track control requirement by index if control requirement is undefined', () => {
      // Arrange
      const controlRequirement: ControlRequirement = undefined;
      const index = 10;

      // Act
      const actual = component.reqTrackBy(index, controlRequirement);

      // Assert
      expect(actual).toBe(index);
    });
  });

  describe('toggleIgnoredReq', () => {
    it('should set false to ignoredRequirementsShowed if ignoredRequirementsShowed is true', () => {
      // Arrange
      component.ignoredRequirementsShowed = true;

      // Act
      component.toggleIgnoredReq();

      // Assert
      expect(component.ignoredRequirementsShowed).toBeFalsy();
    });

    it('should set true to ignoredRequirementsShowed if ignoredRequirementsShowed is false', () => {
      // Arrange
      component.ignoredRequirementsShowed = false;

      // Act
      component.toggleIgnoredReq();

      // Assert
      expect(component.ignoredRequirementsShowed).toBeTruthy();
    });
  });

  describe('controlRequirements$', () => {
   describe('initally', () => {
      it('should return control requirements empty array with length equal to 1 if control_number_of_requirements is less then 1', async () => {
       // Arrange
       const controlId = 'someId';
       const framrworkId = 'someFId';
       component.framework = { framework_id: framrworkId };
       component.controlInstance = { control_id: controlId };
       const expandedControl: CalculatedControl = {
         control_calculated_requirements: [],
       };

      const expandControlState: CalculatedControl = {
         entities: {
           [controlId]: {
             instance_id: '_',
             id: controlId,
             expandedControl: expandedControl,
           },
         },
       } as any;

       store.setState({
         expandControlState: expandControlState,
       } as any);

       // Act
       fixture.detectChanges();
       await fixture.whenStable();
       const actual = await component.controlRequirements$.pipe(take(1)).toPromise();

       // Assert
      expect(actual.length).toBe(1);
      });
    });
  });

  describe('ignoredRequirementsExist$', () => {
   it('should return true if expanded control contains ignored control requirements', async () => {
     // Arrange
     const controlId = 'someId';
     const framrworkId = 'someFId';
     component.framework = { framework_id: framrworkId };
     const isLoaded = true;
     component.controlInstance = {
       control_id: controlId,
     };
     const expandedControl: CalculatedControl = {
       control_calculated_requirements: [
         {
           requirement_applicability: true,
         },
         { requirement_applicability: false },
       ],
     };

     const expandControlState: ControlsState = {
       entities: {
         [controlId]: {
           instance_id: '_',
           id: controlId,
           expandedControl: expandedControl,
           isLoaded: isLoaded,
         },
       },
     } as any;

     store.setState({
       expandControlState: expandControlState,
     } as any);

     // Act
     fixture.detectChanges();
     await fixture.whenStable();
     const actual = await component.ignoredRequirementsExist$.pipe(take(1)).toPromise();

     // Assert
     expect(actual).toBeTrue();
   });

   it('should return false if expanded control does not contain ignored control requirements', async () => {
     // Arrange
     const controlId = 'someId';
     const framrworkId = 'someFId';
     component.framework = { framework_id: framrworkId };
     const isLoaded = true;
     component.controlInstance = {
       control_id: controlId,
     };
     const expandedControl: CalculatedControl = {
       control_calculated_requirements: [
         {
           requirement_applicability: true,
         },
         { requirement_applicability: true },
       ],
     };
     control = expandedControl;

     const expandControlState: ControlsState = {
       entities: {
         [controlId]: {
           instance_id: '_',
           id: controlId,
           expandedControl: expandedControl,
           isLoaded: isLoaded,
         },
       },
     } as any;

     store.setState({
       expandControlState: expandControlState,
     } as any);

     // Act
     fixture.detectChanges();
     await fixture.whenStable();
     const actual = await component.ignoredRequirementsExist$.pipe(take(1)).toPromise();

     // Assert
     expect(actual).toBeFalse();
   });
  });

  describe('openAddRequirementModal', () => {
    it('should call openAddRequirementModal from RequirementCustomizationModalService', () => {
      // Arrange
      requirementCustomizationModalService.openAddRequirementModal = jasmine.createSpy('openAddRequirementModal');

      // Act
      component.openAddRequirementModal();

      // Assert
      expect(requirementCustomizationModalService.openAddRequirementModal).toHaveBeenCalledWith(
        component.controlInstance.control_id,
        component.framework.framework_id
      );
    });
  });

  describe('expandAllRequirements', () => {
    it('should set areRequirementsExpanded to true', () => {
      // Act
      component.expandAllRequirements();

      // Assert
      expect(component.areRequirementsExpanded).toBeTrue();
    });
  });

  describe('collapseAllRequirements', () => {
    it('should set areRequirementsExpanded to false', () => {
      // Act
      component.collapseAllRequirements();

      // Assert
      expect(component.areRequirementsExpanded).toBeFalse();
    });
  });
});
