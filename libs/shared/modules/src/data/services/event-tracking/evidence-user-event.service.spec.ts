import { TestBed } from '@angular/core/testing';

import { EvidenceUserEventService } from './evidence-user-event.service';
import {
  EvidenceEventData,
  EvidenceEventDataProperty,
  MessageBusService,
  RouterExtensionService,
  UserEvents
} from 'core';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { ControlsFacadeService, FrameworksFacadeService, RequirementsFacadeService } from 'core/modules/data/services';
import { of } from 'rxjs';
import { CalculatedControl, CalculatedRequirement } from 'core/modules/data/models';
import { Framework } from 'core/modules/data/models/domain';

describe('EvidenceUserEventService', () => {
  let service: EvidenceUserEventService;
  let requirementsFacadeMock: RequirementsFacadeService;
  let controlsFacadeMock: ControlsFacadeService;
  let frameworksFacadeMock: FrameworksFacadeService;
  let userEventServiceMock: UserEventService;

  const fakeFramework: Framework = {
    framework_id: 'fake-framework-id',
    framework_name: 'fake-framework-name',
  };

  const fakeControl: CalculatedControl = {
    control_id: 'fake-control-id',
    control_name: 'fake-control-name',
  };

  const fakeRequirement: CalculatedRequirement = {
    requirement_id: 'fake-requirement-id',
    requirement_name: 'fake-requirement-name',
    requirement_is_custom: true
  };

  const frameworks_names = 'some framework names';
  const evidenceType = 'some-evidence-type';
  const evidenceName = 'some-evidence-name';
  const eventSource = 'some-event-source';

  function createEvent(): EvidenceEventData {
    return {
      [EvidenceEventDataProperty.FrameworkName]: fakeFramework ? fakeFramework.framework_name : frameworks_names,
      [EvidenceEventDataProperty.ControlName]: fakeControl.control_name,
      [EvidenceEventDataProperty.RequirementName]: fakeRequirement.requirement_name,
      [EvidenceEventDataProperty.RequirementType]: fakeRequirement.requirement_is_custom ? 'custom made' : 'existed',
    };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MessageBusService, useValue: {} },
        { provide: RouterExtensionService, useValue: {} },
        { provide: RequirementsFacadeService, useValue: {} },
        { provide: ControlsFacadeService, useValue: {} },
        { provide: FrameworksFacadeService, useValue: {} },
        { provide: UserEventService, useValue: {} }
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(EvidenceUserEventService);
    requirementsFacadeMock = TestBed.inject(RequirementsFacadeService);
    controlsFacadeMock = TestBed.inject(ControlsFacadeService);
    frameworksFacadeMock = TestBed.inject(FrameworksFacadeService);

    userEventServiceMock = TestBed.inject(UserEventService);
    userEventServiceMock.sendEvent = jasmine.createSpy('sendEvent');

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('event tracking methods', () => {
    beforeEach(() => {
      frameworksFacadeMock.getFrameworkById = jasmine
        .createSpy('getFrameworkById')
        .and.callFake(() => of(fakeFramework));
      controlsFacadeMock.getControl = jasmine.createSpy('getControl').and.callFake(() => of(fakeControl));
      requirementsFacadeMock.getRequirement = jasmine
        .createSpy('getRequirement')
        .and.callFake(() => of(fakeRequirement));
    });

    describe('trackCscExport', () => {

      it(`should send event with data`, async () => {
        // Arrange
        const eventData: EvidenceEventData = {
          [EvidenceEventDataProperty.FrameworkName]: fakeFramework.framework_name,
          [EvidenceEventDataProperty.ControlName]: fakeControl.control_name,
          [EvidenceEventDataProperty.RequirementName]: fakeRequirement.requirement_name
        };
        const eventType: UserEvents = UserEvents.ADD_EVIDENCE_URL;

        // Act
        await service.sendEvidenceEvent(
          eventType,
          eventData
        );

        // Assert
        expect(userEventServiceMock.sendEvent).toHaveBeenCalledOnceWith(eventType, eventData);
      });
    });

    describe('trackCscExport', () => {

      it(`should send ${UserEvents.EXPORT_EVIDENCE_TO_CSV} event with proper data`, async () => {
        // Arrange

        // Act
        await service.trackCsvExport(
          fakeFramework.framework_id,
          fakeControl.control_id,
          fakeRequirement.requirement_id,
          evidenceName,
          evidenceType,
          eventSource,
          ''
        );

        // Assert
        expect(userEventServiceMock.sendEvent).toHaveBeenCalledOnceWith(UserEvents.EXPORT_EVIDENCE_TO_CSV, {
          ...createEvent(),
          [EvidenceEventDataProperty.EvidenceName]: evidenceName,
          [EvidenceEventDataProperty.EvidenceType]: evidenceType.toLowerCase(),
          [EvidenceEventDataProperty.Source]: eventSource
        });
      });
    });

    describe('trackViewFullData', () => {

      it(`should send ${UserEvents.VIEW_FULL_DATA} event with proper data`, async () => {
        // Arrange

        // Act
        await service.trackViewFullData(
          fakeFramework.framework_id,
          fakeControl.control_id,
          fakeRequirement.requirement_id,
          evidenceName,
          evidenceType,
          ''
        );

        // Assert
        expect(userEventServiceMock.sendEvent).toHaveBeenCalledOnceWith(UserEvents.VIEW_FULL_DATA, {
          ...createEvent(),
          [EvidenceEventDataProperty.EvidenceName]: evidenceName,
          [EvidenceEventDataProperty.EvidenceType]: evidenceType.toLowerCase(),
        });
      });
    });

    describe('trackEvidenceDownload', () => {

      it(`should send ${UserEvents.EVIDENCE_DOWNLOAD} event with proper data`, async () => {
        // Arrange

        // Act
        await service.trackEvidenceDownload(
          fakeFramework.framework_id,
          fakeControl.control_id,
          fakeRequirement.requirement_id,
          evidenceName,
          evidenceType,
          eventSource,
          ''
        );

        // Assert
        expect(userEventServiceMock.sendEvent).toHaveBeenCalledOnceWith(UserEvents.EVIDENCE_DOWNLOAD, {
          ...createEvent(),
          [EvidenceEventDataProperty.EvidenceName]: evidenceName,
          [EvidenceEventDataProperty.EvidenceType]: evidenceType.toLowerCase(),
          [EvidenceEventDataProperty.Source]: eventSource
        });
      });
    });

    describe('trackEvidenceRemove', () => {

      it(`should send ${UserEvents.EVIDENCE_REMOVE} event with proper data`, async () => {
        // Arrange

        // Act
        await service.trackEvidenceRemove(
          fakeFramework.framework_id,
          fakeControl.control_id,
          fakeRequirement.requirement_id,
          evidenceName,
          evidenceType,
          null
        );

        // Assert
        expect(userEventServiceMock.sendEvent).toHaveBeenCalledOnceWith(UserEvents.EVIDENCE_REMOVE, {
          ...createEvent(),
          [EvidenceEventDataProperty.EvidenceName]: evidenceName,
          [EvidenceEventDataProperty.EvidenceType]: evidenceType.toLowerCase(),
        });
      });
    });
  });

  describe('trackLinkedControlClickEvent', () => {

    it(`should send ${UserEvents.EVIDENCE_LINKED} event with proper data`, async () => {
      // Arrange
      const frameworkNames = ['1', '2' , '3'];
      const controlsAmount = 5;

      // Act
      service.trackLinkedControlClickEvent(
        evidenceName,
        frameworkNames,
        controlsAmount
      );

      // Assert
      expect(userEventServiceMock.sendEvent).toHaveBeenCalledOnceWith(UserEvents.EVIDENCE_LINKED, {
        [EvidenceEventDataProperty.EvidenceName]: evidenceName,
        [EvidenceEventDataProperty.FrameworksLinked]: frameworkNames.join(', '),
        [EvidenceEventDataProperty.AmountOfLinkedControls]: controlsAmount,
      });
    });
  });
});
