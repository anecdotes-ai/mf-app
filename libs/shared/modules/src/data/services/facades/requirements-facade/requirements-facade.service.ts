import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CalculatedControl, CalculatedRequirement } from '../../../models';
import { TrackOperations } from '../../operations-tracker/constants/track.operations.list.constant';
import { combineLatest, Observable, of } from 'rxjs';
import { filter, map, shareReplay, switchMap, take } from 'rxjs/operators';
import { ControlRequirement, Requirement } from '../../../models/domain';
import {
  AddRequirementAction,
  AttachRequirementPolicy,
  EditRequirementAction,
  RemoveRequirementAction,
  SendRequirementTaskSlackAction,
  UpdateControlAction,
} from '../../../store/actions';
import {
  createRequirementByIdsSelector,
  createRequirementsByEvidenceIdSelector,
  selectPolicyRelatedRequirementIds,
  selectRequirementRelatedControlIds,
  selectRequirementsAfterInit,
} from '../../../store/selectors';
import { State } from '../../../store/state';
import { ActionDispatcherService } from '../../action-dispatcher/action-dispatcher.service';
import { 
  EvidenceEventData,
  EvidenceEventDataProperty,
  EvidenceSourcesEnum,
  RequirementAddingType,
  RequirementChanges,
  RequirementEventData,
  RequirementEventDataProperty,
  UserEvents,
 } from 'core/models';
 import { UserEventService } from 'core/services/user-event/user-event.service';
import { FrameworksFacadeService } from '../frameworks-facade/frameworks-facade.service';
import { ControlsFacadeService } from '../controls-facade/controls-facade.service';

@Injectable()
export class RequirementsFacadeService {
  constructor(
    private store: Store<State>,
    private actionDispatcher: ActionDispatcherService,
    private userEventService: UserEventService,
    private controlFacade: ControlsFacadeService,
    private frameworkFacade: FrameworksFacadeService
  ) {}

  async addNewRequirement(requirement: Requirement): Promise<void> {
    await this.actionDispatcher.dispatchActionAsync(
      new AddRequirementAction({
        requirement: requirement,
      }),
      TrackOperations.ADD_REQUIREMENT
    );
    this.addNewRequirementEventTracking(
      requirement.requirement_related_controls[0],
      requirement.requirement_related_frameworks[0],
      requirement.requirement_description
    );
  }

  async addExistingRequirement(requirement: Requirement): Promise<void> {
    const requirement_related_controls = await this.requirementRelatedControls(requirement.requirement_id)
      .pipe(take(1))
      .toPromise();

    const requirement_related_frameworks = await this.requirementRelatedFrameworks(requirement.requirement_id)
      .pipe(take(1))
      .toPromise();

    const controlRequirement: ControlRequirement = await this.getRequirement(requirement.requirement_id)
      .pipe(take(1))
      .toPromise();

    if (requirement_related_controls?.length) {
      requirement.requirement_related_controls = requirement.requirement_related_controls.concat(
        ...requirement_related_controls
      );
    }

    if (requirement_related_frameworks?.length) {
      requirement.requirement_related_frameworks = requirement.requirement_related_frameworks.concat(
        requirement_related_frameworks
      );
    }

    await this.actionDispatcher.dispatchActionAsync(
      new AddRequirementAction({
        requirement: requirement,
        isExistingRequirement: true,
      }),
      TrackOperations.ADD_REQUIREMENT
    );

    this.addExistingRequirementEventTracking(
      requirement.requirement_related_controls[0],
      requirement.requirement_related_frameworks[0],
      controlRequirement.requirement_name
    );
  }

  async removeRequirement(control_id: string, framework_id: string, requirement: ControlRequirement): Promise<void> {
    await this.actionDispatcher.dispatchActionAsync(
      new RemoveRequirementAction(requirement.requirement_id, control_id),
      requirement.requirement_id,
      TrackOperations.REQ_REMOVED
    );

    this.removeRequirementEventTracking(control_id, framework_id, requirement.requirement_name);
  }

  async sendMessageViaSlack(
    massage: string,
    recepient: string[],
    control_id: string,
    framework_id: string,
    requirement: ControlRequirement
  ): Promise<void> {
    await this.actionDispatcher.dispatchActionAsync(
      new SendRequirementTaskSlackAction(requirement.requirement_id, massage, recepient),
      requirement.requirement_id,
      TrackOperations.SEND_SLACK_TASK
    );

    this.sendRequirementVeaSlackEventTracking(control_id, framework_id, requirement.requirement_name);
  }

  requirementRelatedControls(requirement_id: string): Observable<string[]> {
    return this.store.select(selectRequirementRelatedControlIds, { requirement_id }).pipe(shareReplay());
  }

  getControlsByRequirementId(requirement_id: string): Observable<CalculatedControl[]> {
    return this.requirementRelatedControls(requirement_id).pipe(
      switchMap((controlsIds) =>
        controlsIds?.length ? combineLatest(controlsIds.map((id) => this.controlFacade.getControl(id))) : of([])
      )
    );
  }

  getRequirementsByPolicyId(policy_id: string): Observable<ControlRequirement[]> {
    return this.store.select(selectPolicyRelatedRequirementIds).pipe(
      map(state => state[policy_id]),
      switchMap(requirementIds => requirementIds ? this.store.select(createRequirementByIdsSelector(requirementIds)) : of([])),
      shareReplay()
    );
  }

  getRequirementsByEvidenceId(evidenceId: string): Observable<CalculatedRequirement[]> {
    return this.store.select(createRequirementsByEvidenceIdSelector(evidenceId));
  }

  requirementRelatedFrameworks(requirement_id: string): Observable<string[]> {
    return this.store
      .select((x) => x.requirementState.requirementControlsMapping[requirement_id])
      .pipe(
        switchMap((controlIds) =>
          this.store
            .select((state) => state.controlsState.controlFrameworksMapping)
            .pipe(
              map((controlFrameworksMapping) => controlIds?.map((control_id) => controlFrameworksMapping[control_id])),
              map((x: string[][]) => x?.reduce((fst, scnd) => [...fst, ...scnd], [])),
              map((x: string[]) => new Set(x)), // to distinct framework ids
              map((x: Set<string>) => Array.from(x))
            )
        ),
        shareReplay()
      );
  }

  getRequirements(): Observable<ControlRequirement[]> {
    return this.store.pipe(selectRequirementsAfterInit, shareReplay());
  }

  getRequirement(requirement_id: string): Observable<CalculatedRequirement> {
    return this.store.select((state) => state.calculationState.calculatedRequirements.entities[requirement_id]).pipe(filter(req => !!req));
  }

  getRequirementsByIds(requirementIds: string[]): Observable<ControlRequirement[]> {
    return this.store.select(createRequirementByIdsSelector(requirementIds));
  }

  async linkEvidenceAsync(requirementId: string, evidenceId: string, withTracking = false, controlId?: string, frameworkId?: string): Promise<any> {
    const requirement = await this.store
      .select((state) => state.requirementState.controlRequirements.entities[requirementId])
      .pipe(take(1))
      .toPromise();
    requirement.requirement_evidence_ids = [...requirement.requirement_evidence_ids, evidenceId];
    await this.actionDispatcher.dispatchActionAsync(
      new EditRequirementAction(requirement),
      TrackOperations.EDIT_REQUIREMENT
    );
    
    const controls = await this.controlFacade.getControlsByRequirementIds([requirementId]).pipe(take(1)).toPromise();
    controls.forEach(control => this.store.dispatch(new UpdateControlAction(control.control_id)));

    if(requirementId && frameworkId && withTracking)
    {
      const eventData = await this.prepareEventDataForEvidenceAsync(requirementId, controlId, frameworkId);
      eventData[EvidenceEventDataProperty.Source] = EvidenceSourcesEnum.EvidencePool;
      this.userEventService.sendEvent(UserEvents.LINK_EVIDENCE, eventData);
    }
  }

  async updateRequirement(
    updatedRequirement: ControlRequirement,
    control_id: string,
    framework_id: string
  ): Promise<void> {
    const currentRequirement = await this.getRequirement(updatedRequirement.requirement_id).pipe(take(1)).toPromise();
    await this.actionDispatcher.dispatchActionAsync(
      new EditRequirementAction(updatedRequirement),
      TrackOperations.EDIT_REQUIREMENT
    );
    this.updateRequirementEventTracking(currentRequirement, control_id, framework_id, updatedRequirement);
  }

  async attachPolicyToRequirement(requirement: ControlRequirement, policyId: string): Promise<void> {
    return this.actionDispatcher.dispatchActionAsync(
      new AttachRequirementPolicy(requirement, policyId),
      TrackOperations.ATTACH_POLICY_TO_REQUIREMENT
    );
  }

  private async prepareEventDataForRequirementAsync(
    control_id: string,
    framework_id: string,
    requirement_name: string
  ): Promise<RequirementEventData> {
    const framework = await this.frameworkFacade.getFrameworkById(framework_id).pipe(take(1)).toPromise();
    const control = await this.controlFacade.getControl(control_id).pipe(take(1)).toPromise();
    return {
      [RequirementEventDataProperty.FrameworkName]: framework.framework_name,
      [RequirementEventDataProperty.ControlName]: control.control_name,
      [RequirementEventDataProperty.ControlCategory]: control.control_category,
      [RequirementEventDataProperty.RequirementName]: requirement_name,
    };
  }

  private async prepareEventDataForEvidenceAsync(
    requirement_id: string,
    control_id: string,
    framework_id: string
  ): Promise<EvidenceEventData> {
    const requirement = await this.getRequirement(requirement_id).pipe(take(1)).toPromise();
    const framework = await this.frameworkFacade.getFrameworkById(framework_id).pipe(take(1)).toPromise();
    const control = await this.controlFacade.getControl(control_id).pipe(take(1)).toPromise();

    return {
      [EvidenceEventDataProperty.FrameworkName]: framework.framework_name,
      [EvidenceEventDataProperty.ControlName]: control.control_name,
      [EvidenceEventDataProperty.ControlCategory]: control.control_category,
      [EvidenceEventDataProperty.RequirementName]: requirement.requirement_name,
    };
  }

  private async addExistingRequirementEventTracking(
    control_id: string,
    framework_id: string,
    requirement_name: string
  ): Promise<void> {
    const eventData = await this.prepareEventDataForRequirementAsync(control_id, framework_id, requirement_name);
    eventData[RequirementEventDataProperty.Type] = RequirementAddingType.SelectedFromExisting;
    this.userEventService.sendEvent(UserEvents.ADD_NEW_REQUIREMENT, eventData);
  }

  private async addNewRequirementEventTracking(
    control_id: string,
    framework_id: string,
    requirement_name: string
  ): Promise<void> {
    const eventData = await this.prepareEventDataForRequirementAsync(control_id, framework_id, requirement_name);
    eventData[RequirementEventDataProperty.Type] = RequirementAddingType.CreatedNewReq;
    this.userEventService.sendEvent(UserEvents.ADD_NEW_REQUIREMENT, eventData);
  }

  private async updateRequirementEventTracking(
    currentRequirement: ControlRequirement,
    control_id: string,
    framework_id: string,
    updatedRequirement: ControlRequirement
  ): Promise<void> {
    const eventData = await this.prepareEventDataForRequirementAsync(
      control_id,
      framework_id,
      updatedRequirement.requirement_name
    );
    let requirementChanges: RequirementChanges = {};

    if (updatedRequirement.requirement_name !== currentRequirement.requirement_name) {
      requirementChanges.name = updatedRequirement.requirement_name;
    }
    if (updatedRequirement.requirement_help !== currentRequirement.requirement_help) {
      requirementChanges.description = updatedRequirement.requirement_help;
    }

    eventData[RequirementEventDataProperty.Changes] = requirementChanges;
    this.userEventService.sendEvent(UserEvents.UPDATE_REQUIREMENT, eventData);
  }

  private async removeRequirementEventTracking(
    control_id: string,
    framework_id: string,
    requirement_name: string
  ): Promise<void> {
    const eventData = await this.prepareEventDataForRequirementAsync(control_id, framework_id, requirement_name);
    this.userEventService.sendEvent(UserEvents.REMOVE_REQUIREMENT, eventData);
  }

  private async sendRequirementVeaSlackEventTracking(
    control_id: string,
    framework_id: string,
    requirement_name: string
  ): Promise<void> {
    const eventData = await this.prepareEventDataForRequirementAsync(control_id, framework_id, requirement_name);
    this.userEventService.sendEvent(UserEvents.SEND_VIA_SLACK_REQUIREMENT, eventData);
  }
}
