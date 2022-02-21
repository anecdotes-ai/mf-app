import { Injectable } from '@angular/core';

import { RiskManagerEventDataProperty, UserEvents } from 'core/models/user-events/user-event-data.model';
import { EvidenceLike } from 'core/modules/data/models';
import { ControlStatusEnum } from 'core/modules/data/models/domain/index';
import { DetailedRisk } from 'core/modules/risk/models';
import { EvidenceCollectionTypeEnum } from 'core/modules/shared-controls/models/evidence-collection-modal-params';
import { UserEventService } from 'core/services/user-event/user-event.service';

@Injectable()
export class RiskManagerEventService {
  constructor(
    private userEventService: UserEventService,
  ) {}

  trackAddSupportingDocumentEvent(evidence: EvidenceLike, evidenceType: EvidenceCollectionTypeEnum, riskName: string, riskCategory = ''): void {
    const documentName = evidence.name.substring(0, evidence.name.lastIndexOf('.'));

    this.userEventService.sendEvent(UserEvents.ADD_SUPPORTING_DOCUMENT, {
      [RiskManagerEventDataProperty.EvidenceType]: evidenceType,
      [RiskManagerEventDataProperty.PluginName]: evidence.service_display_name,
      [RiskManagerEventDataProperty.DocumentName]: documentName,
      [RiskManagerEventDataProperty.RiskName]: riskName,
      [RiskManagerEventDataProperty.RiskCategory]: riskCategory || '',
    });
  }

  trackCreatedRiskEvent(risk: DetailedRisk, riskCategory = '', riskSource = ''): void {
    this.userEventService.sendEvent(UserEvents.CREATE_RISK, {
      [RiskManagerEventDataProperty.RiskName]: risk.name,
      [RiskManagerEventDataProperty.RiskCategory]: riskCategory,
      [RiskManagerEventDataProperty.CustomCategory]: risk.isCustomCategory,
      [RiskManagerEventDataProperty.RiskSource]: riskSource,
      [RiskManagerEventDataProperty.CustomSource]: risk.isCustomSource,
      [RiskManagerEventDataProperty.RiskEffect]: risk.effect?.join(', '),
      [RiskManagerEventDataProperty.RiskStrategy]: risk.strategy,
    });
  }

  trackEditRiskEvent(riskName: string, editedField: string, previousValue: string, newValue: string): void {
    this.userEventService.sendEvent(UserEvents.EDIT_RISK, {
      [RiskManagerEventDataProperty.RiskName]: riskName,
      [RiskManagerEventDataProperty.EditedField]: editedField,
      [RiskManagerEventDataProperty.PreviousValue]: previousValue,
      [RiskManagerEventDataProperty.NewValue]: newValue,
    });
  }

  trackDeleteRiskEvent(riskName: string, riskCategory = '', riskStrategy: string, riskLevel: string): void {
    this.userEventService.sendEvent(UserEvents.DELETE_RISK, {
      [RiskManagerEventDataProperty.RiskName]: riskName,
      [RiskManagerEventDataProperty.RiskCategory]: riskCategory,
      [RiskManagerEventDataProperty.RiskStrategy]: riskStrategy,
      [RiskManagerEventDataProperty.RiskLevel]: riskLevel,
    });
  }

  trackSelectOwnerEvent(riskName: string, riskCategory = '', riskStrategy: string, riskLevel: string): void {
    this.userEventService.sendEvent(UserEvents.SELECT_OWNER, {
      [RiskManagerEventDataProperty.RiskName]: riskName,
      [RiskManagerEventDataProperty.RiskCategory]: riskCategory,
      [RiskManagerEventDataProperty.RiskStrategy]: riskStrategy,
      [RiskManagerEventDataProperty.RiskLevel]: riskLevel,
    });
  }

  trackViewControlEvent(frameworkName: string, controlName: string, controlCategory: string, riskName: string, riskCategory = ''): void {
    this.userEventService.sendEvent(UserEvents.VIEW_CONTROL, {
      [RiskManagerEventDataProperty.FrameworkName]: frameworkName,
      [RiskManagerEventDataProperty.ControlName]: controlName,
      [RiskManagerEventDataProperty.ControlCategory]: controlCategory,
      [RiskManagerEventDataProperty.RiskName]: riskName,
      [RiskManagerEventDataProperty.RiskCategory]: riskCategory,
    });
  }

  trackDisconnectControlEvent(frameworkName: string, controlName: string, controlCategory: string, riskName: string, riskCategory = ''): void {
    this.userEventService.sendEvent(UserEvents.DISCONNECT_CONTROL, {
      [RiskManagerEventDataProperty.FrameworkName]: frameworkName,
      [RiskManagerEventDataProperty.ControlName]: controlName,
      [RiskManagerEventDataProperty.ControlCategory]: controlCategory,
      [RiskManagerEventDataProperty.RiskName]: riskName,
      [RiskManagerEventDataProperty.RiskCategory]: riskCategory,
    });
  }

  trackLinkControlEvent(riskName: string, controlName: string, frameworkName: string, controlStatus: ControlStatusEnum, controlCategory: string): void {
    this.userEventService.sendEvent(UserEvents.LINK_CONTROL, {
      [RiskManagerEventDataProperty.RiskName]: riskName,
      [RiskManagerEventDataProperty.ControlName]: controlName,
      [RiskManagerEventDataProperty.FrameworkName]: frameworkName,
      [RiskManagerEventDataProperty.ControlStatus]: controlStatus,
      [RiskManagerEventDataProperty.ControlCategory]: controlCategory,
    });
  }

  trackHowRiskLevelIsCalculatedEvent(riskName: string, riskCategory = '', riskStrategy: string, riskLevel: string): void {
    this.userEventService.sendEvent(UserEvents.HOW_RISK_LEVEL_IS_CALCULATED, {
      [RiskManagerEventDataProperty.RiskName]: riskName,
      [RiskManagerEventDataProperty.RiskCategory]: riskCategory,
      [RiskManagerEventDataProperty.RiskStrategy]: riskStrategy,
      [RiskManagerEventDataProperty.RiskLevel]: riskLevel,
    });
  }
}
