import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges, OnInit } from '@angular/core';
import { UserEvents } from 'core/models/user-events/user-event-data.model';
import { UserEventService } from 'core/services/user-event/user-event.service';

@Directive({
  selector: '[userEvent]',
  exportAs: 'userEventDir',
})
export class UserEventDirective implements OnChanges, OnInit {
  private _typeErrorOccured: boolean;
  private listener: () => void;

  userEventsEnum = UserEvents;

  @Input()
  userEvent: UserEvents;

  @Input()
  userEventData: any;

  @Input()
  eventTypeBinding: 'click' | 'mousedown' = 'click';

  constructor(private amplitudeHub: UserEventService, private renderer: Renderer2, private host: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('userEvent' in changes && this.userEvent) {
      if (!Object.values(UserEvents).includes(this.userEvent)) {
        this._typeErrorOccured = true;
        throw new Error(`Wrong amplitude event type passed. Passed event type is - ${this.userEvent}`);
      }
    }
  }

  ngOnInit(): void {
    this.listener = this.renderer.listen(this.host.nativeElement, this.eventTypeBinding, (e: Event) =>
      this.sendEvent()
    );
  }

  private sendEvent(): void {
    if (!this._typeErrorOccured) {
      this.amplitudeHub.sendEvent(this.userEvent, this.userEventData);
    }
  }
}
