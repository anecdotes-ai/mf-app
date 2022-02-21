import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DataSortComponent } from './components';
import { DropdownMenuModule } from 'core/modules/dropdown-menu';
import { ButtonsModule } from 'core/modules/buttons';

@NgModule({
  imports: [CommonModule, DropdownMenuModule, ButtonsModule],
  declarations: [DataSortComponent],
  exports: [DataSortComponent],
})
export class DataSortModule {}
