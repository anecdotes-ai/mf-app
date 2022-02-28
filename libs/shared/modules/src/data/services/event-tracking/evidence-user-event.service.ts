import { DataAggregationFacadeService } from 'core/modules/data/services';
import { CalculatedControl } from 'core/modules/data/models';
import { Injectable } from '@angular/core';
import { EvidenceEventData, EvidenceEventDataProperty, UserEvents, MultiAccountsData, MultiAccountsDataProperty } from 'core/models';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { ControlsFacadeService } from '../facades/controls-facade/controls-facade.service';
import { take, first, map } from 'rxjs/operators';

@Injectable()
export class EvidenceUserEventService {
  constructor(
    private userEventService: UserEventService,
    private dataAggregationFacade: DataAggregationFacadeService,
    private controlFacade: ControlsFacadeService
  ) {}

  async trackCsvExport(
    evidence_id: string,
    evidence_name: string,
    evidence_type: string,
    source: string
  ): Promise<void> {
    let eventData = await this.prepareEventDataForRequirementAsync(evidence_id, evidence_name, evidence_type);
    eventData = {
      ...eventData,
      [EvidenceEventDataProperty.Source]: source,
    };
    this.userEventService.sendEvent(UserEvents.EXPORT_EVIDENCE_TO_CSV, eventData);
  }

  async trackViewFullData(evidence_id: string, evidence_name: string, evidence_type: string): Promise<void> {
    let eventData = await this.prepareEventDataForRequirementAsync(evidence_id, evidence_name, evidence_type);
    eventData = {
      ...eventData,
    };
    this.userEventService.sendEvent(UserEvents.VIEW_FULL_DATA, eventData);
  }

  async trackEvidenceDownload(
    evidence_id: string,
    evidence_name: string,
    evidence_type: string,
    source: string
  ): Promise<void> {
    let eventData = await this.prepareEventDataForRequirementAsync(evidence_id, evidence_name, evidence_type);
    eventData = {
      ...eventData,
      [EvidenceEventDataProperty.Source]: source,
    };
    this.userEventService.sendEvent(UserEvents.EVIDENCE_DOWNLOAD, eventData);
  }

  async trackEvidenceRemove(evidence_id: string, evidence_name: string, evidence_type: string): Promise<void> {
    let eventData = await this.prepareEventDataForRequirementAsync(evidence_id, evidence_name, evidence_type);
    eventData = {
      ...eventData,
    };
    this.userEventService.sendEvent(UserEvents.EVIDENCE_REMOVE, eventData);
  }

  async trackFlagHover(
    evidence_id: string,
    evidence_name: string,
    evidence_type: string,
    source: string
  ): Promise<void> {
    let eventData = await this.prepareEventDataForRequirementAsync(evidence_id, evidence_name, evidence_type);
    eventData = {
      ...eventData,
      [EvidenceEventDataProperty.Source]: source,
    };
    this.userEventService.sendEvent(UserEvents.EVIDENCE_FLAG_HOVER, eventData);
  }

  trackLinkedControlClickEvent(evidenceName: string, frameworkNames: string[], controlsAmount: number): void {
    this.userEventService.sendEvent(UserEvents.EVIDENCE_LINKED, {
      [EvidenceEventDataProperty.EvidenceName]: evidenceName,
      [EvidenceEventDataProperty.FrameworksLinked]: frameworkNames.join(', '),
      [EvidenceEventDataProperty.AmountOfLinkedControls]: controlsAmount,
    });
  }

  private async prepareEventDataForRequirementAsync(
    evidence_id: string,
    evidence_name: string,
    evidence_type: string
  ): Promise<EvidenceEventData> {
    const frameworkNames = await this.dataAggregationFacade
      .getEvidenceReferences(evidence_id)
      .pipe(
        map((references) => references.map((reference) => reference.framework.framework_name).join(', ')),
        take(1)
      )
      .toPromise();

    const controls: CalculatedControl[] = await this.controlFacade.getAllControls().pipe(first()).toPromise();

    const firstControl: CalculatedControl = controls.filter((c) => c.control_collected_all_applicable_evidence_ids.includes(evidence_id))[0];

    const requirement = firstControl?.control_calculated_requirements.find((req) =>
      req.requirement_related_evidences.find((evidenceLike) => evidenceLike.evidence.evidence_id === evidence_id)
    );

    return {
      [EvidenceEventDataProperty.FrameworkName]: frameworkNames || undefined,
      [EvidenceEventDataProperty.ControlName]: firstControl?.control_name,
      [EvidenceEventDataProperty.RequirementName]: requirement?.requirement_name,
      [EvidenceEventDataProperty.RequirementType]: requirement?.requirement_is_custom ? 'custom made' : 'existed',
      [EvidenceEventDataProperty.EvidenceName]: evidence_name,
      [EvidenceEventDataProperty.EvidenceType]: evidence_type.toLowerCase(),
    };
  }

  async trackMultiAccountWithPluginName(event: UserEvents, plugin_name: string): Promise<void> {
    this.userEventService.sendEvent(
      event,
      {
        [MultiAccountsDataProperty.PluginName]: plugin_name,
      }
    );
  }

  async trackEditAccount(plugin_name: string, plugin_alias?: string): Promise<void> {
    this.userEventService.sendEvent(
      UserEvents.EDIT_ACCOUNT,
      {
        [MultiAccountsDataProperty.PluginName]: plugin_name,
        [MultiAccountsDataProperty.AccountAlias]: plugin_alias ? "changed" : "not changed",
      }
    );
  }

  async trackConnectAccounts(plugin_name: string, number_of_connected: number, number_of_succeeded?: number, total_connected?: number): Promise<void> {
    this.userEventService.sendEvent(
      UserEvents.CONNECT_ACCOUNTS,
      {
        [MultiAccountsDataProperty.PluginName]: plugin_name,
        [MultiAccountsDataProperty.NumberOfConnectedAccounts]: number_of_connected,
        [MultiAccountsDataProperty.NumberOfSucceededConnections]: number_of_succeeded,
        [MultiAccountsDataProperty.TotalConnectedAccounts]: total_connected,
      }
    );
  }
}
