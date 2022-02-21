import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from './components/avatar/avatar.component';
import { SvgIconsModule } from 'core/modules/svg-icons';


@NgModule({
  declarations: [
    AvatarComponent
  ],
  imports: [
    CommonModule,
    SvgIconsModule
  ],
  exports: [AvatarComponent]
})
export class AvatarModule { }
