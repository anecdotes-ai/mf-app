import { Injectable } from '@angular/core';
import {
  AddNoteEventData,
  AddNoteEventDataProperty,
  ControlEventDataProperty,
  CopyNameEventDataProperty,
  EvidenceSourcesEnum,
  UserEvents
} from '../../models';
import { UserEventService } from '../user-event/user-event.service';
import { CalculatedControl, ResourceType } from 'core/modules/data/models';
import { Framework } from 'core/modules/data/models/domain';

@Injectable(
  // TODO: Must be removed. Currently cannot be removed since it breaks lots of tests
  {
    providedIn: 'root' 
  }
)
export class GeneralEventService {
  constructor(private userEventService: UserEventService) {}

  trackControlStatusChangeEvent(
    framework: Framework,
    control: CalculatedControl,
    previousStatus: string,
    currentStatus: string
  ): void {
    this.userEventService.sendEvent(UserEvents.CONTROL_STATUS_CHANGE, {
      [ControlEventDataProperty.FrameworkName]: framework.framework_name,
      [ControlEventDataProperty.ControlName]: control.control_name,
      [ControlEventDataProperty.ControlCategory]: control.control_category,
      [ControlEventDataProperty.PreviousStatus]: previousStatus,
      [ControlEventDataProperty.CurrentStatus]: currentStatus,
    });
  }

  trackSelectControlOwnerEvent(framework: Framework, control: CalculatedControl): void {
    this.userEventService.sendEvent(UserEvents.CONTROL_SELECT_OWNER, {
      [ControlEventDataProperty.FrameworkName]: framework.framework_name,
      [ControlEventDataProperty.ControlName]: control.control_name,
      [ControlEventDataProperty.ControlCategory]: control.control_category,
    });
  }

  trackCopyNameEvent(type: string, source: string): void {
    this.userEventService.sendEvent(UserEvents.COPY_NAME, {
      [CopyNameEventDataProperty.Type]: type,
      [CopyNameEventDataProperty.Source]: source,
    });
  }

  trackAddNoteEvent(
    source: string,
    resourceType: ResourceType,
    edited = false,
    resourceName: string,
    resourceCategory?: string
  ): void {
    const eventData: AddNoteEventData = {
      [AddNoteEventDataProperty.Source]: source,
      [AddNoteEventDataProperty.Edited]: edited,
      [AddNoteEventDataProperty.Type]: resourceType
    };

    if (source === EvidenceSourcesEnum.PolicyManager) {
      eventData[AddNoteEventDataProperty.PolicyName] = resourceName;
      eventData[AddNoteEventDataProperty.PolicyCategory] = resourceCategory || '';
    }

    if (source === EvidenceSourcesEnum.Controls) {
      if (resourceType === ResourceType.Requirement) {
        eventData[AddNoteEventDataProperty.RequirementName] = resourceName;
      }
      if (resourceType === ResourceType.Control) {
        eventData[AddNoteEventDataProperty.ControlName] = resourceName;
        eventData[AddNoteEventDataProperty.ControlCategory] = resourceCategory;
      }
    }
    this.userEventService.sendEvent(UserEvents.ADD_NOTE, eventData);
  }
}
