import { AgentsEffects } from './store/effects/agent.effect';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
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
  DataAggregationFacadeService
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
  EvidenceCalculationEffects,
  PoliciesEffects,
  PolicyCalculationEffects,
  CustomerEffects,
  SnapshotEffects
} from './store/effects';
import { reducers } from './store/state';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot(reducers, {
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false,
        strictStateSerializability: false,
        strictActionSerializability: false,
        strictActionWithinNgZone: true,
        strictActionTypeUniqueness: true,
      },
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    EffectsModule.forRoot([
      ControlEffects,
      EvidenceEffects,
      ServicesEffects,
      FrameworkEffects,
      RequirementEffects,
      DashboardEffects,
      CustomerEffects,
      ControlCalculationEffects,
      RequirementCalculationEffects,
      EvidenceCalculationEffects,
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
        DataAggregationFacadeService
      ],
    };
  }
}
