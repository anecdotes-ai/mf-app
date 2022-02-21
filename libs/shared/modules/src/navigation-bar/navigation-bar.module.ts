import { NavigationBarEventsTrackingService } from './services/navigation-bar-events-tracking.service';
import { UserProfileModule } from './../user-profile/user-profile.module';
import { DirectivesModule } from './../directives';
import { SvgIconsModule } from 'core/modules/svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationBarComponent } from './components';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigationBarItemComponent } from './components/navigation-bar-item/navigation-bar-item.component';
import { DropdownAtomsModule } from 'core/modules/dropdown-menu';
import { MatMenuModule } from '@angular/material/menu';
import { NotificationsModule } from 'core/modules/notifications';
import { NotificationBadgeComponent } from './components/notification-badge/notification-badge.component';

@NgModule({
  declarations: [NavigationBarComponent, NavigationBarItemComponent, NotificationBadgeComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SvgIconsModule.forRoot(),
    RouterModule,
    UserProfileModule,
    DirectivesModule,
    DropdownAtomsModule,
    MatMenuModule,
    NotificationsModule
  ],
  providers:[
    NavigationBarEventsTrackingService
  ],
  exports: [NavigationBarComponent, NavigationBarItemComponent],
})
export class NavigationBarModule {}
