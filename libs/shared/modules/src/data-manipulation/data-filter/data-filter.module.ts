import { DataFilterComponent, DataFilterOutletComponent, SimpleDataFilterComponent, BaseDataFilterComponent, SelectedFiltersListComponent, DataFilterButtonComponent } from './components';
import { DataFilterManagerService } from './services/index';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'core/core.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [
    DataFilterComponent,
    DataFilterOutletComponent,
    SimpleDataFilterComponent,
    BaseDataFilterComponent,
    SelectedFiltersListComponent,
    DataFilterButtonComponent
  ],
  imports: [CommonModule, CoreModule, MatExpansionModule, TranslateModule.forChild()],
  exports: [
    DataFilterComponent,
    DataFilterOutletComponent,
    SimpleDataFilterComponent,
    BaseDataFilterComponent,
    SelectedFiltersListComponent,
    DataFilterButtonComponent
  ],
})
export class DataFilterModule {
  static forRoot(): ModuleWithProviders<DataFilterModule> {
    return {
      ngModule: DataFilterModule,
      providers: [
        DataFilterManagerService,
      ],
    };
  }
}
