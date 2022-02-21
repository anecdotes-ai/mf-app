import { Service } from './../../../data/models/domain';
import { InviteUserDataProperty, InviteUserEventData, InviteUserSource, UserEvents } from 'core/models/user-events/user-event-data.model';
import { RoleEnum } from './../../../auth-core/models/domain';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InviteUserEventsService {
  constructor(private userEventService: UserEventService) {}

  trackUserInvitation(
    selectedUserType: RoleEnum,
    source: InviteUserSource,
    plugin?: Service,
    frameworkNames?: string[]
  ): void {
    const eventData: InviteUserEventData = {
      [InviteUserDataProperty.SelectedUserType]: selectedUserType,
      [InviteUserDataProperty.Source]: source,
    };

    if (plugin) {
      eventData[InviteUserDataProperty.PluginName] = plugin.service_display_name;
    }
    if (frameworkNames?.length) {
      eventData[InviteUserDataProperty.SelectedFrameworks] = frameworkNames;
    }

    this.userEventService.sendEvent(UserEvents.INVITE_USER, eventData);
  }
}
