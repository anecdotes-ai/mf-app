import { TestBed } from '@angular/core/testing';

import { GeneralEventService } from './general-event.service';
import {
  AddNoteEventDataProperty,
  ControlEventDataProperty,
  CopyNameEventDataProperty,
  EvidenceSourcesEnum,
  UserEvents
} from 'core';
import { Framework } from 'core/modules/data/models/domain';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { CalculatedControl, ResourceType } from 'core/modules/data/models';

describe('GeneralEventService', () => {
  let service: GeneralEventService;
  let userEventService: UserEventService;

  const framework: Framework = { framework_name: 'some-name' };
  const control: CalculatedControl = {
    control_name: 'some-name',
    control_category: 'some-category',
  };
  const previousStatus = 'prev-status';
  const currentStatus = 'curr-status';
  const type = 'some-type';
  let source = 'some-source';
  const edited = true;
  const resourceName = 'some-name';
  const resourceCategory = 'some-category';
  let resourceType: ResourceType = ResourceType.Control;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: UserEventService, useValue: {} }],
    });
    service = TestBed.inject(GeneralEventService);

    userEventService = TestBed.inject(UserEventService);
    userEventService.sendEvent = jasmine.createSpy('sendEvent');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(`should call sendEvent method with ${UserEvents.CONTROL_STATUS_CHANGE} event and appropriate params`, () => {
    // Arrange
    // Act
    service.trackControlStatusChangeEvent(framework, control, previousStatus, currentStatus);

    // Assert
    expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.CONTROL_STATUS_CHANGE, {
      [ControlEventDataProperty.FrameworkName]: framework.framework_name,
      [ControlEventDataProperty.ControlName]: control.control_name,
      [ControlEventDataProperty.ControlCategory]: control.control_category,
      [ControlEventDataProperty.PreviousStatus]: previousStatus,
      [ControlEventDataProperty.CurrentStatus]: currentStatus,
    });
  });

  it(`should call sendEvent method with ${UserEvents.CONTROL_SELECT_OWNER} event and appropriate params`, () => {
    // Arrange
    // Act
    service.trackSelectControlOwnerEvent(framework, control);

    // Assert
    expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.CONTROL_SELECT_OWNER, {
      [ControlEventDataProperty.FrameworkName]: framework.framework_name,
      [ControlEventDataProperty.ControlName]: control.control_name,
      [ControlEventDataProperty.ControlCategory]: control.control_category,
    });
  });

  it(`should call sendEvent method with ${UserEvents.COPY_NAME} event and appropriate params`, () => {
    // Arrange
    // Act
    service.trackCopyNameEvent(type, source);

    // Assert
    expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.COPY_NAME, {
      [CopyNameEventDataProperty.Type]: type,
      [CopyNameEventDataProperty.Source]: source,
    });
  });

  it(`should call sendEvent method with ${UserEvents.ADD_NOTE} event and appropriate params for ${EvidenceSourcesEnum.PolicyManager} source`, () => {
    // Arrange
    source = EvidenceSourcesEnum.PolicyManager;

    // Act
    service.trackAddNoteEvent(source, resourceType, edited, resourceName, resourceCategory);

    // Assert
    expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.ADD_NOTE, {
      [AddNoteEventDataProperty.Source]: source,
      [AddNoteEventDataProperty.Edited]: edited,
      [AddNoteEventDataProperty.PolicyName]: resourceName,
      [AddNoteEventDataProperty.PolicyCategory]: resourceCategory,
      [AddNoteEventDataProperty.Type]: resourceType,
    });
  });

  it(`should call sendEvent method with ${UserEvents.ADD_NOTE} event and appropriate params for ${EvidenceSourcesEnum.Controls} source`, () => {
    // Arrange
    source = EvidenceSourcesEnum.Controls;
    resourceType = ResourceType.Control;

    // Act
    service.trackAddNoteEvent(source, resourceType, edited, resourceName, resourceCategory);

    // Assert
    expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.ADD_NOTE, {
      [AddNoteEventDataProperty.Source]: source,
      [AddNoteEventDataProperty.Edited]: edited,
      [AddNoteEventDataProperty.ControlName]: resourceName,
      [AddNoteEventDataProperty.ControlCategory]: resourceCategory,
      [AddNoteEventDataProperty.Type]: resourceType,
    });
  });

  it(`should call sendEvent method with ${UserEvents.ADD_NOTE} event and appropriate params for ${EvidenceSourcesEnum.Controls} source`, () => {
    // Arrange
    source = EvidenceSourcesEnum.Controls;
    resourceType = ResourceType.Requirement;

    // Act
    service.trackAddNoteEvent(source, resourceType, edited, resourceName, resourceCategory);

    // Assert
    expect(userEventService.sendEvent).toHaveBeenCalledWith(UserEvents.ADD_NOTE, {
      [AddNoteEventDataProperty.Source]: source,
      [AddNoteEventDataProperty.Edited]: edited,
      [AddNoteEventDataProperty.RequirementName]: resourceName,
      [AddNoteEventDataProperty.Type]: resourceType,
    });
  });
});
