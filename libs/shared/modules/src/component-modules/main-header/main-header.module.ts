import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainHeaderComponent } from './component/main-header.component';
import { SearchModule } from 'core/modules/data-manipulation/search';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from 'core';
import { DataManipulationModule } from 'core/modules/data-manipulation';


@NgModule({
  declarations: [ MainHeaderComponent ],
  imports: [
    CommonModule,
    SearchModule,
    TranslateModule.forChild(),
    CoreModule,
    DataManipulationModule
  ],
  exports: [ MainHeaderComponent ]
})
export class MainHeaderModule { }
