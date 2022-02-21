import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonsModule } from 'core/modules/buttons';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { UtilsModule } from 'core/modules/utils';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { RenderingModule } from '../rendering/rendering.module';
import { NotificationItemComponent } from './components';
import { CommentNotificationComponent } from './components/comment-notification/comment-notification.component';
import { NotificationsHeaderComponent } from './components/notifications-header/notifications-header.component';
import { NotificationsListComponent } from './components/notifications-list/notifications-list.component';
import { NotificationsPanelComponent } from './components/notifications-panel/notifications-panel.component';
import { NotificationsFacadeService, NotificationsService } from './services';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import * as effects from './store/effects';
import * as storeFeature from './store';
import { LoadersModule } from 'core/modules/loaders';
import { NotificationsEventsService } from './services';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DirectivesModule } from 'core/modules/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SvgIconsModule,
    ButtonsModule,
    PerfectScrollbarModule,
    RenderingModule,
    UtilsModule,
    EffectsModule.forFeature([effects.NotificationEffects]),
    StoreModule.forFeature(storeFeature.featureKey, storeFeature.reducers),
    LoadersModule,
    NgbTooltipModule,
    DirectivesModule
  ],
  declarations: [
    NotificationsPanelComponent,
    NotificationsListComponent,
    NotificationsHeaderComponent,
    NotificationItemComponent,
    CommentNotificationComponent,
  ],
  providers: [NotificationsService, NotificationsFacadeService, NotificationsEventsService],
  exports: [NotificationsPanelComponent],
})
export class NotificationsModule {}
