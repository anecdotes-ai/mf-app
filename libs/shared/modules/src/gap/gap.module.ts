import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GapMarkComponent } from './components/gap-mark/gap-mark.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SvgIconsModule } from 'core/modules/svg-icons';

@NgModule({
  declarations: [GapMarkComponent],
  imports: [
    CommonModule,
    NgbTooltipModule,
    SvgIconsModule,
  ],
  exports: [GapMarkComponent],
})
export class GapModule { }
