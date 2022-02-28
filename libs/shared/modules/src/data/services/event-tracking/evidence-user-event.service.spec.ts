import { TestBed } from '@angular/core/testing';
import { EvidenceUserEventService } from './evidence-user-event.service';
import { EvidenceEventData, EvidenceEventDataProperty, EvidenceSourcesEnum, UserEvents } from 'core';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { ControlsFacadeService, DataAggregationFacadeService } from 'core/modules/data/services';
import { of } from 'rxjs';
import { CalculatedControl, CalculatedRequirement, FrameworkReference, EvidenceLike } from 'core/modules/data/models';
import { EvidenceInstance, EvidenceTypeEnum } from 'core/modules/data/models/domain';
import { configureTestSuite } from 'ng-bullet';

describe('EvidenceUserEventService', () => {
  configureTestSuite();

  let service: EvidenceUserEventService;
  let controlsFacadeMock: ControlsFacadeService;
  let userEventServiceMock: UserEventService;
  let dataAggregationServiceMock: DataAggregationFacadeService;

  const fakeEvidence: EvidenceInstance = {
    evidence_id: 'fake-evidence-id',
    evidence_name: 'fake-evidence-name',
    evidence_type: EvidenceTypeEnum.APP,
  };

  const fakeEvidenceLike: EvidenceLike = {
    evidence: fakeEvidence,
  };

  const fakeEvidenceSource = EvidenceSourcesEnum.EvidencePool;

  const fakeRequirement: CalculatedRequirement = {
    requirement_id: 'fake-requirement-id',
    requirement_name: 'fake-requirement-name',
    requirement_is_custom: true,
    requirement_related_evidences: [fakeEvidenceLike],
  };

  const fakeControl: CalculatedControl = {
    control_id: 'fake-control-id',
    control_name: 'fake-control-name',
    control_collected_all_applicable_evidence_ids: ['fake-evidence-id'],
    control_calculated_requirements: [fakeRequirement],
  };

  const fakeReference: FrameworkReference = {
    framework: {
      framework_id: 'fake-framework-id',
      framework_name: 'fake-framework-name',
    },
    controls: [fakeControl],
  };

  const frameworks_names = ['fake-framework-name', 'fake-framework-name'];

  function createEvent(): EvidenceEventData {
    return {
      [EvidenceEventDataProperty.FrameworkName]: fakeReference.framework.framework_name,
      [EvidenceEventDataProperty.ControlName]: fakeControl.control_name,
      [EvidenceEventDataProperty.RequirementName]: fakeRequirement.requirement_name,
      [EvidenceEventDataProperty.RequirementType]: 'custom made',
      [EvidenceEventDataProperty.EvidenceName]: fakeEvidence.evidence_name,
      [EvidenceEventDataProperty.EvidenceType]: EvidenceTypeEnum.APP.toLowerCase(),
    };
  }

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [
        EvidenceUserEventService,
        { provide: ControlsFacadeService, useValue: {} },
        { provide: UserEventService, useValue: {} },
        { provide: DataAggregationFacadeService, useValue: {} },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(EvidenceUserEventService);
    dataAggregationServiceMock = TestBed.inject(DataAggregationFacadeService);
    dataAggregationServiceMock.getEvidenceReferences = jasmine
      .createSpy('getEvidenceReferences')
      .and.returnValue(of([fakeReference]));

    controlsFacadeMock = TestBed.inject(ControlsFacadeService);
    controlsFacadeMock.getAllControls = jasmine.createSpy('getAllControls').and.returnValue(of([fakeControl]));

    userEventServiceMock = TestBed.inject(UserEventService);
    userEventServiceMock.sendEvent = jasmine.createSpy('sendEvent').and.callFake(() => {});
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#trackCsvExport', () => {
    it(`should send ${UserEvents.EXPORT_EVIDENCE_TO_CSV} event with proper data`, async () => {
      // Arrange

      // Act
      await service.trackCsvExport(
        fakeEvidence.evidence_id,
        fakeEvidence.evidence_name,
        fakeEvidence.evidence_type,
        fakeEvidenceSource
      );

      // Assert
      expect(userEventServiceMock.sendEvent).toHaveBeenCalledOnceWith(UserEvents.EXPORT_EVIDENCE_TO_CSV, {
        ...createEvent(),
        [EvidenceEventDataProperty.Source]: fakeEvidenceSource,
      });
    });
  });

  describe('#trackViewFullData', () => {
    it(`should send ${UserEvents.VIEW_FULL_DATA} event with proper data`, async () => {
      // Arrange

      // Act
      await service.trackViewFullData(fakeEvidence.evidence_id, fakeEvidence.evidence_name, fakeEvidence.evidence_type);

      // Assert
      expect(userEventServiceMock.sendEvent).toHaveBeenCalledOnceWith(UserEvents.VIEW_FULL_DATA, {
        ...createEvent(),
      });
    });
  });

  describe('#trackEvidenceDownload', () => {
    it(`should send ${UserEvents.EVIDENCE_DOWNLOAD} event with proper data`, async () => {
      // Arrange
      // Act
      await service.trackEvidenceDownload(
        fakeEvidence.evidence_id,
        fakeEvidence.evidence_name,
        fakeEvidence.evidence_type,
        fakeEvidenceSource
      );

      // Assert
      expect(userEventServiceMock.sendEvent).toHaveBeenCalledOnceWith(UserEvents.EVIDENCE_DOWNLOAD, {
        ...createEvent(),
        [EvidenceEventDataProperty.Source]: fakeEvidenceSource,
      });
    });
  });

  describe('#trackEvidenceRemove', () => {
    it(`should send ${UserEvents.EVIDENCE_REMOVE} event with proper data`, async () => {
      // Arrange
      // Act
      await service.trackEvidenceRemove(
        fakeEvidence.evidence_id,
        fakeEvidence.evidence_name,
        fakeEvidence.evidence_type
      );

      // Assert
      expect(userEventServiceMock.sendEvent).toHaveBeenCalledOnceWith(UserEvents.EVIDENCE_REMOVE, {
        ...createEvent(),
      });
    });
  });

  describe('#trackLinkedControlClickEvent', () => {
    it(`should send ${UserEvents.EVIDENCE_LINKED} event with proper data`, async () => {
      // Arrange
      const controlsAmount = 5;

      // Act
      service.trackLinkedControlClickEvent(fakeEvidence.evidence_name, frameworks_names, controlsAmount);

      // Assert
      expect(userEventServiceMock.sendEvent).toHaveBeenCalledOnceWith(UserEvents.EVIDENCE_LINKED, {
        [EvidenceEventDataProperty.EvidenceName]: fakeEvidence.evidence_name,
        [EvidenceEventDataProperty.FrameworksLinked]: frameworks_names.join(', '),
        [EvidenceEventDataProperty.AmountOfLinkedControls]: controlsAmount,
      });
    });
  });
});
