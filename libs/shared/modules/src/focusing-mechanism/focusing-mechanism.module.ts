import { ModuleWithProviders, NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { reducers, featureKey } from './store';
import { FocusingService } from './services/focusing/focusing.service';

@NgModule({})
export class FocusingMechanismModule {
  static forRoot(): ModuleWithProviders<FocusingMechanismModule> {
    return {
      ngModule: FocusingMechanismModule,
      providers: [...StoreModule.forFeature(featureKey, reducers).providers, FocusingService],
    };
  }
}
