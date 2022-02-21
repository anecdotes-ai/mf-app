import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonNewComponent,
  FilterButtonComponent,
  ComingSoonButtonComponent,
  IconButtonComponent,
  CrossButtonComponent
} from './components';
import { LoadersModule } from '../loaders';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconsModule } from 'core/modules/svg-icons';

@NgModule({
  imports: [CommonModule, SvgIconsModule, LoadersModule, TranslateModule],
  declarations: [ButtonNewComponent, FilterButtonComponent, ComingSoonButtonComponent, IconButtonComponent, CrossButtonComponent],
  exports: [ButtonNewComponent, FilterButtonComponent, ComingSoonButtonComponent, IconButtonComponent, CrossButtonComponent],
})
export class ButtonsModule {}
