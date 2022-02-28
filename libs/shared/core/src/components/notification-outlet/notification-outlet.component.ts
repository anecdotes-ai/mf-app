import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Dictionary } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { NotificationDefinition } from 'core/modules/data/models';
import { RemoveNotificationAction, PluginNotificationSelectors } from 'core/modules/data/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-notification-outlet',
  templateUrl: './notification-outlet.component.html',
  styleUrls: ['./notification-outlet.component.scss'],
})
export class NotificationOutletComponent implements OnInit {
  // if you want to access 'this' context, pass this value to args array
  outputs = {
    closing: { handler: this.closing.bind(this), args: ['$event'] },
  };

  notifications: NotificationDefinition[] = [];

  $enititesObs: Observable<Dictionary<NotificationDefinition>>;

  constructor(private store: Store, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.$enititesObs = this.store.select(PluginNotificationSelectors.SelectPluginNotificationState).pipe(map((state) => state.entities));
  }

  comparisonFn(): number {
    // Comparison function provide us with displaying notifications in their received order.
    return 1;
  }

  trackByFn(index: number, obj: any): any {
    if (obj) {
      return obj.key;
    }

    return index;
  }

  closing(notificationId): void {
    this.store.dispatch(new RemoveNotificationAction(notificationId));
  }
}
