import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from 'core/core.module';
import { DataSearchComponent, SearchableTextComponent, SearchResultsPaginationComponent } from './components';
import { SearchableRowDirective, SearchScopeDirective } from './directives';
import { SearchInstancesManagerService } from './services';

@NgModule({
  declarations: [
    DataSearchComponent,
    SearchResultsPaginationComponent,
    SearchableTextComponent,
    SearchScopeDirective,
    SearchableRowDirective,
  ],
  imports: [CommonModule, CoreModule, TranslateModule.forChild()],
  exports: [
    DataSearchComponent,
    SearchResultsPaginationComponent,
    SearchableTextComponent,
    SearchScopeDirective,
    SearchableRowDirective,
  ],
})
export class SearchModule {
  static forRoot(): ModuleWithProviders<SearchModule> {
    return {
      ngModule: SearchModule,
      providers: [SearchInstancesManagerService]
    };
  }
}
