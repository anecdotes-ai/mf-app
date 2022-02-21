import { AppRoutes } from './../../constants/routes';
import { NavigationEnd } from '@angular/router';
import { Injectable } from '@angular/core';
import { RouterExtensionService } from 'core/services/router-extension/router-extension.service';
import { UserEvents, UserEventDataTypeMapping } from 'core/models/user-events/user-event-data.model';
import { MessageBusService } from 'core/services/message-bus/message-bus.service';
import { merge, Observable } from 'rxjs';
import { debounceTime, filter, map, shareReplay, take } from 'rxjs/operators';
import { capitalizeFirstLetter } from 'core/utils';

@Injectable({
  providedIn: 'root',
})
export class UserEventService {
  private readonly eventSecretkey = 'user-event-key:';

  private readonly routerEventPathes = [AppRoutes.Plugins, AppRoutes.Dashboard, AppRoutes.Controls];

  constructor(private messageHub: MessageBusService, private routerExtensionService: RouterExtensionService) {}

  sendEvent<T extends UserEvents>(eventType: T, eventData?: UserEventDataTypeMapping[T]): void {
    this.messageHub.sendMessage(this.secretKey(eventType), eventData);
  }

  subscribeForEvent<T extends UserEvents>(eventType: T): Observable<UserEventDataTypeMapping[T]> {
    return this.messageHub.getObservable(this.secretKey(eventType)).pipe(shareReplay(), take(1)) as Observable<
      UserEventDataTypeMapping[T]
    >;
  }

  subscribeForAllEvents(): Observable<{
    eventType: UserEvents;
    eventData: UserEventDataTypeMapping[UserEvents];
  }> {
    return merge(this.getMessageBusUserEvents(), this.getUserRouterNavigationEvents());
  }

  private secretKey(eventType: UserEvents): string {
    return `${this.eventSecretkey}${eventType}`;
  }

  private getMessageBusUserEvents(): Observable<{
    eventType: UserEvents;
    eventData: UserEventDataTypeMapping[UserEvents];
  }> {
    return this.messageHub.getFeedByKeyPrefix(this.eventSecretkey).pipe(
      map((feed) => {
        return {
          eventType: feed.key.toString().replace(this.eventSecretkey, '') as UserEvents,
          eventData: feed.payload,
        };
      }),
      shareReplay()
    ) as Observable<{ eventType: UserEvents; eventData: UserEventDataTypeMapping[UserEvents] }>;
  }

  private getUserRouterNavigationEvents(): Observable<{
    eventType: UserEvents;
    eventData: UserEventDataTypeMapping[UserEvents];
  }> {
    return this.routerExtensionService.routerNavigationEndEvent$.pipe(
      filter((accumulatedResult) => this.preventRepeatedEvents(accumulatedResult.currentUrl, accumulatedResult.previousUrl)),
      filter((accumulatedResult) => !!accumulatedResult.currentUrl),
      map((accumulatedResult) => {
        return {
          eventType: UserEvents.PAGEVIEW,
          eventData: {
            'page name': this.resolvePageNameValue(accumulatedResult.currentUrl, accumulatedResult.currentEvent),
            'pervious page url': accumulatedResult.previousUrl,
          } as UserEventDataTypeMapping[UserEvents.PAGEVIEW],
        };
      })
    );
  }

  private filterUserNavigationEvents(event: NavigationEnd): string {
    return this.routerEventPathes.find((path) => this.checkPathStartWith(event, path));
  }

  private preventRepeatedEvents(currentPath: string, previousPath: string): boolean {
    // We need to cover Controls redirection as there is bunch of route changes
    switch (currentPath) {
      case AppRoutes.Controls: {
        return !previousPath.startsWith(`/${currentPath}`);
      }
      default:
        return true;
    }
  }

  private resolvePageNameValue(path: string, event: NavigationEnd): string {
    switch (path) {
      case AppRoutes.Plugins: {
        /* Here url.split('?')[0] returns the URL part without query parameters in case they exist, then split('/').pop() returns the last URL segment without the / character. */
        const pluginName = event.urlAfterRedirects.split('?')[0].split('/').pop();
        return pluginName === path ? 'Plugins - Marketplace' : `Plugins - ${pluginName}`;
      }
      default:
        return capitalizeFirstLetter(path);
    }
  }

  private checkPathStartWith(event: NavigationEnd, pathToCheck: string): boolean {
    return event.urlAfterRedirects.startsWith(`/${pathToCheck}`);
  }
}
