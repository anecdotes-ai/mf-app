import { RoleEnum } from 'core/modules/auth-core/models/domain/user';
import { VisibleForRoleDirective } from 'core/modules/directives/visible-for-role/visible-for-role.directive';
import { RoleService } from 'core/modules/auth-core/services/role/role.service';
import { DatePipe } from '@angular/common';
import { HttpBackend } from '@angular/common/http';
import { ChangeDetectionStrategy, DebugElement, NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderManagerService, MessageBusService } from 'core';
import { MenuAction, ThreeDotsMenuComponent } from 'core/modules/dropdown-menu';
import {
  DataAggregationFacadeService,
  EvidenceFacadeService,
  OperationsTrackerService,
  PoliciesFacadeService,
  TrackOperations,
} from 'core/modules/data/services';
import { ControlRequirement, EvidenceInstance } from 'core/modules/data/models/domain';
import { ControlRequirementApplicabilityChangeAction, reducers } from 'core/modules/data/store';
import { ModalWindowService } from 'core/modules/modals';
import { ControlContextService, ControlsFocusingService, EvidenceCollectionModalService } from 'core/modules/shared-controls';
import { RequirementCustomizationModalService } from 'core/modules/shared-controls/modules/customization/requirement/services';
import { spyOnMessageBusMethods } from 'core/utils/testing';
import { configureTestSuite } from 'ng-bullet';
import { Observable, of } from 'rxjs';
import { SlackModalService } from '../../services/slack-modal/slack-modal.service';
import { TestControlUpdationService } from '../../services/test-control-updation/test-control-updation.service';
import { ControlRequirementComponent } from './control-requirement.component';
import { EvidenceModalService } from 'core/modules/shared-controls/modules/evidence/services';
import { NgVarDirective } from 'core/modules/directives';
import { OverlayModule } from '@angular/cdk/overlay';

export class MockSlackModalService {
  isSlackModalAllowedToDisplay(): Observable<boolean> {
    return of(true);
  }
}

describe('ControlRequirementComponent', () => {
  configureTestSuite();

  let component: ControlRequirementComponent;
  let fixture: ComponentFixture<ControlRequirementComponent>;
  let store: MockStore;
  let operationsTrackerService: OperationsTrackerService;
  let testControlUpdationService: TestControlUpdationService;
  let messageBusService: MessageBusService;
  let controlContext: ControlContextService;
  let roleService: RoleService;
  let controlsFocusingServiceMock: ControlsFocusingService;
  let dataAggregationFacadeServiceMock: DataAggregationFacadeService;

  const roleToReturnFromRoleService = 'fake-role';
  const controlName = 'controlName';
  const controlCategory = 'controlCategory';
  const frameworkName = 'frameworkName';

  beforeAll(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({}),
        DatePipe,
        HttpBackend,
        { provide: ModalWindowService, useValue: {} },
        { provide: OperationsTrackerService, useValue: {} },
        { provide: MessageBusService, useValue: {} },
        { provide: LoaderManagerService, useValue: {} },
        { provide: SlackModalService, useClass: MockSlackModalService },
        { provide: RequirementCustomizationModalService, useValue: {} },
        { provide: EvidenceFacadeService, useValue: {} },
        { provide: PoliciesFacadeService, useValue: {} },
        { provide: ControlContextService, useValue: {} },
        { provide: EvidenceModalService, useValue: {} },
        { provide: ControlsFocusingService, useValue: {} },
        { provide: DataAggregationFacadeService, useValue: {}},
        { provide: EvidenceCollectionModalService, useValue: {} },
        {
          provide: RoleService,
          useValue: {
            getCurrentUserRole: () => roleToReturnFromRoleService,
          },
        },
      ],
      declarations: [
        ControlRequirementComponent,
        ThreeDotsMenuComponent,
        VisibleForRoleDirective,
        NgVarDirective
      ],
      imports: [
        TranslateModule.forRoot(),
        StoreModule.forRoot(reducers),
        NoopAnimationsModule,
        RouterTestingModule,
        NgbTooltipModule,
        MatMenuModule,
        OverlayModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ControlRequirementComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlRequirementComponent);
    component = fixture.componentInstance;
    component.controlRequirement = {};
    component.threeDotsMenuComponent = TestBed.createComponent(ThreeDotsMenuComponent).componentInstance;
    store = TestBed.inject(MockStore);
    testControlUpdationService = TestBed.inject(TestControlUpdationService);
    operationsTrackerService = TestBed.inject(OperationsTrackerService);
    roleService = TestBed.inject(RoleService);

    controlContext = TestBed.inject(ControlContextService);
    controlContext.getRequirementNewEvidence = jasmine
      .createSpy('getRequirementNewEvidence')
      .and.callFake(() => of(new Set<string>()));

    messageBusService = TestBed.inject(MessageBusService);
    spyOnMessageBusMethods(messageBusService);

    controlsFocusingServiceMock = TestBed.inject(ControlsFocusingService);
    controlsFocusingServiceMock.getSpecificRequirementFocusingStream = jasmine.createSpy('getSpecificRequirementFocusingStream').and.callFake(() => of());
    component.requirementLike = {
      resourceId: 'fake-resource-id'
    };
    component.currentFramework = {};
    component.controlInstance = {};
    dataAggregationFacadeServiceMock = TestBed.inject(DataAggregationFacadeService);
    dataAggregationFacadeServiceMock.getRelevantEvidence = jasmine.createSpy('getRelevantEvidence').and.callFake(() => of([]));
  });

  it('should create', () => {
    component.controlInstance = {} as any;

    expect(component).toBeTruthy();
  });

  it('should have `ignored` class if provided control requirement is not applicable', () => {
    // Arrange
    component.controlRequirement = {
      requirement_applicability: false,
      requirement_related_evidences: [],
    };
    component.currentFramework = { framework_name: frameworkName };
    component.controlInstance = { control_category: controlCategory, control_name: controlName };
    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.debugElement.classes['ignored']).toBeTruthy();
  });

  it('should not have `ignored` class if provided control requirement is applicable', () => {
    // Arrange
    component.controlRequirement = {
      requirement_applicability: true,
      requirement_related_evidences: [],
    };

    component.currentFramework = { framework_name: frameworkName };
    component.controlInstance = { control_category: controlCategory, control_name: controlName };
    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.debugElement.classes['ignored']).toBeFalsy();
  });

  describe('threeDotsMenu', () => {
    let controlRequirement: ControlRequirement;
    let menuActionObject: MenuAction<ControlRequirement>;
    let testControlUpdationReturnValue: boolean;
    let operationsTrackerReturnValue: Error | any;

    beforeEach(() => {
      spyOn(component, 'buildTranslationKey').and.callFake((x) => x);
      controlRequirement = {};
      operationsTrackerService.getOperationStatus = jasmine
        .createSpy('getOperationStatus')
        .and.callFake(() => of(operationsTrackerReturnValue));
      testControlUpdationService.testControlUpdation = jasmine
        .createSpy('testControlUpdation')
        .and.callFake(() => of(testControlUpdationReturnValue));
    });

    describe('first element', () => {
      beforeEach(() => {
        menuActionObject = component.threeDotsMenuActions[0];
      });

      describe('translationKeyFactory()', () => {
        it('should have translationKeyFactory', () => {
          // Arrange
          // Act
          // Assert
          expect(menuActionObject.translationKeyFactory).toBeInstanceOf(Function);
        });

        it('should have translationKeyFactory that returns `ignore` translationKey if control requirement is applicable', () => {
          // Arrange
          controlRequirement.requirement_applicability = true;

          // Act
          const translationKey = menuActionObject.translationKeyFactory(controlRequirement);

          // Assert
          expect(translationKey).toBe('threeDotsMenu.ignore');
        });

        it('should have translationKeyFactory that returns `markAsRelevant` translationKey if control requirement is not applicable', () => {
          // Arrange
          controlRequirement.requirement_applicability = false;

          // Act
          const translationKey = menuActionObject.translationKeyFactory(controlRequirement);

          // Assert
          expect(translationKey).toBe('threeDotsMenu.markAsRelevant');
        });
      });

      describe('action()', () => {
        it('should set displayActionAnimation to true', async () => {
          // Arrange
          component.controlRequirement = {
            requirement_related_evidences: [],
            requirement_id: '_',
          };
          component.controlInstance = {
            control_id: '_',
          };
          component.displayActionAnimation = false;
          component.currentFramework = { framework_name: frameworkName };
          component.controlInstance = { control_category: controlCategory, control_name: controlName };
          // Act
          menuActionObject.action(controlRequirement);

          // Assert
          expect(component.displayActionAnimation).toBeTruthy();
        });

        it('should toggle control requirement applicability', async () => {
          // Arrange
          const requirement_id = 'someGroupId';
          const control_id = 'someControlId';

          testControlUpdationReturnValue = true;
          operationsTrackerReturnValue = {};
          store.dispatch = jasmine.createSpy('dispatch');
          component.controlRequirement = {
            requirement_related_evidences: [],
            requirement_id: requirement_id,
          };
          component.controlInstance = {
            control_id,
          };
          component.currentFramework = { framework_name: frameworkName };
          component.controlInstance = { control_category: controlCategory, control_name: controlName };

          // Act
          await menuActionObject.action(controlRequirement);

          // Assert
          expect(store.dispatch).toHaveBeenCalledWith(
            new ControlRequirementApplicabilityChangeAction(component.controlRequirement)
          );

          expect(operationsTrackerService.getOperationStatus).toHaveBeenCalledWith(
            requirement_id,
            TrackOperations.TOGGLE_REQ_APPLICABILITY
          );
        });
      });
    });
  });

  describe('ngOnChanges', () => {
    describe('controlRequirement property changed', () => {
      describe('controlRequirement is defined', () => {
        it('should change manualUploadingPercentage', () => {
          // Arrange
          component.controlInstance = {
            control_id: 'test-id',
          };
          const evidence = [{}];
          component.controlRequirement = {
            requirement_related_evidences: evidence,
          };

          // Act
          component.ngOnChanges({
            controlRequirement: new SimpleChange(null, component.controlRequirement, true),
          });

          // Assert
          expect(component.evidence).toBe(evidence);
        });
      });

      describe('displayPlaceholders is true and controlRequirement is not defined', () => {
        it('should set evidence property with array with length equal control_number_of_total_evidence_collected and if control_number_of_total_evidence_collected is defined', () => {
          // Arrange
          /* tslint:disable:whitespace */
          const expectedArray = [, , , ,];
          component.controlRequirement = undefined;
          component.displayPlaceholders = true;
          component.controlInstance = {
            control_number_of_total_evidence_collected: expectedArray.length,
          };

          // Act
          component.ngOnChanges({
            controlRequirement: new SimpleChange(null, component.controlRequirement, true),
          });

          // Assert
          expect(component.evidence).toEqual(expectedArray);
        });

        it('should set evidence property with array with length equal 0 and if control_number_of_total_evidence_collected is undefined', () => {
          // Arrange
          const expectedArray = [];
          component.controlRequirement = undefined;
          component.displayPlaceholders = true;
          component.controlInstance = {
            control_number_of_total_evidence_collected: undefined,
          };

          // Act
          component.ngOnChanges({
            controlRequirement: new SimpleChange(null, component.controlRequirement, true),
          });

          // Assert
          expect(component.evidence).toEqual(expectedArray);
        });
      });
    });

    describe('displayedRequirementsAndEvidences property changed', () => {
      it('should extract displayedEvidences by current requirement', () => {
        // Arrange
        component.controlRequirement = { requirement_id: 'some-req' };
        const displayedRequirementsAndEvidences = [
          {
            requirement_id: 'some-req',
            evidence_ids: ['id1', 'id2'],
          },
        ];
        component.displayedRequirementsAndEvidences = displayedRequirementsAndEvidences;

        // Act
        component.ngOnChanges({
          displayedRequirementsAndEvidences: new SimpleChange(null, component.displayedRequirementsAndEvidences, true),
        });

        // Assert
        expect(component.displayedEvidences).toEqual(['id1', 'id2']);
      });
    });
  });

  describe('expandCollapseAnimationDone()', () => {
    it('should set displayActionAnimation to false', () => {
      // Arrange
      component.displayActionAnimation = true;
      component.currentFramework = { framework_name: frameworkName };
      component.controlInstance = { control_category: controlCategory, control_name: controlName };
      // Act
      component.expandCollapseReqAnimationDone();

      // Assert
      expect(component.displayActionAnimation).toBeFalsy();
    });
  });

  describe('Automation buttons()', () => {
    it('collect Evidence button should be visible for aplicable requirement', async () => {
      // Arrange
      component.controlRequirement.requirement_related_evidences = [];
      component.controlRequirement.requirement_applicability = true;
      component.currentFramework = { framework_id: 'some-id' };
      component.controlInstance = { control_id: 'some-id' };
      roleService.getCurrentUserRole = jasmine
        .createSpy('getCurrentUserRole')
        .and.callFake(() => of({ role: RoleEnum.Admin }));

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      const btn = fixture.debugElement.query(By.css('#collectEvidenceBtn'));

      expect(btn).toBeTruthy();
    });

    it('link Evidence should not be rendered when requirement_applicability is false', async () => {
      // Arrange
      component.controlRequirement.requirement_applicability = false;
      component.currentFramework = { framework_id: 'some-id' };
      component.controlInstance = { control_id: 'some-id' };

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      const btn = fixture.debugElement.query(By.css('#linkEvidenceBtn'));

      expect(btn).toBeFalsy();
    });

    function expectNoRelevantPluginsBtn(debugElement: DebugElement): void {
      const btn = debugElement.query(By.css('#noRelevantPluginsBtn'));

      expect(btn).toBeTruthy();
      expect(btn.classes['no-relevant-plugins']).toBeTruthy();
    }
  });

  describe('trackEvidenceByIds()', () => {
    it('should return evidence_id value if evidence is provided', () => {
      // Arrange
      const id = 'someId';
      const evidence: EvidenceInstance = { evidence_id: id };

      // Act
      const actual = component.trackEvidenceByIds(0, evidence);

      // Assert
      expect(actual).toBe(id);
    });

    it('should return index evidence is undefined', () => {
      // Arrange
      const index = 11;
      const evidence: EvidenceInstance = undefined;

      // Act
      const actual = component.trackEvidenceByIds(index, evidence);

      // Assert
      expect(actual).toBe(index);
    });
  });

  describe('buildTranslationKey()', () => {
    it('should return full translation key', () => {
      // Arrange
      const relativeKey = 'someKey';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toBe(`requirements.${relativeKey}`);
    });
  });

  // describe('#manualFileSelected', () => {
  //   it('should call requirementService.createManualRequirementEvidence with proper parameters', () => {
  //     // Arrange
  //     const file = new File([], 'file');
  //     component.controlRequirement = { requirement_id: 'some-id' };

  //     // Act
  //     component.manualFileSelected(file);

  //     // Assert
  //     expect(requirementService.createManualRequirementEvidence).toHaveBeenCalledWith('some-id', file);
  //   });

  //   // commented until better solution is found

  //   // it('should add collectingEvidence to array of collectingEvidences after file evidence response', async () => {
  //   //   // Arrange
  //   //   const file = new File([], 'file');
  //   //   component.controlRequirement = { requirement_id: 'some-id' };

  //   //   // Act
  //   //   await component.manualFileSelected(file);

  //   //   // Assert
  //   //   expect(component.collectingEvidences).toContain({
  //   //     evidenceId: evidenceIds[0],
  //   //     serviceId: MANUAL,
  //   //     evidenceType: EvidenceTypeEnum.MANUAL,
  //   //   });
  //   // });
  // });

  // describe('#evidenceCollectionEnd', () => {
  //   it('should remove evidence with passed id from collectingEvidences', () => {
  //     // Arrange
  //     component.collectingEvidences = [
  //       { evidenceId: 'some-id', serviceId: MANUAL, evidenceType: EvidenceTypeEnum.MANUAL },
  //     ];

  //     // Act
  //     component.evidenceCollectionEnd('some-id');

  //     // Assert
  //     expect(component.collectingEvidences).toEqual([]);
  //   });
  // });

  // describe('collecting evidences handler', () => {
  //   it('should add evidence to collectingEvidences when EvidenceCollectionMessages.COLLECTION_STARTED message is received', () => {
  //     // Arrange
  //     component.controlRequirement = { requirement_id: 'some-id' };
  //     const collectingEvidence = {
  //       evidenceId: 'some-id',
  //       serviceId: 'some-service-id',
  //       evidenceType: EvidenceTypeEnum.LINK,
  //     };

  //     // Act
  //     fixture.detectChanges();
  //     messageBusService.sendMessage(EvidenceCollectionMessages.COLLECTION_STARTED, [collectingEvidence], 'some-id');

  //    // Assert
  //    // expect(component.collectingEvidences).toEqual([collectingEvidence]);
  //   });
  // });

  describe('force expand', () => {
    it('should set expanded to true if passed forceExpanded true', () => {
      // Arrange
      component.forceExpanded = true;
      component.currentFramework = { framework_name: frameworkName };
      component.controlInstance = { control_category: controlCategory, control_name: controlName };
      // Act
      fixture.detectChanges();

      // Assert
      expect(component.expanded).toBeTrue();
    });
  });

  describe('requirement focusing', () => {
    it('should subscribe to requirement focusing', async () => {
      // Arrange
      // Act
      fixture.detectChanges();

      // Assert
      expect(controlsFocusingServiceMock.getSpecificRequirementFocusingStream).toHaveBeenCalledWith(component.requirementLike.resourceId);
    });

    it('should scrollInto component`s native element', async () => {
      // Arrange
      controlsFocusingServiceMock.getSpecificRequirementFocusingStream = jasmine.createSpy('getSpecificRequirementFocusingStream').and.callFake(() => of(component.requirementLike.resourceId));
      const componentNativeElement = (fixture.debugElement.nativeElement as HTMLElement);
      componentNativeElement.scrollIntoView = jasmine.createSpy('scrollIntoView');

      // Act
      fixture.detectChanges();

      // Assert
      expect(componentNativeElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    });
  });
});
