import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownMenuModule } from 'core/modules/dropdown-menu';
import { CoreModule } from 'core/core.module';
import { MultiselectCheckmarkComponent, MultiselectHostComponent } from './components';

@NgModule({
  declarations: [MultiselectHostComponent, MultiselectCheckmarkComponent],
  imports: [CommonModule, CoreModule, TranslateModule.forChild(), DropdownMenuModule],
  exports: [MultiselectHostComponent, MultiselectCheckmarkComponent],
})
export class MultiselectModule {
}
