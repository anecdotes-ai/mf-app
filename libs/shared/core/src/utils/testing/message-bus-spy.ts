import { MessageBusService } from '../../services';
import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export function spyOnMessageBusMethods(messageBus: MessageBusService): void {
  const eventSubject = new Subject<any>();
  messageBus.getObservable = jasmine.createSpy('getObservable').and.callFake((eventName: string) =>
    eventSubject.pipe(
      filter((val) => val.eventName === eventName),
      map((data) => data.eventBody)
    )
  );
  messageBus.sendMessage = jasmine
    .createSpy('sendMessage')
    .and.callFake((eventName: string, eventBody: any) => eventSubject.next({ eventName, eventBody }));
}
