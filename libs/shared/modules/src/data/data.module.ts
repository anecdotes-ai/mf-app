import { AgentsEffects } from './store/effects/agent.effect';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import {
  FrameworksEventService,
  ActionDispatcherService,
  ControlCalculationService,
  ControlsFacadeService,
  ControlsService,
  CustomerService,
  DashboardFacadeService,
  EvidenceService,
  FrameworkService,
  FrameworksFacadeService,
  PluginNotificationFacadeService,
  OperationsTrackerService,
  PluginFacadeService,
  PluginService,
  RequirementCalculationService,
  PolicyCalculationService,
  RequirementsFacadeService,
  CategoriesFacadeService,
  CustomerFacadeService,
  PluginsMetaFacadeService,
  PolicyService,
  PoliciesFacadeService,
  EvidenceFacadeService,
  SnapshotsService,
  SnapshotsFacadeService,
  DataAggregationFacadeService,
  RequirementService,
  SlackService
} from './services';
import {
  ControlCalculationEffects,
  ControlEffects,
  DashboardEffects,
  EvidenceEffects,
  FrameworkEffects,
  RequirementEffects,
  ServicesEffects,
  RequirementCalculationEffects,
  PoliciesEffects,
  PolicyCalculationEffects,
  CustomerEffects,
  SnapshotEffects
} from './store/effects';
import { reducers, featureKey } from './store';
import { StoreModule } from '@ngrx/store';
import { AgentService } from './services/agent/agent.service';
import { MultiAccountsEventService } from './services/event-tracking/multi-accounts-event-service/multi-accounts-event.service';
import { EvidenceUserEventService } from './services/event-tracking/evidence-user-event.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(featureKey, reducers),
    EffectsModule.forFeature([
      ControlEffects,
      EvidenceEffects,
      ServicesEffects,
      FrameworkEffects,
      RequirementEffects,
      DashboardEffects,
      CustomerEffects,
      ControlCalculationEffects,
      RequirementCalculationEffects,
      PolicyCalculationEffects,
      PoliciesEffects,
      AgentsEffects,
      SnapshotEffects
    ]),
  ],
  declarations: [],
})
export class DataModule {
  static forRoot(): ModuleWithProviders<DataModule> {
    return {
      ngModule: DataModule,
      providers: [
        FrameworksEventService,
        ControlsService,
        FrameworkService,
        EvidenceService,
        PluginService,
        AgentService,
        MultiAccountsEventService,
        RequirementService,
        SlackService,
        ControlCalculationService,
        RequirementCalculationService,
        PolicyCalculationService,
        PluginFacadeService,
        PluginNotificationFacadeService,
        ControlsFacadeService,
        FrameworksFacadeService,
        DashboardFacadeService,
        RequirementsFacadeService,
        OperationsTrackerService,
        ActionDispatcherService,
        CustomerService,
        CategoriesFacadeService,
        CustomerFacadeService,
        PluginsMetaFacadeService,
        PolicyService,
        PoliciesFacadeService,
        EvidenceFacadeService,
        SnapshotsService,
        SnapshotsFacadeService,
        DataAggregationFacadeService,
        EvidenceUserEventService
      ],
    };
  }
}
