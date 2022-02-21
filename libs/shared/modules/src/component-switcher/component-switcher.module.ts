import { ComponentSwitcherDirective } from './directives';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [ComponentSwitcherDirective],
  providers: [ComponentSwitcherDirective],
  exports: [ComponentSwitcherDirective],
})
export class ComponentSwitcherModule {}
