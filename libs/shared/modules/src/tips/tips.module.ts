import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { LoadersModule } from './../loaders/loaders.module';
import { TipComponent } from './components';
import { TipManagerService } from './services';



@NgModule({
  declarations: [TipComponent],
  imports: [
    CommonModule,
    TranslateModule,
    SvgIconsModule.forRoot(),
    LoadersModule,
    RouterModule,
    NgbTooltipModule
  ],
  exports: [
    TipComponent,
  ],
  providers: [
    TipManagerService
  ]
})
export class TipsModule { }
