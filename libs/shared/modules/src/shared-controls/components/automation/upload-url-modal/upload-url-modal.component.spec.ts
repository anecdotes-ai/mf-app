import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MANUAL } from 'core/modules/data/constants';
import { ModalWindowService } from 'core/modules/modals';
import { EvidenceFacadeService, RequirementService, RequirementsFacadeService } from 'core/modules/data/services';
import { spyOnMessageBusMethods } from 'core/utils/testing';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { UploadUrlModalComponent } from './upload-url-modal.component';
import { EvidenceTypeEnum } from 'core/modules/data/models/domain';
import { MessageBusService } from 'core/services/message-bus/message-bus.service';
import { EvidenceCollectionMessages } from 'core/services/message-bus/constants/evidence-collection-messages.constants';

describe('UploadUrlModalComponent', () => {
  configureTestSuite();

  let component: UploadUrlModalComponent;
  let fixture: ComponentFixture<UploadUrlModalComponent>;

  let requirementService: RequirementService;
  let messageBusService: MessageBusService;
  let modalWindowService: ModalWindowService;
  let evidencesFacade: EvidenceFacadeService;

  const evidenceIds: string[] = ['id1', 'id2'];
  const requirement_id = 'requirement-id';
  const evidence_id = 'evidence-id';
  const framework_id = 'framework-id';
  const control_id = 'control-id';
  const evidence_url = 'some-url';
  const evidence_name = 'some-name';

  let updatedEvidence;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MessageBusService, useValue: {} },
        { provide: ModalWindowService, useValue: {} },
        { provide: RequirementService, useValue: {} },
        { provide: EvidenceFacadeService, useValue: {} },
        { provide: RequirementsFacadeService, useValue: {} },
      ],
      imports: [TranslateModule.forRoot()],
      declarations: [UploadUrlModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadUrlModalComponent);
    component = fixture.componentInstance;
    requirementService = TestBed.inject(RequirementService);
    requirementService.updateRequirementUrlEvidence = jasmine
      .createSpy('updateRequirementUrlEvidence')
      .and.returnValue(of());

    messageBusService = TestBed.inject(MessageBusService);
    spyOnMessageBusMethods(messageBusService);

    modalWindowService = TestBed.inject(ModalWindowService);
    modalWindowService.close = jasmine.createSpy('close');

    evidencesFacade = TestBed.inject(EvidenceFacadeService);
    evidencesFacade.getEvidence = jasmine.createSpy('getEvidence').and.callFake(() => of(updatedEvidence));
    evidencesFacade.createRequirementUrlEvidenceAsync = jasmine
      .createSpy('createRequirementUrlEvidence')
      .and.callFake(() => evidenceIds);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
        beforeEach(() => {
      component.controlRequirement = { requirement_id };
      component.evidence = { evidence_id, evidence_url, evidence_name };
      component.controlInstance = {control_id};
      component.framework = {framework_id};
    });
    it('should set current evidence values to form in edit mode', () => {
      // Arrange
      component.isEditMode = true;

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.form.value).toEqual({ url: evidence_url, evidenceName: evidence_name });
    });
  });

  describe('#buildTranslationKey', () => {
    it('should correctly build translation key', () => {
      // Arrange
      const relativeKey = 'some-key';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toEqual(`uploadUrlModal.${relativeKey}`);
    });
  });

  describe('#addUrl', () => {
    const url = 'some-url';
    const evidenceName = 'some-name';
    const requirement_id = 'requirement-id';
    const controlName = 'controlName';
    const controlCategory = 'controlCategory';
    const requirementName = 'requirementName';
    const frameworkName = 'frameworkName';

    beforeEach(() => {
      component.form.setValue({ url, evidenceName });
      component.controlRequirement = { requirement_id: requirement_id, requirement_name: requirementName };
      component.framework = { framework_name: frameworkName, framework_id };
      component.controlInstance = { control_category: controlCategory, control_name: controlName, control_id };
    });

    it('isLoading$ should emit true', () => {
      // Act
      component.addUrl();

      // Assert
      expect(component.isLoading$.value).toBeTrue();
    });

    it('should call requirementService.createRequirementUrlEvidence with proper parameters', () => {
      // Act
      component.addUrl();

      // Assert
      expect(evidencesFacade.createRequirementUrlEvidenceAsync).toHaveBeenCalledWith(
        evidence_url, requirement_id, evidenceName, control_id, framework_id
      );
    });

    // tslint:disable-next-line: max-line-length
    it('should call messageBusService.sendMessage with EvidenceCollectionMessages.COLLECTION_STARTED as key, requirement_id as partition key and collectingEvidences formed from response', async () => {
      // Arrange
      const collectingEvidences = evidenceIds.map((evidenceId) => {
        return {
          evidenceId,
          serviceId: MANUAL,
          evidenceType: EvidenceTypeEnum.URL,
        };
      });

      // Act
      await component.addUrl();

      // Assert
      expect(messageBusService.sendMessage).toHaveBeenCalledWith(
        EvidenceCollectionMessages.COLLECTION_STARTED,
        collectingEvidences,
        requirement_id
      );
    });

    it('should close modal', async () => {
      // Act
      await component.addUrl();

      // Assert
      expect(modalWindowService.close).toHaveBeenCalled();
    });

    it('isLoading$ should emit false when method executed', async () => {
      // Act
      await component.addUrl();

      // Assert
      expect(component.isLoading$.value).toBeFalse();
    });
  });

  describe('#updateUrl', () => {
    const url = 'some-url';
    const evidenceName = 'some-name';
    const requirement_id = 'requirement-id';
    const evidence_id = 'evidence-id';

    beforeEach(() => {
      component.form.setValue({ url, evidenceName });
      component.controlRequirement = { requirement_id };
      component.evidence = { evidence_id };
    });

    it('isLoading$ should emit true', () => {
      // Act
      component.updateUrl();

      // Assert
      expect(component.isLoading$.value).toBeTrue();
    });

    it('should call requirementService.updateRequirementUrlEvidence with proper parameters', () => {
      // Act
      component.updateUrl();

      // Assert
      expect(requirementService.updateRequirementUrlEvidence).toHaveBeenCalledWith(
        requirement_id,
        evidence_id,
        url,
        evidenceName
      );
    });

    it('should close modal if updated evidence found in state', async () => {
      // Arrange
      updatedEvidence = { evidence_name: evidenceName, evidence_url: url };

      // Act
      await component.updateUrl();

      // Assert
      expect(modalWindowService.close).toHaveBeenCalled();
    });

    it('isLoading$ should emit false when method executed', async () => {
      // Act
      await component.updateUrl();

      // Assert
      expect(component.isLoading$.value).toBeFalse();
    });
  });
});
