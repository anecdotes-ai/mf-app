import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { CoreModule } from 'core/core.module';
import { SearchModule } from 'core/modules/data-manipulation/search';
import { ButtonsModule } from './../buttons/buttons.module';
import { UtilsModule } from './../utils';
import {
  AutomationSmallPluginItemComponent,
  BigPluginItemComponent,
  FavoritePluginStarButtonComponent,
  PluginIconComponent
} from './components';
import { PluginLabelComponent } from './components/plugin-label/plugin-label.component';

@NgModule({
  declarations: [
    BigPluginItemComponent,
    AutomationSmallPluginItemComponent,
    FavoritePluginStarButtonComponent,
    PluginIconComponent,
    PluginLabelComponent
  ],
  imports: [
    CoreModule,
    CommonModule,
    SearchModule,
    SvgIconsModule,
    UtilsModule,
    TranslateModule.forChild(),
    ButtonsModule
  ],
  exports: [
    BigPluginItemComponent,
    AutomationSmallPluginItemComponent,
    FavoritePluginStarButtonComponent,
    PluginIconComponent
  ],
})
export class SharedPluginsModule { }
