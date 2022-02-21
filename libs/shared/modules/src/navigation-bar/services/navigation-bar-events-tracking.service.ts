import {
  MenuEventDataProperty,
  UserEvents,
} from 'core/models/user-events/user-event-data.model';
import { NavigationModel } from './../models/navigation.model';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavigationBarEventsTrackingService {
  constructor(private userEventService: UserEventService) {}

  trackNavigationElementClick(item: NavigationModel): void {
    this.userEventService.sendEvent(UserEvents.MENU, {
      [MenuEventDataProperty.Source]: item.route,
    });
  }
}
