import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BindControlInputsDirective,
  BindControlOutputsDirective,
  DynamicFormControlOutletDirective,
} from './directives';
import { DynamicFormOutletComponent } from './components';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

const directives = [BindControlInputsDirective, BindControlOutputsDirective, DynamicFormControlOutletDirective];
const components = [DynamicFormOutletComponent];

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  declarations: [...directives, ...components],
  providers: [],
  exports: [...directives, ...components, ReactiveFormsModule, FormsModule],
})
export class DynamicFormModule {}
