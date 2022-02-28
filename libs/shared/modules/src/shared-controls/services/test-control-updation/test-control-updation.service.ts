import { Injectable } from '@angular/core';
import { MessageBusService } from 'core/services/message-bus/message-bus.service';
import { PusherMessage, PusherMessageType } from 'core/models';
import { Observable } from 'rxjs';
import { filter, map, take} from 'rxjs/operators';

@Injectable()
export class TestControlUpdationService {
  constructor(private messageBus: MessageBusService) {}

  testControlUpdation(control_id: string): Observable<boolean> {
    return this.messageBus.getObservable<PusherMessage>(PusherMessageType.Control).pipe(
      // tslint:disable-next-line: triple-equals
      filter((x) => x.message_object.control_id == control_id),
      map((x) => true),
      take(1)
    );
  }
}
