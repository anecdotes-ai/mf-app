import { InviteUserModule } from 'core/modules/invite-user';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { ConnectionStateSwitcherService } from './services/connection-state-switcher/connection-state-switcher.service';
import { ComponentSwitcherModule } from 'core/modules/component-switcher';
import { PluginStaticStateComponent } from './components';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from 'core/core.module';
import { SearchModule } from 'core/modules/data-manipulation/search';
import { ButtonsModule } from './../buttons/buttons.module';
import { UtilsModule } from './../utils';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as storeFeature from './store';
import * as storeEffects from './store/effects';
import { PluginConnectionAreaComponent } from './components/plugin-connection-area/plugin-connection-area.component';
import { PluginStaticStateHeaderComponent } from './components/plugin-connection-states/plugin-static-state-header/plugin-static-state-header.component';
import { DropdownMenuModule } from 'core/modules/dropdown-menu';
import { TipsModule } from 'core/modules/tips/tips.module';
import { PluginCustomStateComponent } from './components/plugin-connection-states/plugin-custom-state/plugin-custom-state.component';
import { PluginStaticStateTipComponent } from './components/plugin-connection-states/plugin-static-state-tip/plugin-static-state-tip.component';
import { PluginFormConnectionBaseComponent, PluginOauthConnectionComponent } from './components/plugin-connections';
import { DynamicFormModule } from 'core/modules/dynamic-form';
import { PluginGenericConnectionComponent } from './components/plugin-connections/plugin-generic-connection/plugin-generic-connection.component';
import { PluginOauthWithFormConnectionComponent } from './components/plugin-connections/plugin-oauth-with-form-connection/plugin-oauth-with-form-connection.component';
import {
  PluginConnectionFormBuilderService,
  TextFieldHandler,
  FileFieldHandler,
  CheckBoxGroupFieldHandler,
  CopiableFieldHandler,
  CheckboxFieldHandler,
  OAuthUrlHandlerService,
  PluginConnectionFacadeService,
  PluginsEventService,
  DropdownFieldHandler,
  MultiDropdownHandler
} from './services';
import { RouterModule } from '@angular/router';
import { PluginAccountsListStateComponent } from './components/plugin-connections/plugin-multiple-accounts/plugin-accounts-list-state/plugin-accounts-list-state.component';
import { PluginAccountItemComponent } from './components/plugin-connections/plugin-multiple-accounts/plugin-account-item/plugin-account-item.component';
import { AllPluginConnectionFormsComponent } from './components/plugin-connections/all-plugin-connection-forms/all-plugin-connection-forms.component';
import { ConfirmMultipleAccountsConnectionModalComponent } from './components/modals/confirm-multiple-accounts-connection-modal/confirm-multiple-accounts-connection-modal.component';

@NgModule({
  declarations: [
    AllPluginConnectionFormsComponent,
    PluginStaticStateComponent,
    PluginConnectionAreaComponent,
    PluginStaticStateHeaderComponent,
    PluginCustomStateComponent,
    PluginStaticStateTipComponent,
    PluginOauthConnectionComponent,
    PluginFormConnectionBaseComponent,
    PluginGenericConnectionComponent,
    PluginOauthWithFormConnectionComponent,
    PluginAccountsListStateComponent,
    PluginAccountItemComponent,
    ConfirmMultipleAccountsConnectionModalComponent,
  ],
  imports: [
    InviteUserModule,
    CoreModule,
    CommonModule,
    SearchModule,
    UtilsModule,
    SvgIconsModule,
    TranslateModule.forChild(),
    DynamicFormModule,
    ButtonsModule,
    DropdownMenuModule,
    TipsModule,
    ComponentSwitcherModule,
    StoreModule.forFeature(storeFeature.featureKey, storeFeature.reducers),
    EffectsModule.forFeature([storeEffects.PluginConnectionEffects]),
    RouterModule
  ],
  providers: [
    PluginConnectionFacadeService,
    ConnectionStateSwitcherService,
    OAuthUrlHandlerService,
    PluginConnectionFormBuilderService,
    PluginsEventService,
    TextFieldHandler,
    FileFieldHandler,
    CheckBoxGroupFieldHandler,
    CopiableFieldHandler,
    CheckboxFieldHandler,
    DropdownFieldHandler,
    MultiDropdownHandler
  ],
  exports: [
    PluginStaticStateComponent,
    PluginCustomStateComponent,
    PluginConnectionAreaComponent,
    PluginStaticStateHeaderComponent,
    PluginOauthConnectionComponent,
    PluginFormConnectionBaseComponent,
    AllPluginConnectionFormsComponent
  ],
})
export class PluginsConnectionModule {
  static forRoot(): ModuleWithProviders<PluginsConnectionModule> {
    return {
      ngModule: PluginsConnectionModule,
      providers: [
        PluginConnectionFacadeService,
        PluginsEventService,
      ],
    };
  }
}
