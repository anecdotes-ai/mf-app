import { PipesModule } from 'core/modules/pipes/pipes.module';
import { UtilsModule } from 'core/modules/utils';
import { ModalsModule } from 'core/modules/modals/modals.module';
import { DirectivesModule } from 'core/modules/directives';
import { UserProfileModule } from 'core/modules/user-profile';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicIoModule } from 'ng-dynamic-component';
import { LottieModule } from 'ngx-lottie';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import {
  ButtonComponent,
  ChartWavePercentComponent,
  CollapsableSideBarComponent,
  ComingSoonComponent,
  ConnectivityNotificationComponent,
  DataSelectComponent,
  DateViewComponent,
  FrameworksIconComponent,
  MetadataViewComponent,
  ModalWindowOutletComponent,
  NotFoundComponent,
  NotificationOutletComponent,
  PagerComponent,
  SpecificInformationItemComponent,
  TimeframeViewComponent,
  GlobalLoaderComponent,
} from './components';
import { ControlsStatusBarComponent } from './components/controls-status-bar/controls-status-bar.component';
import { DataTabsSelectComponent } from './components/data-tabs-select/data-tabs-select.component';
import { MobileComingSoonComponent } from './components/mobile-coming-soon/mobile-coming-soon.component';
import { ShapedFooterComponent } from './components/shaped-footer/shaped-footer.component';
import { RedirectGuard, AuditorPortalGuard } from './guards';
import { ComponentSwitcherModule } from 'core/modules/component-switcher/component-switcher.module';
import {
  AppConfigService,
  eventHandlers,
  eventHandlerToken,
  FileDownloadingHelperService,
  InitializerCanActivateService,
  IntercomService,
  LoaderManagerService,
  LoggerService,
  MessageBusService,
  RouterExtensionService,
  TokenInterceptorService,
  UpdatesService,
  UserFlowService,
  OwnerFilterService,
  RequirementEventService,
} from './services';
import { CollectionNotificationComponent } from './components/notifications/collection-notification/collection-notification.component';
import { LoadersModule } from 'core/modules/loaders';
import { FormControlsModule } from 'core/modules/form-controls';
import { ButtonsModule } from 'core/modules/buttons';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { AvatarModule } from 'core/modules/avatar/avatar.module';
import { DropdownMenuModule } from 'core/modules/dropdown-menu';
import { TimeAgoDateViewComponent } from './components/time-ago-date-view/time-ago-date-view.component';
import { LogItemComponent } from './components/log-item/log-item.component';
import { CarouselModule } from 'core/modules/carousel/carousel.module';

export const WINDOW = new InjectionToken<Window>('window');

@NgModule({
  declarations: [
    CollapsableSideBarComponent,
    FrameworksIconComponent,
    ModalWindowOutletComponent,
    NotFoundComponent,
    PagerComponent,
    ButtonComponent,
    ComingSoonComponent,
    NotificationOutletComponent,
    ConnectivityNotificationComponent,
    SpecificInformationItemComponent,
    ChartWavePercentComponent,
    DateViewComponent,
    ShapedFooterComponent,
    DataSelectComponent,
    DataTabsSelectComponent,
    ControlsStatusBarComponent,
    MobileComingSoonComponent,
    TimeframeViewComponent,
    MetadataViewComponent,
    CollectionNotificationComponent,
    GlobalLoaderComponent,
    TimeAgoDateViewComponent,
    LogItemComponent,
  ],
  imports: [
    DirectivesModule,
    ModalsModule,
    ComponentSwitcherModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    SvgIconsModule,
    NgbPopoverModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatMenuModule,
    MatButtonModule,
    MatProgressBarModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    TranslateModule.forChild(),
    LottieModule,
    DynamicIoModule,
    DropdownMenuModule,
    VirtualScrollerModule,
    OverlayModule,
    LoadersModule, // For backward compatibility
    UserProfileModule,
    FormControlsModule,
    UtilsModule,
    PipesModule,
    ButtonsModule,
    AvatarModule,
    CarouselModule
  ],
  exports: [
    CommonModule,
    DirectivesModule,
    CollapsableSideBarComponent,
    FrameworksIconComponent,
    ModalWindowOutletComponent,
    NotFoundComponent,
    PagerComponent,
    ButtonComponent,
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    SvgIconsModule,
    ComingSoonComponent,
    NgbTooltipModule,
    NotificationOutletComponent,
    ConnectivityNotificationComponent,
    SpecificInformationItemComponent,
    ChartWavePercentComponent,
    DateViewComponent,
    DataSelectComponent,
    DataTabsSelectComponent,
    ControlsStatusBarComponent,
    MobileComingSoonComponent,
    TimeframeViewComponent,
    MetadataViewComponent,
    ShapedFooterComponent,
    GlobalLoaderComponent,
    LoadersModule, // For backward compatibility
    UserProfileModule,
    ModalsModule,
    FormControlsModule,
    UtilsModule,
    PipesModule,
    ButtonsModule,
    AvatarModule,
    TimeAgoDateViewComponent,
    LogItemComponent,
    CarouselModule
  ]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptorService,
          multi: true,
        },
        InitializerCanActivateService,
        MessageBusService,
        RouterExtensionService,
        AppConfigService,
        LoaderManagerService,
        FileDownloadingHelperService,
        LoggerService,
        UserFlowService,
        UpdatesService,
        IntercomService,
        RedirectGuard,
        AuditorPortalGuard,
        OwnerFilterService,
        RequirementEventService,
        {
          provide: WINDOW,
          useFactory: () => window,
        },
        ...eventHandlers.map((handlerType) => ({ provide: eventHandlerToken, useClass: handlerType, multi: true })),
      ],
    };
  }
}
