import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { EvidenceTargetResource } from 'core/modules/shared-controls/models/evidence-collection-modal-params';
import { ControlRequirement, EvidenceInstance, EvidenceStatusEnum, EvidenceRunHistoryEntity } from '../../../models/domain';
import { TrackOperations } from '../../operations-tracker/constants/track.operations.list.constant';
import { PoliciesFacadeService } from '../policies-facade/policies-facade.service';
import { NEVER, Observable } from 'rxjs';
import { map, shareReplay, switchMap, take } from 'rxjs/operators';
import {
  AddEvidenceFromDeviceAction,
  AddEvidenceFromTicketAction,
  AddEvidencePayload,
  AddEvidenceSharedLinkAction,
  CreateEvidenceURLAction,
  EvidenceAdapterActions,
  EvidenceApplicabilityChangeAction,
  SetEvidenceStatusAction,
} from './../../../store/actions/evidences.actions';
import { ActionDispatcherService } from './../../action-dispatcher/action-dispatcher.service';
import { EvidenceEventData, EvidenceEventDataProperty, EvidenceSourcesEnum, UserEvents } from 'core/models';
import { AttachRequirementPolicy } from '../../../store';
import { RequirementsFacadeService } from '../requirements-facade/requirements-facade.service';
import { FrameworksFacadeService } from '../frameworks-facade/frameworks-facade.service';
import { ControlsFacadeService } from '../controls-facade/controls-facade.service';
import { EvidenceLike } from '../../../models';
import { MANUAL } from '../../../constants';
import { PluginFacadeService } from '../plugin-facade/plugin-facade.service';
import { EvidenceSelectors } from '../../../store/selectors';
import { UserEventService } from 'core/services/user-event/user-event.service';

@Injectable()
export class EvidenceFacadeService {
  constructor(
    private store: Store,
    private actionDispatcher: ActionDispatcherService,
    private requirementFacade: RequirementsFacadeService,
    private controlFacade: ControlsFacadeService,
    private frameworkFacade: FrameworksFacadeService,
    private pluginFacade: PluginFacadeService,
    private policyFacade: PoliciesFacadeService,
    private userEventService: UserEventService,
  ) {
    this.setAllEvidenceCache();
  }

  private allEvidenceCache$: Observable<EvidenceInstance[]>;

  getEvidence(evidence_id: string): Observable<EvidenceInstance> {
    return this.store.select(EvidenceSelectors.SelectEvidenceState).pipe(map((evidencesState) => evidencesState.evidences.entities[evidence_id]));
  }

  getEvidenceLike(evidence_id: string): Observable<EvidenceLike> {
    return this.store.select(EvidenceSelectors.CreateEvidenceLikeSelectorById(evidence_id));
  }

  getEvidenceByIds(evidenceIds: string[]): Observable<EvidenceLike[]> {
    return this.store.select(EvidenceSelectors.CreateEvidenceLikesSelectorByIds(evidenceIds));
  }

  updateEvidence(evidence: EvidenceInstance): Promise<void> {
    return this.actionDispatcher.dispatchActionAsync(
      new EvidenceApplicabilityChangeAction(evidence),
      TrackOperations.EVIDENCE_IGNORENCE,
      evidence.evidence_id
    );
  }

  async loadEvidenceHistoryRun(evidence_id: string, lastDate: number = undefined): Promise<EvidenceRunHistoryEntity> {
    return await this.actionDispatcher.dispatchActionAsync(
      EvidenceAdapterActions.loadEvidenceHistoryRun({ evidence_id, lastDate }),
      TrackOperations.LOAD_EVIDENCE_HISTORY_RUN,
      evidence_id
    );
  }

  getEvidenceHistoryRun(evidence_id: string, lastDate: number = undefined): Observable<EvidenceRunHistoryEntity> {
    return this.store
      .select(EvidenceSelectors.SelectEvidenceState)
      .pipe(
        map((evidencesState) => evidencesState?.evidence_history_run),
        map((directive) => directive[evidence_id]),
        switchMap((service) => {
          if (!service) {
            this.store.dispatch(EvidenceAdapterActions.loadEvidenceHistoryRun({ evidence_id, lastDate }));
            return NEVER;
          }
          return this.store.select(EvidenceSelectors.SelectEvidenceState).pipe(map((evidencesState) => evidencesState.evidence_history_run[evidence_id]));
        })
      );
  }

  getAllEvidences(): Observable<EvidenceInstance[]> {
    return this.allEvidenceCache$;
  }

  async attachPolicyToRequirementAsync(
    requirement: ControlRequirement,
    policyId: string,
    control_id: string,
    framework_id: string
  ): Promise<void> {
    await this.actionDispatcher.dispatchActionAsync(
      new AttachRequirementPolicy(requirement, policyId),
      TrackOperations.ATTACH_POLICY_TO_REQUIREMENT
    );
    const policy = await this.policyFacade.getPolicy(policyId).pipe(take(1)).toPromise();
    const eventData = await this.prepareEventDataForRequirementAsync(
      requirement.requirement_id,
      control_id,
      framework_id
    );
    eventData[EvidenceEventDataProperty.SelectedPolicy] = policy.policy_name;
    this.userEventService.sendEvent(UserEvents.ADD_EVIDENCE_POLICY, eventData);
  }

  async createRequirementUrlEvidenceAsync(
    url: string,
    requirement_id: string,
    evidence_name: string,
    control_id: string,
    framework_id: string
  ): Promise<string[]> {
    const { evidence_id: evidenceIds } = await this.actionDispatcher.dispatchActionAsync(
      new CreateEvidenceURLAction(requirement_id, url, evidence_name),
      TrackOperations.CREATE_EVIDENCE_URL
    );
    const eventData = await this.prepareEventDataForRequirementAsync(requirement_id, control_id, framework_id);
    eventData[EvidenceEventDataProperty.AddedUrl] = url;
    this.userEventService.sendEvent(UserEvents.ADD_EVIDENCE_URL, eventData);
    return evidenceIds;
  }

  createSharedLinkEvidenceAsync(
    link: string,
    serviceId: string,
    serviceInstanceId: string,
    targetResourceParams?: { resourceType: string, resourceId: string },
    controlId?: string,
    frameworkId?: string,
  ): Promise<void> {
    return this.actionDispatcher.dispatchActionAsync(
      new AddEvidenceSharedLinkAction(
        targetResourceParams?.resourceType,
        targetResourceParams?.resourceId,
        serviceId,
        serviceInstanceId,
        undefined,
        link,
        controlId,
        frameworkId,
      ),
      TrackOperations.ADD_EVIDENCE_SHARED_LINK
    );
  }

  uploadEvidenceAsync(
    file: File,
    targetResourceParams?: EvidenceTargetResource,
    frameworkId?: string,
    controlId?: string,
  ): Promise<void> {
    const payload: AddEvidencePayload = {
      resourceType: targetResourceParams.resourceType,
      resource_id: targetResourceParams.resourceId,
      service_id: MANUAL,
      evidence: file,
      ...(frameworkId && { frameworkId }),
      ...(controlId && { controlId }),
    };

    return this.actionDispatcher.dispatchActionAsync(
      new AddEvidenceFromDeviceAction(payload),
      TrackOperations.ADD_EVIDENCE_FROM_DEVICE
    );
  }

  async addEvidenceFromTicketAsync(requirement_id: string, service_id: string, service_instance_id: string, tickets: any[], framework_id: string, control_id: string): Promise<string[]> {
    const { evidence_id: evidenceIds } = await this.actionDispatcher.dispatchActionAsync(
      new AddEvidenceFromTicketAction(requirement_id, service_id, service_instance_id, tickets),
      TrackOperations.ADD_EVIDENCE_FROM_TICKET
    );
    const eventData = await this.prepareEventDataForRequirementAsync(requirement_id, control_id, framework_id);
    const service = await this.pluginFacade.getServiceById(service_id).pipe(take(1)).toPromise();
    eventData[EvidenceEventDataProperty.Type] = service.service_display_name;
    this.userEventService.sendEvent(UserEvents.ADD_EVIDENCE_TICKETING, eventData);
    return evidenceIds;
  }

  async setNotMitigatedStatus(
    evidence: EvidenceInstance,
    requirement_id: string,
    control_id: string,
    framework_id: string
  ): Promise<void> {
    this.actionDispatcher.dispatchActionAsync(
      new SetEvidenceStatusAction({
        evidence: evidence,
        newEvidenceStatus: EvidenceStatusEnum.NOTMITIGATED,
      }),
      TrackOperations.CHANGE_REQ_APPROVAL
    );
    const eventData = await this.prepareEventDataForRequirementAsync(requirement_id, control_id, framework_id);
    eventData[EvidenceEventDataProperty.EvidenceName] = evidence.evidence_name;
    eventData[EvidenceEventDataProperty.Clicked] = 'mark for review';
    this.userEventService.sendEvent(UserEvents.EVIDENCE_MARK_FOR_REVIEW, eventData);
  }

  async setMitigatedStatus(
    evidence: EvidenceInstance,
    requirement_id: string,
    control_id: string,
    framework_id: string
  ): Promise<void> {
    this.actionDispatcher.dispatchActionAsync(
      new SetEvidenceStatusAction({
        evidence: evidence,
        newEvidenceStatus: EvidenceStatusEnum.MITIGATED,
      }),
      TrackOperations.CHANGE_REQ_APPROVAL
    );
    const eventData = await this.prepareEventDataForRequirementAsync(requirement_id, control_id, framework_id);
    eventData[EvidenceEventDataProperty.EvidenceName] = evidence.evidence_name;
    eventData[EvidenceEventDataProperty.Clicked] = 'got it';
    this.userEventService.sendEvent(UserEvents.EVIDENCE_MARK_FOR_REVIEW, eventData);
  }

  async evidencePoolCollectionEvent(requirement_id: string, control_id: string, framework_id: string): Promise<void> {
    const eventData = await this.prepareEventDataForRequirementAsync(requirement_id, control_id, framework_id);
    eventData[EvidenceEventDataProperty.Source] = EvidenceSourcesEnum.CollectEvidence;
    this.userEventService.sendEvent(UserEvents.LINK_EVIDENCE, eventData);
  }

  private async prepareEventDataForRequirementAsync(
    requirement_id: string,
    control_id: string,
    framework_id: string
  ): Promise<EvidenceEventData> {
    const requirement = await this.requirementFacade.getRequirement(requirement_id).pipe(take(1)).toPromise();
    const framework = await this.frameworkFacade.getFrameworkById(framework_id).pipe(take(1)).toPromise();
    const control = await this.controlFacade.getControl(control_id).pipe(take(1)).toPromise();

    return {
      [EvidenceEventDataProperty.FrameworkName]: framework.framework_name,
      [EvidenceEventDataProperty.ControlName]: control.control_name,
      [EvidenceEventDataProperty.ControlCategory]: control.control_category,
      [EvidenceEventDataProperty.RequirementName]: requirement.requirement_name,
    };
  }

  private setAllEvidenceCache(): void {
    this.allEvidenceCache$ = this.store.select(EvidenceSelectors.SelectEvidences)
      .pipe(
        shareReplay()
      );
  }
}
