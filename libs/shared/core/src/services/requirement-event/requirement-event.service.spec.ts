import { fakeAsync, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { EvidenceEventDataProperty, UserEvents } from 'core/models';
import { RequirementEventService } from './requirement-event.service';
import { ControlsFacadeService, FrameworksFacadeService, RequirementsFacadeService } from 'core/modules/data/services/index';
import { UserEventService } from 'core/services/user-event/user-event.service';

const FAKE_DATA = {
  requirement: {
    requirement_id: 'fake-requirement-id',
    requirement_name: 'fake-requirement-name',
  },
  framework: {
    framework_id: 'fake-framework-id',
    framework_name: 'fake-framework-name',
  },
  control: {
    control_id: 'fake-control-id',
    control_name: 'fake-control-name',
    control_category: 'fake-control-category',
  },
  file: {
    name: 'fake-file-name',
    format: 'pdf',
  },
  service: {
    service_id: 'fake-service-id',
    service_display_name: 'fake-service-name',
  }
};

describe('RequirementEventService', () => {
  let serviceUnderTest: RequirementEventService;

  let requirementFacadeServiceSpy: jasmine.SpyObj<RequirementsFacadeService>;
  let frameworksFacadeServiceSpy: jasmine.SpyObj<FrameworksFacadeService>;
  let controlsFacadeServiceSpy: jasmine.SpyObj<ControlsFacadeService>;
  let userEventServiceSpy: jasmine.SpyObj<UserEventService>;

  beforeEach(() => {
    requirementFacadeServiceSpy = jasmine.createSpyObj('RequirementsFacadeService', ['getRequirement']);
    frameworksFacadeServiceSpy = jasmine.createSpyObj('FrameworksFacadeService', ['getFrameworkById']);
    controlsFacadeServiceSpy = jasmine.createSpyObj('ControlsFacadeService', ['getControl']);
    userEventServiceSpy = jasmine.createSpyObj('UserEventService', ['sendEvent']);

    TestBed.configureTestingModule({
      providers: [
        RequirementEventService,
        { provide: RequirementsFacadeService, useValue: requirementFacadeServiceSpy },
        { provide: FrameworksFacadeService, useValue: frameworksFacadeServiceSpy },
        { provide: ControlsFacadeService, useValue: controlsFacadeServiceSpy },
        { provide: UserEventService, useValue: userEventServiceSpy },
      ],
    });

    serviceUnderTest = TestBed.inject(RequirementEventService);

    requirementFacadeServiceSpy.getRequirement.and.returnValue(of(FAKE_DATA.requirement));
    frameworksFacadeServiceSpy.getFrameworkById.and.returnValue(of(FAKE_DATA.framework));
    controlsFacadeServiceSpy.getControl.and.returnValue(of(FAKE_DATA.control));
    userEventServiceSpy.sendEvent.and.returnValue();
  });

  it('should be created', () => {
    // Arrange
    // Act
    // Assert
    expect(serviceUnderTest).toBeTruthy();
  });

  describe('trackAddEvidenceFromDeviceAsync', () => {
    it(`should call the sendEvent method of userEventService with ${UserEvents.ADD_EVIDENCE_FROM_DEVICE} event and appropriate params`, fakeAsync(async () => {
      // Arrange
      // Act
      await serviceUnderTest.trackAddEvidenceFromDeviceAsync(
        FAKE_DATA.requirement.requirement_id,
        FAKE_DATA.framework.framework_id,
        FAKE_DATA.control.control_id,
        `${FAKE_DATA.file.name}.${FAKE_DATA.file.format}`,
      );

      // Assert
      expect(userEventServiceSpy.sendEvent).toHaveBeenCalledWith(UserEvents.ADD_EVIDENCE_FROM_DEVICE, {
        [EvidenceEventDataProperty.FrameworkName]: FAKE_DATA.framework.framework_name,
        [EvidenceEventDataProperty.ControlName]: FAKE_DATA.control.control_name,
        [EvidenceEventDataProperty.ControlCategory]: FAKE_DATA.control.control_category,
        [EvidenceEventDataProperty.RequirementName]: FAKE_DATA.requirement.requirement_name,
        [EvidenceEventDataProperty.FileType]: FAKE_DATA.file.format,
      });
    }));
  });

  describe('trackAddEvidenceSharedLinkAsync', () => {
    it(`should call the sendEvent method of userEventService with ${UserEvents.ADD_EVIDENCE_SHARED_LINK} event and appropriate params`, fakeAsync(async () => {
      // Arrange
      // Act
      await serviceUnderTest.trackAddEvidenceSharedLinkAsync(
        FAKE_DATA.requirement.requirement_id,
        FAKE_DATA.framework.framework_id,
        FAKE_DATA.control.control_id,
        FAKE_DATA.service.service_display_name,
      );

      // Assert
      expect(userEventServiceSpy.sendEvent).toHaveBeenCalledWith(UserEvents.ADD_EVIDENCE_SHARED_LINK, {
        [EvidenceEventDataProperty.FrameworkName]: FAKE_DATA.framework.framework_name,
        [EvidenceEventDataProperty.ControlName]: FAKE_DATA.control.control_name,
        [EvidenceEventDataProperty.ControlCategory]: FAKE_DATA.control.control_category,
        [EvidenceEventDataProperty.RequirementName]: FAKE_DATA.requirement.requirement_name,
        [EvidenceEventDataProperty.Type]: FAKE_DATA.service.service_display_name,
      });
    }));
  });
});
