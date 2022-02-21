import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EvidenceMitigationMarkComponent } from './evidence-mitigation-mark.component';
import { EvidenceFacadeService } from 'core/modules/data/services/';
import { EvidenceInstance, EvidenceStatusEnum, EvidenceTypeEnum } from 'core/modules/data/models/domain';

describe('EvidenceNotMitigatedMarkComponent', () => {
  let component: EvidenceMitigationMarkComponent;
  let fixture: ComponentFixture<EvidenceMitigationMarkComponent>;
  const evidence: EvidenceInstance = {
    evidence_is_custom: true,
  };
  let evidenceFacadeServiceMock: EvidenceFacadeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EvidenceMitigationMarkComponent],
      providers: [{ provide: EvidenceFacadeService, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidenceMitigationMarkComponent);
    component = fixture.componentInstance;
    component.evidence = evidence;
    evidenceFacadeServiceMock = TestBed.inject(EvidenceFacadeService);
    evidenceFacadeServiceMock.setNotMitigatedStatus = jasmine.createSpy('setNotMitigatedStatus');
    evidenceFacadeServiceMock.setMitigatedStatus = jasmine.createSpy('setMitigatedStatus');
  });

  describe('#setEvidenceNotMitigatedStatus', () => {
    it(`should dispatch SetEvidenceStatusAction with proper parameters and with status ${EvidenceStatusEnum.NOTMITIGATED}`, () => {
      // Arrange
      fixture.detectChanges();
      component.evidence = {
        evidence_is_custom: true,
      };
      component.controlRequirement = {
        requirement_id: 'fakeReqId',
      };
      component.controlInstance = {
        control_id: 'fakeControlId',
      };
      component.framework = {
        framework_id: 'fakeFrameworkId',
      };

      // Act
      component.setEvidenceNotMitigatedStatus(new MouseEvent('click'));

      // Assert
      expect(evidenceFacadeServiceMock.setNotMitigatedStatus).toHaveBeenCalledWith(
        component.evidence,
        component.controlRequirement.requirement_id,
        component.controlInstance.control_id,
        component.framework.framework_id
      );
    });
  });

  describe('#setEvidenceMitigatedStatus', () => {
    it(`should dispatch SetEvidenceStatusAction with proper parameters and with status ${EvidenceStatusEnum.MITIGATED}`, () => {
      // Arrange
      fixture.detectChanges();
      component.evidence = {
        evidence_is_custom: true,
      };
      component.controlRequirement = {
        requirement_id: 'fakeReqId',
      };
      component.controlInstance = {
        control_id: 'fakeControlId',
      };
      component.framework = {
        framework_id: 'fakeFrameworkId',
      };

      // Act
      component.setEvidenceMitigatedStatus(new MouseEvent('click'));

      // Assert
      expect(evidenceFacadeServiceMock.setMitigatedStatus).toHaveBeenCalledWith(
        component.evidence,
        component.controlRequirement.requirement_id,
        component.controlInstance.control_id,
        component.framework.framework_id
      );
    });
  });

  describe(`isEvidenceStatusDisplayed`, () => {
    [
      { evidenceType: EvidenceTypeEnum.APP, expected: true },
      { evidenceType: EvidenceTypeEnum.CONFIGURATION, expected: true },
      { evidenceType: EvidenceTypeEnum.LOG, expected: true },
      { evidenceType: EvidenceTypeEnum.UNKNOWN, expected: true },
      { evidenceType: EvidenceTypeEnum.LIST, expected: true },
      { evidenceType: EvidenceTypeEnum.MANUAL, expected: true },
      { evidenceType: EvidenceTypeEnum.LINK, expected: true },
      { evidenceType: EvidenceTypeEnum.DOCUMENT, expected: false },
    ].forEach((testcase) => {
      it(`when evidenceType is "${testcase.evidenceType}" isEvidenceStatusDisplayed should be set to "${testcase.expected}" `, async () => {
        // Arrange
        evidence.evidence_is_applicable = true;
        // Act
        evidence.evidence_type = testcase.evidenceType;
        // Assert
        expect(component.isEvidenceStatusDisplayed).toEqual(testcase.expected);
      });
    });
  });
});
