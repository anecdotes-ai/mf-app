import { Injectable } from '@angular/core';
import { EvidenceEventData, EvidenceEventDataProperty, UserEvents } from 'core/models';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { ControlsFacadeService } from '../facades/controls-facade/controls-facade.service';
import { FrameworksFacadeService } from '../facades/frameworks-facade/frameworks-facade.service';
import { RequirementsFacadeService } from '../facades/requirements-facade/requirements-facade.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EvidenceUserEventService {
  constructor(
    private userEventService: UserEventService,
    private requirementFacade: RequirementsFacadeService,
    private controlFacade: ControlsFacadeService,
    private frameworkFacade: FrameworksFacadeService
  ) {}

  sendEvidenceEvent(eventType: UserEvents, eventData: EvidenceEventData): void {
    this.userEventService.sendEvent(eventType, eventData);
  }

  async trackCsvExport(
    framework_id: string,
    control_id: string,
    requirement_id: string,
    evidence_name: string,
    evidence_type: string,
    source: string,
    frameworks_names: string
  ): Promise<void> {
    let eventData = await this.prepareEventDataForRequirementAsync(requirement_id, control_id, framework_id, evidence_name, evidence_type, frameworks_names);
    eventData = {
      ...eventData,
      [EvidenceEventDataProperty.Source]: source
    };
    this.userEventService.sendEvent(UserEvents.EXPORT_EVIDENCE_TO_CSV, eventData);
  }

  async trackViewFullData(
    framework_id,
    control_id: string,
    requirement_id: string,
    evidence_name: string,
    evidence_type: string,
    frameworks_names,
  ): Promise<void> {
    let eventData = await this.prepareEventDataForRequirementAsync(requirement_id, control_id, framework_id, evidence_name, evidence_type, frameworks_names);
    eventData = {
      ...eventData,
    };
    this.userEventService.sendEvent(UserEvents.VIEW_FULL_DATA, eventData);
  }

  async trackEvidenceDownload(
    framework_id: string,
    control_id: string,
    requirement_id: string,
    evidence_name: string,
    evidence_type: string,
    source: string,
    frameworks_names: string,
  ): Promise<void> {
    let eventData = await this.prepareEventDataForRequirementAsync(requirement_id, control_id, framework_id, evidence_name, evidence_type, frameworks_names);
    eventData = {
      ...eventData,
      [EvidenceEventDataProperty.Source]: source
    };
    this.userEventService.sendEvent(UserEvents.EVIDENCE_DOWNLOAD, eventData);
  }

  async trackEvidenceRemove(
    framework_id,
    control_id: string,
    requirement_id: string,
    evidence_name: string,
    evidence_type: string,
    frameworks_names: string
  ): Promise<void> {
    let eventData = await this.prepareEventDataForRequirementAsync(requirement_id, control_id, framework_id, evidence_name, evidence_type, frameworks_names);
    eventData = {
      ...eventData,
    };
    this.userEventService.sendEvent(UserEvents.EVIDENCE_REMOVE, eventData);
  }

  async trackFlagHover(
    framework_id: string,
    control_id: string,
    requirement_id: string,
    evidence_name: string,
    evidence_type: string,
    source: string,
    frameworks_names: string
  ): Promise<void> {
    let eventData = await this.prepareEventDataForRequirementAsync(requirement_id, control_id, framework_id, evidence_name, evidence_type, frameworks_names );
    eventData = {
      ...eventData,

      [EvidenceEventDataProperty.Source]: source
    };
    this.userEventService.sendEvent(UserEvents.EVIDENCE_FLAG_HOVER, eventData);
  }

  trackLinkedControlClickEvent(evidenceName: string, frameworkNames: string[], controlsAmount: number): void {
    this.userEventService.sendEvent(UserEvents.EVIDENCE_LINKED, {
      [EvidenceEventDataProperty.EvidenceName]: evidenceName,
      [EvidenceEventDataProperty.FrameworksLinked]: frameworkNames.join(', '),
      [EvidenceEventDataProperty.AmountOfLinkedControls]: controlsAmount
    });
  }

  private async prepareEventDataForRequirementAsync(
    requirement_id: string,
    control_id: string,
    framework_id: string,
    evidence_name: string,
    evidence_type: string,
    frameworks_names: string
  ): Promise<EvidenceEventData> {
    let framework;
    let requirement;
    if (requirement_id) {
      requirement = await this.requirementFacade.getRequirement(requirement_id).pipe(take(1)).toPromise();
    }
    if (framework_id) {
      framework = await this.frameworkFacade.getFrameworkById(framework_id).pipe(take(1)).toPromise();
    }
    const control = await this.controlFacade.getControl(control_id).pipe(take(1)).toPromise();

    return {
      [EvidenceEventDataProperty.FrameworkName]: framework ? framework.framework_name : frameworks_names,
      [EvidenceEventDataProperty.ControlName]: control?.control_name,
      [EvidenceEventDataProperty.RequirementName]: requirement?.requirement_name,
      [EvidenceEventDataProperty.RequirementType]: requirement?.requirement_is_custom ? 'custom made' : 'existed',
      [EvidenceEventDataProperty.EvidenceName]: evidence_name,
      [EvidenceEventDataProperty.EvidenceType]: evidence_type.toLowerCase(),
    };
  }
}
