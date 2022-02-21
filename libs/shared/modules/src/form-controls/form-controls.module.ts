import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { LoadersModule } from '../loaders';
import { DirectivesModule } from './../directives';
import {
  CheckboxComponent,
  CheckboxGroupComponent,
  CopyTextFieldComponent,
  FileInputComponent,
  RadioButtonComponent,
  RadioButtonGroupComponent,
  TextAreaComponent,
  TextFieldComponent,
  ToggleComponent
} from './components';
import {
  AutocompleteComponent,
  ClearButtonComponent,
  ControlErrorsComponent,
  ControlHeaderComponent,
  IndexIconComponent,
  ControlPlaceholderComponent,
  CharactersCounterComponent,
} from './components/atoms';
import { DatePickerHeaderComponent } from './components/date-picker-header/date-picker-header.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { MultiselectableListComponent } from './components/multiselecting-list/multiselecting-list.component';
import { ToggleBoxComponent } from './components/toggle-box/toggle-box.component';
import { UtilsModule } from 'core/modules/utils';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SvgIconsModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatMenuModule,
    MatButtonModule,
    MatProgressBarModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    TranslateModule.forChild(),
    DirectivesModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LoadersModule,
    UtilsModule
  ],
  declarations: [
    AutocompleteComponent,
    CheckboxComponent,
    CheckboxGroupComponent,
    CopyTextFieldComponent,
    FileInputComponent,
    RadioButtonComponent,
    RadioButtonGroupComponent,
    TextFieldComponent,
    TextAreaComponent,
    MultiselectableListComponent,
    ClearButtonComponent,
    DatePickerComponent,
    DatePickerHeaderComponent,
    ControlHeaderComponent,
    ControlErrorsComponent,
    IndexIconComponent,
    ControlPlaceholderComponent,
    CharactersCounterComponent,
    ToggleBoxComponent,
    ToggleComponent
  ],
  exports: [
    AutocompleteComponent,
    CheckboxComponent,
    CheckboxGroupComponent,
    CopyTextFieldComponent,
    FileInputComponent,
    RadioButtonComponent,
    RadioButtonGroupComponent,
    TextFieldComponent,
    TextAreaComponent,
    DatePickerComponent,
    MultiselectableListComponent,
    ControlHeaderComponent,
    ControlErrorsComponent,
    ToggleComponent,
    ControlPlaceholderComponent,
    ToggleBoxComponent
  ],
})
export class FormControlsModule {}
