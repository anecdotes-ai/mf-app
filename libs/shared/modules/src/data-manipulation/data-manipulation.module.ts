import { ModuleWithProviders, NgModule } from '@angular/core';
import { DataFilterModule } from './data-filter';
import { SearchModule } from './search';
import { DataSortModule } from './sort/data-sort.module';

@NgModule({
  imports: [DataFilterModule.forRoot(), SearchModule.forRoot()],
})
export class DataManipulationRootModule {}

@NgModule({
  imports: [DataFilterModule, SearchModule, DataSortModule],
  declarations: [],
  providers: [],
  exports: [DataFilterModule, SearchModule, DataSortModule],
})
export class DataManipulationModule {
  static forRoot(): ModuleWithProviders<DataManipulationRootModule> {
    return {
      ngModule: DataManipulationRootModule,
      providers: [],
    };
  }
}
