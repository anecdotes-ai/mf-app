import { UserEventService } from 'core/services/user-event/user-event.service';
import { Injectable } from '@angular/core';
import { UserEvents } from 'core/models/user-events/user-event-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthEventService {

  constructor(
    private userEventHub: UserEventService
  ) { }

  trackLogin():void{
    this.userEventHub.sendEvent(UserEvents.LOGIN);
    
  }

  trackLogout():void{
    this.userEventHub.sendEvent(UserEvents.LOGOUT);    
  }
}
