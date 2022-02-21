import { Injectable } from '@angular/core';
import { EvidenceEventData, EvidenceEventDataProperty, UserEvents } from 'core/models';
import {
  ControlsFacadeService,
  FrameworksFacadeService,
  RequirementsFacadeService,
} from 'core/modules/data/services/facades';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { take } from 'rxjs/operators';

@Injectable()
export class RequirementEventService {
  constructor(
    private requirementFacade: RequirementsFacadeService,
    private frameworkFacade: FrameworksFacadeService,
    private controlFacade: ControlsFacadeService,
    private userEventService: UserEventService,
  ) {}

  async trackAddEvidenceFromDeviceAsync(requirementId: string, frameworkId: string, controlId: string, fileName: string): Promise<void> {
    const eventData = await this.prepareEventDataForRequirementAsync(requirementId, frameworkId, controlId);
    const splitFileName = fileName.split('.');

    eventData[EvidenceEventDataProperty.FileType] = splitFileName[splitFileName.length - 1];

    this.userEventService.sendEvent(UserEvents.ADD_EVIDENCE_FROM_DEVICE, eventData);
  }

  async trackAddEvidenceSharedLinkAsync(requirementId: string, frameworkId: string, controlId: string, pluginName: string): Promise<void> {
    const eventData = await this.prepareEventDataForRequirementAsync(requirementId, frameworkId, controlId);

    eventData[EvidenceEventDataProperty.Type] = pluginName;

    this.userEventService.sendEvent(UserEvents.ADD_EVIDENCE_SHARED_LINK, eventData);
  }

  private async prepareEventDataForRequirementAsync(requirementId: string, frameworkId: string, controlId: string): Promise<EvidenceEventData> {
    const requirement = await this.requirementFacade.getRequirement(requirementId)
      .pipe(take(1)).toPromise();
    const framework = await this.frameworkFacade.getFrameworkById(frameworkId)
      .pipe(take(1)).toPromise();
    const control = await this.controlFacade.getControl(controlId)
      .pipe(take(1)).toPromise();

    return {
      [EvidenceEventDataProperty.FrameworkName]: framework.framework_name,
      [EvidenceEventDataProperty.ControlName]: control.control_name,
      [EvidenceEventDataProperty.ControlCategory]: control.control_category,
      [EvidenceEventDataProperty.RequirementName]: requirement.requirement_name,
    };
  }
}
