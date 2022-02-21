import { CarouselModule } from './../carousel/carousel.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonsModule } from 'core/modules/buttons';
import { SvgIconsModule } from 'core/modules/svg-icons';
import {
  ActionMenuButtonComponent,
  ColoredDropdownMenuComponent,
  TabsComponent,
  DropdownButtonComponent,
  DropdownSearchInputComponent,
  MultiDropdownControlComponent,
  DropdownControlComponent,
  ColoredDropdownControlComponent,
} from './components';
import { ThreeDotsMenuComponent } from './components/three-dots-menu/three-dots-menu.component';
import { DropdownAtomsModule } from './dropdown-atoms.module';
import { RouterModule } from '@angular/router';
import { DirectivesModule } from 'core/modules/directives/directives.module';
import { FormControlsModule } from 'core/modules/form-controls';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
  declarations: [
    ThreeDotsMenuComponent,
    ActionMenuButtonComponent,
    ColoredDropdownMenuComponent,
    TabsComponent,
    DropdownButtonComponent,
    DropdownSearchInputComponent,
    MultiDropdownControlComponent,
    DropdownControlComponent,
    ColoredDropdownControlComponent
  ],
  exports: [
    ThreeDotsMenuComponent,
    ActionMenuButtonComponent,
    ColoredDropdownMenuComponent,
    TabsComponent,
    DropdownButtonComponent,
    DropdownSearchInputComponent,
    MultiDropdownControlComponent,
    DropdownControlComponent,
    ColoredDropdownControlComponent
  ],
  imports: [
    CommonModule,
    DropdownAtomsModule,
    MatMenuModule,
    SvgIconsModule,
    TranslateModule,
    NgbTooltipModule,
    ButtonsModule,
    RouterModule,
    DirectivesModule,
    FormControlsModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    PerfectScrollbarModule,
    CarouselModule
  ]
})
export class DropdownMenuModule {}
