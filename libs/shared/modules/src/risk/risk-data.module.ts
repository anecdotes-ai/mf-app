import { ModuleWithProviders, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import {
  RiskFacadeService,
  RiskService,
  RiskSourceFacadeService,
  RiskCategoryFacadeService,
  AddRiskModalService,
  MitigateControlsModalService,
  RiskFilterService,
  RiskManagerEventService,
} from './services';
import { DirectivesModule } from 'core/modules/directives/directives.module';
import { UtilsModule } from 'core/modules/utils';
import { DynamicFormModule } from 'core/modules/dynamic-form';
import { CoreModule } from 'core';
import { featureKey, reducers } from './store';
import { effects } from './store/effects';
import { AddRiskModalComponent, MitigateControlsModalComponent } from './components';

@NgModule({
  declarations: [AddRiskModalComponent, MitigateControlsModalComponent],
  imports: [
    CoreModule,
    CommonModule,
    UtilsModule,
    DirectivesModule,
    DynamicFormModule,
    StoreModule.forFeature(featureKey, reducers),
    EffectsModule.forFeature(effects),
    TranslateModule.forChild(),
  ],

  providers: [
    RiskFacadeService,
    RiskService,
    RiskSourceFacadeService,
    RiskCategoryFacadeService,
    AddRiskModalService,
    MitigateControlsModalService,
    RiskManagerEventService,
  ],
  exports: [AddRiskModalComponent],
})
export class RiskDataModule {
  static forRoot(): ModuleWithProviders<RiskDataModule> {
    return {
      ngModule: RiskDataModule,
      providers: [
        RiskFacadeService,
        RiskService,
        RiskSourceFacadeService,
        RiskCategoryFacadeService,
        AddRiskModalService,
        RiskFilterService,
        RiskManagerEventService,
      ],
    };
  }
}
