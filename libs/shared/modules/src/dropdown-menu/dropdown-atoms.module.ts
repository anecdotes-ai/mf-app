import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconsModule } from 'core/modules/svg-icons';
import {
  DropdownOptionComponent,
  DropdownOptionsBackdropComponent,
  TabOptionComponent,
  ColoredDropdownMenuButtonComponent,
  AddOptionComponent,
  ClearOptionComponent,
} from './components/atoms';
import { UtilsModule } from '../utils';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DirectivesModule } from 'core/modules/directives';

@NgModule({
  declarations: [
    DropdownOptionsBackdropComponent,
    DropdownOptionComponent,
    TabOptionComponent,
    ColoredDropdownMenuButtonComponent,
    AddOptionComponent,
    ClearOptionComponent,
  ],
  exports: [
    DropdownOptionComponent,
    DropdownOptionsBackdropComponent,
    TabOptionComponent,
    ColoredDropdownMenuButtonComponent,
    AddOptionComponent,
    ClearOptionComponent,
  ],
  imports: [CommonModule, SvgIconsModule, TranslateModule, UtilsModule, NgbTooltipModule, DirectivesModule]
})
export class DropdownAtomsModule {}
