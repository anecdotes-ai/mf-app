import { ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { DataInitalizationCanActivate } from './services';
import * as effects from './store/effects';
import * as storeFeature from './store';
import { StoreModule } from '@ngrx/store';

@NgModule({
  imports: [
    EffectsModule.forFeature([effects.InitializationEffects]),
    StoreModule.forFeature(storeFeature.featureKey, storeFeature.reducers),
  ],
})
export class DataInitializationModule {
  static forRoot(): ModuleWithProviders<DataInitializationModule> {
    return {
      ngModule: DataInitializationModule,
      providers: [DataInitalizationCanActivate],
    };
  }
}
