import { EvidencePreviewModalsContext } from './../../services/evidence-preview-service/evidence-preview.service';
import { EvidenceFromPolicyModalsContext } from './../../services/evidence-from-policy-preview/evidence-from-policy-preview.service';
import { FullFilePreviewModalComponent } from './../preview/full-file-preview-modal/full-file-preview-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HtmlElementReferenceDirective } from 'core/modules/directives';
import { ModalWindowService } from 'core/modules/modals';
import { EvidenceInstance, EvidenceStatusEnum, EvidenceTypeEnum } from 'core/modules/data/models/domain';
import { EvidenceFacadeService, EvidenceService, OperationsTrackerService } from 'core/modules/data/services';
import { reducers } from 'core/modules/data/store';
import { ANECDOTES_EVIDENCE_ID } from 'core/utils/userflow';
import { configureTestSuite } from 'ng-bullet';
import { Observable, of } from 'rxjs';
import {
  FileDownloadingHelperService,
  MessageBusService,
  RouterExtensionService,
  WindowHelperService
} from 'core';
import { SharedContextAccessorDirective } from '../../directives';
import { EvidenceItemComponent } from './evidence-item.component';
import { EvidenceUserEventService } from 'core/modules/data/services/event-tracking/evidence-user-event.service';
import { PolicyModalService } from 'core/modules/shared-policies/services';
import { EvidenceSourcesEnum } from '../../models';
import { ResourceType } from 'core/modules/data/models';
import { ControlContextService, ControlsFocusingService, EvidencePreviewService, EvidenceFromPolicyPreviewService } from 'core/modules/shared-controls/services';

describe('EvidenceItemComponent', () => {
  configureTestSuite();

  let component: EvidenceItemComponent;
  let fixture: ComponentFixture<EvidenceItemComponent>;
  let evidenceService: EvidenceService;
  let operationsTrackerService: OperationsTrackerService;
  let modalWindowService: ModalWindowService;
  let windowHelperService: WindowHelperService;
  let fileDownloadingHelperService: FileDownloadingHelperService;
  let store: MockStore;
  let windowMock: Window;
  let evidenceFacadeService: EvidenceFacadeService;
  let evidenceEventService: EvidenceUserEventService;
  let controlsFocusingServiceMock: ControlsFocusingService;
  let evidencePreviewService: EvidencePreviewService;
  let evidenceFromPolicyPreviewService: EvidenceFromPolicyPreviewService;

  let icon: Observable<string>;
  const evidence: EvidenceInstance = {
    evidence_is_custom: true,
  };

  async function detectChanges(): Promise<any> {
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    await fixture.whenStable();
  }

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      providers: [
        MessageBusService,
        provideMockStore(),
        {
          provide: EvidenceService,
          useValue: {
            getEvidencePreview(): Observable<string> {
              return of('{}');
            },
          },
        },
        OperationsTrackerService,
        { provide: FileDownloadingHelperService, useValue: {} },
        {
          provide: WindowHelperService,
          useValue: {
            openUrlInNewTab: () => {},
            getWindow: jasmine.createSpy('getWindow').and.returnValue({
              localStorage: { getItem: jasmine.createSpy('getItem') },
            }),
          },
        },
        { provide: ControlContextService, useValue: {} },
        { provide: ModalWindowService, useValue: {} },
        { provide: EvidenceFacadeService, useValue: {} },
        { provide: RouterExtensionService, useValue: {} },
        { provide: EvidenceUserEventService, useValue: {} },
        { provide: PolicyModalService, useValue: {} },
        { provide: ControlsFocusingService, useValue: {} },
        { provide: EvidencePreviewService, useValue: {} },
        { provide: evidenceFromPolicyPreviewService, useValue: {} },

      ],
      declarations: [EvidenceItemComponent, HtmlElementReferenceDirective, SharedContextAccessorDirective],
      imports: [
        StoreModule.forRoot(reducers),
        MatMenuModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        NoopAnimationsModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidenceItemComponent);
    component = fixture.componentInstance;

    evidenceService = TestBed.inject(EvidenceService);
    evidenceService.getIcon = jasmine.createSpy('getIcon').and.callFake(() => icon);
    evidenceService.downloadEvidence = jasmine.createSpy('downloadEvidence').and.returnValue(of());

    operationsTrackerService = TestBed.inject(OperationsTrackerService);
    store = TestBed.inject(MockStore);
    store.dispatch = jasmine.createSpy('dispatch');

    modalWindowService = TestBed.inject(ModalWindowService);
    modalWindowService.open = jasmine.createSpy('open');
    modalWindowService.openInSwitcher = jasmine.createSpy('openInSwitcher');

    evidenceFacadeService = TestBed.inject(EvidenceFacadeService);
    evidenceFacadeService.updateEvidence = jasmine.createSpy('updateEvidence');
    evidenceFacadeService.setMitigatedStatus = jasmine.createSpy('setMitigatedStatus');

    evidenceEventService = TestBed.inject(EvidenceUserEventService);
    evidenceEventService.trackEvidenceRemove = jasmine.createSpy('trackEvidenceRemove');

    windowHelperService = TestBed.inject(WindowHelperService);
    windowMock = {
      location: { origin: 'some-origin' } as Location,
    } as Window;
    windowHelperService.getWindow = jasmine.createSpy('getWindow').and.returnValue(windowMock);

    fileDownloadingHelperService = TestBed.inject(FileDownloadingHelperService);
    controlsFocusingServiceMock = TestBed.inject(ControlsFocusingService);
    controlsFocusingServiceMock.getSpecificEvidenceFocusingStream = jasmine
      .createSpy('getSpecificEvidenceFocusingStream')
      .and.callFake(() => of());

    evidencePreviewService = TestBed.inject(EvidencePreviewService);
    evidencePreviewService.openEvidencePreviewModal = jasmine.createSpy('openEvidencePreviewModal');

    evidenceFromPolicyPreviewService = TestBed.inject(EvidenceFromPolicyPreviewService);
    evidenceFromPolicyPreviewService.openEvidenceFromPolicyPreviewModal = jasmine.createSpy('openEvidencePreviewModal');

    component.evidence = evidence;
    component.requirementLike = { resource: {} };
    component.evidenceLike = {
      evidence: evidence,
      resourceType: ResourceType.Evidence
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('buildTranslationKey', () => {
    it('should return correct translation key', () => {
      // Arrange
      const relativeKey = 'fakeKey';

      // Act
      const actualTranslationKey = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actualTranslationKey).toBe(`evidences.${relativeKey}`);
    });
  });

  describe('forceExpand', () => {
    it('should expand when force expand is true', () => {
      // act
      component.forceExpand = true;

      // assert
      expect(component.previewOpened).toBeTrue();
    });

    it('shouldnt expand when force expand is false', () => {
      // act
      component.forceExpand = false;

      // assert
      expect(component.previewOpened).toBeFalsy();
    });
  });

  describe('host bindings', () => {
    it('should set ignored class on host if evidence is ignored', async () => {
      // Arrange
      evidence.evidence_is_applicable = false;

      // Act
      await detectChanges();

      // Assert
      expect(fixture.nativeElement.classList.contains('ignored')).toBeTruthy();
    });

    it('should not set ignored class on host if evidence is not ignored', async () => {
      // Arrange
      evidence.evidence_is_applicable = true;

      // Act
      await detectChanges();

      // Assert
      expect(fixture.nativeElement.classList.contains('ignored')).toBeFalsy();
    });

    it('should set view-preview-mode class on host if viewPreviewMode is true', async () => {
      // Arrange
      component.viewPreviewMode = true;

      // Act
      await detectChanges();

      // Assert
      expect(fixture.nativeElement.classList.contains('view-preview-mode')).toBeTruthy();
    });

    it('should not set view-preview-mode class on host if viewPreviewMode is false', async () => {
      // Arrange
      component.viewPreviewMode = false;

      // Act
      await detectChanges();

      // Assert
      expect(fixture.nativeElement.classList.contains('view-preview-mode')).toBeFalsy();
    });

    it('should set preview-opened class on host if previewOpened is true', async () => {
      // Arrange
      component.previewOpened = true;

      // Act
      await detectChanges();

      // Assert
      expect(fixture.nativeElement.classList.contains('preview-opened')).toBeTruthy();
    });

    it('should not set preview-opened class on host if previewOpened is false', async () => {
      // Arrange
      component.previewOpened = false;

      // Act
      await detectChanges();

      // Assert
      expect(fixture.nativeElement.classList.contains('preview-opened')).toBeFalsy();
    });

    it('should not set line-through class on host if evidence is applicable', async () => {
      // Arrange
      evidence.evidence_is_applicable = true;

      // Act
      await detectChanges();

      // Assert
      expect(fixture.nativeElement.classList.contains('line-through')).toBeFalsy();
    });

    it('should set line-through class on host if evidence is not applicable', async () => {
      // Arrange
      evidence.evidence_is_applicable = false;

      // Act
      await detectChanges();

      // Assert
      expect(fixture.nativeElement.classList.contains('line-through')).toBeTruthy();
    });

    it('should not set opacity-50 class on host if evidence is applicable', async () => {
      // Arrange
      evidence.evidence_is_applicable = true;

      // Act
      await detectChanges();

      // Assert
      expect(fixture.nativeElement.classList.contains('opacity-50')).toBeFalsy();
    });

    it('should set opacity-50 class on host if evidence is not applicable', async () => {
      // Arrange
      evidence.evidence_is_applicable = false;

      // Act
      await detectChanges();

      // Assert
      expect(fixture.nativeElement.classList.contains('opacity-50')).toBeTruthy();
    });
  });

  describe('#ngOnInit', () => {
    it('should set isAnecdotesEvidence to true if evidence belongs to anecdotes', async () => {
      // Arrange
      evidence.evidence_id = ANECDOTES_EVIDENCE_ID;

      // Act
      await detectChanges();

      // Assert
      expect(component.isAnecdotesEvidence).toBeTrue();
    });

    it('should set isAnecdotesEvidence to false if evidence does not belong to anecdotes', async () => {
      // Arrange
      evidence.evidence_id = 'some-id';

      // Act
      await detectChanges();

      // Assert
      expect(component.isAnecdotesEvidence).toBeFalse();
    });
  });

  describe('#ngOnChanges', () => {
    let changes: SimpleChanges;

    beforeEach(() => {
      changes = {
        evidence: {
          previousValue: undefined,
          firstChange: true,
          currentValue: { evidence },
          isFirstChange: () => true,
        },
      };
    });

    describe(`Evidence type is ${EvidenceTypeEnum.UNKNOWN}`, () => {
      it('should not display evidence-tabular-preview or file-preview', async () => {
        // Arrange
        evidence.evidence_type = EvidenceTypeEnum.UNKNOWN;
        component.previewOpened = true;

        // Act
        component.ngOnChanges(changes);
        fixture.detectChanges();
        await fixture.whenStable();

        // Assert
        expect(fixture.debugElement.query(By.css('app-file-preview'))).toBeFalsy();
        expect(fixture.debugElement.query(By.css('app-evidence-tabular-preview'))).toBeFalsy();
      });
    });
  });

  describe('#toggleEvidenceApplicability', () => {
    const requirement_id = 'someGroupId';
    const control_id = 'someControlId';

    let operationsTrackerReturnValue: Error | any;

    beforeEach(() => {
      operationsTrackerReturnValue = {};
      operationsTrackerService.getOperationStatus = jasmine
        .createSpy('getOperationStatus')
        .and.callFake(() => of(operationsTrackerReturnValue));

      component.requirementLike = {
        resource: {
          requirement_id: requirement_id,
        },
      };
      component.controlInstance = {
        control_id,
      };
    });

    it('should updateEvidence with evidence when toggle evidence applicability', async () => {
      // Arrange
      evidence.evidence_id = 'evidence-id';

      // Act
      await component.toggleEvidenceApplicability();

      // Assert
      expect(evidenceFacadeService.updateEvidence).toHaveBeenCalledWith(evidence);
    });

    it('should set previewOpened to false after applicability changed', async () => {
      // Act
      await component.toggleEvidenceApplicability();

      // Assert
      expect(component.previewOpened).toBeFalse();
    });

    it('should set displayActionLoader to false after applicability changed', async () => {
      // Act
      await component.toggleEvidenceApplicability();

      // Assert
      expect(component.displayActionLoader).toBeFalse();
    });

    it('should call setEvidenceMitigatedStatus after applicability changed if evidence is in status NEW', async () => {
      // Arrange
      evidence.evidence_status = EvidenceStatusEnum.NEW;
      component.controlRequirement = {
        requirement_id: 'fakeReqId',
      };
      component.controlInstance = {
        control_id: 'fakeControlId',
      };
      component.framework = {
        framework_id: 'fakeFrameworkId',
      };
      component.setMitigatedStatusForNewEvidence();

      // Act
      await component.toggleEvidenceApplicability();

      // Assert
      expect(evidenceFacadeService.setMitigatedStatus).toHaveBeenCalledWith(
        component.evidence,
        component.controlRequirement.requirement_id,
        component.controlInstance.control_id,
        component.framework.framework_id
      );
    });

    it('should NOT call setEvidenceMitigatedStatus after applicability changed if evidence is NOT in status NEW', async () => {
      // Arrange
      evidence.evidence_status = EvidenceStatusEnum.MITIGATED;
      component.setMitigatedStatusForNewEvidence();

      // Act
      await component.toggleEvidenceApplicability();

      // Assert
      expect(evidenceFacadeService.setMitigatedStatus).not.toHaveBeenCalled();
    });
  });

  describe('#confirmRemoving', () => {
    const requirement_id = 'someGroupId';
    const control_id = 'someControlId';

    let operationsTrackerReturnValue: Error | any;

    beforeEach(() => {
      operationsTrackerReturnValue = {};
      operationsTrackerService.getOperationStatus = jasmine
        .createSpy('getOperationStatus')
        .and.callFake(() => of(operationsTrackerReturnValue));

      component.requirementLike = {
        resource: {
          requirement_id: requirement_id,
        },
      };
      component.controlInstance = {
        control_id,
      };
      component.controlRequirement = {
        requirement_id: requirement_id,
      };
      fixture.detectChanges();
    });

    it('should set displayActionLoader to true', () => {
      // Arrange
      component.displayActionLoader = false;

      // Act
      component.toggleEvidenceApplicability();

      // Assert
      expect(component.displayActionLoader).toBeTruthy();
    });

    it('should remove evidence', async () => {
      // Act
      await component.confirmRemoving();

      // Assert
      // expect(store.dispatch).toHaveBeenCalledWith(
      //   new RemoveEvidenceFromResourceAction(ResourceType.Requirement, requirement_id, evidence.evidence_id)
      // );
      // expect(operationsTrackerService.getOperationStatus).toHaveBeenCalledWith(
      //   evidence.evidence_id,
      //   TrackOperations.EVIDENCE_REMOVE_LINK
      // );
    });

    it('should set displayActionLoader to false after evidence removed', async () => {
      // Act
      await component.toggleEvidenceApplicability();

      // Assert
      expect(component.displayActionLoader).toBeFalse();
    });
  });

  describe('#remove', () => {
    it('should open modal window', () => {
      // Act
      component.remove();

      // Assert
      expect(modalWindowService.open).toHaveBeenCalled();
    });
  });

  describe('#openLink', () => {
    it('should call openUrlInNewTab with proper parameters', () => {
      // Arrange
      spyOn(windowHelperService, 'openUrlInNewTab');
      evidence.evidence_url = 'some-url';

      // Act
      component.openLink();

      // Assert
      expect(windowHelperService.openUrlInNewTab).toHaveBeenCalledWith(evidence.evidence_url);
    });
  });

  describe('#downloadEvidence', () => {
    let file: File;

    beforeEach(() => {
      evidenceService.downloadEvidence = jasmine.createSpy('downloadEvidence').and.callFake(() => of(file));
      fileDownloadingHelperService.downloadFile = jasmine.createSpy('downloadFile');
    });

    it('should call evidenceService.downloadEvidence with proper parameters', () => {
      // Arrange
      evidence.evidence_instance_id = 'some-instance-id';

      // Act
      component.downloadEvidence();

      // Assert
      expect(evidenceService.downloadEvidence).toHaveBeenCalledWith(evidence.evidence_instance_id);
    });

    it('should call fileDownloadingHelperService.downloadFile with file result', async () => {
      // Arrange
      file = new File([], 'name');

      // Act
      await component.downloadEvidence();

      // Assert
      expect(fileDownloadingHelperService.downloadFile).toHaveBeenCalledWith(file);
    });
  });

  describe('#ignoreClick', () => {
    it('should call toggleEvidenceApplicability if requirement is not approved', () => {
      // Arrange
      component.requirementLike = { resource: { requirement_id: 'some_id', requirement_related_policies_ids: [] } };
      spyOn(component, 'toggleEvidenceApplicability');
      fixture.detectChanges();

      // Act
      component.ignoreClick();

      // Assert
      expect(component.toggleEvidenceApplicability).toHaveBeenCalled();
    });
  });

  describe('#rowClick', () => {
    beforeEach(() => {
      component.viewPreviewMode = false;
      evidence.evidence_is_applicable = true;
    });

    it('should call open with fullDataModalParameters if evidenceSource is Controls and the evidence not of policy type ', () => {
      // Arrange
      component.evidenceSource = EvidenceSourcesEnum.Controls;

      component.controlRequirement = {
        requirement_name: 'requirement_name',
      };

      component.controlInstance = {
        control_name: 'control_name',
      };

      // Act
      fixture.debugElement.query(By.css('.evidence-element')).nativeElement.click();

      // Assert
      expect(evidencePreviewService.openEvidencePreviewModal).toHaveBeenCalledWith({
        eventSource: component.evidenceSource,
        evidence: component.evidenceLike.evidence,
        entityPath: ['control_name', 'requirement_name']
      } as EvidencePreviewModalsContext);
    });

    it('should call open with fullDataModalParameters if evidenceSource is Controls and the evidence of policy type ', () => {
      // Arrange
      component.evidenceSource = EvidenceSourcesEnum.Controls;

      spyOnProperty(component, 'isPolicyEvidence').and.returnValue(true);

      component.controlRequirement = {
        requirement_name: 'requirement_name',
      };

      component.controlInstance = {
        control_name: 'control_name',
      };

      // Act
      fixture.debugElement.query(By.css('.evidence-element')).nativeElement.click();

      // Assert
      expect(evidenceFromPolicyPreviewService.openEvidenceFromPolicyPreviewModal).toHaveBeenCalledWith({
        eventSource: component.evidenceSource,
        evidenceLike: component.evidenceLike,
        entityPath: ['control_name', 'requirement_name']
      } as EvidenceFromPolicyModalsContext);
    });

    it('should call setMitigatedStatusForNewEvidence if evidence is not ignored & is not preview mode & preview supported & click is not on actions or statuses & evidence is in status NEW', () => {
      // Arrange
      evidence.evidence_status = EvidenceStatusEnum.NEW;

      component.controlRequirement = {
        requirement_id: 'fakeReqId',
      };
      component.controlInstance = {
        control_id: 'fakeControlId',
      };
      component.framework = {
        framework_id: 'fakeFrameworkId',
      };

      component.setMitigatedStatusForNewEvidence();

      // Act
      fixture.debugElement.query(By.css('.evidence-element')).nativeElement.click();

      // Assert
      expect(evidenceFacadeService.setMitigatedStatus).toHaveBeenCalledWith(
        component.evidence,
        component.controlRequirement.requirement_id,
        component.controlInstance.control_id,
        component.framework.framework_id
      );
    });
  });

  describe('openFullData()', () => {
    it('should openInSwitcher with proper parameters', async () => {
      // Arrange
      const id = 'full-file-preview-modal';
      const file = new File([], 'name');
      component.evidence = { evidence_id: 'evId' };
      component.requirementLike = { resource: { requirement_id: 'some_id', requirement_related_policies_ids: [] } };

      const expectedObjToCall = {
        id: 'full-file-preview-modal',
        context: {
          evidence: component.evidence,
          file: file,
          entityPath: [component.requirementLike.name],
        },
        componentsToSwitch: [
          {
            id: id,
            componentType: FullFilePreviewModalComponent,
          },
        ],
      };

      // Act
      await detectChanges();
      await component.viewDocument();

      // Assert
      expect(modalWindowService.openInSwitcher).toHaveBeenCalledWith(expectedObjToCall);
    });
  });

  describe('evidence focusing', () => {
    it('should subscribe to requirement focusing', async () => {
      // Arrange
      // Act
      fixture.detectChanges();

      // Assert
      expect(controlsFocusingServiceMock.getSpecificEvidenceFocusingStream).toHaveBeenCalledWith(
        component.evidence.evidence_id
      );
    });

    it('should scrollInto component`s native element', async () => {
      // Arrange
      controlsFocusingServiceMock.getSpecificEvidenceFocusingStream = jasmine
        .createSpy('getSpecificRequirementFocusingStream')
        .and.callFake(() => of(component.requirementLike.resourceId));
      const componentNativeElement = fixture.debugElement.nativeElement as HTMLElement;
      componentNativeElement.scrollIntoView = jasmine.createSpy('scrollIntoView');

      // Act
      fixture.detectChanges();

      // Assert
      expect(componentNativeElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    });
  });
});
