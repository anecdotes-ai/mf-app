import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, filter, map, pairwise } from 'rxjs/operators';

/** A router wrapper, adding extra functions. */
@Injectable()
export class RouterExtensionService {
  constructor(private router: Router) {}

  routerNavigationEndEvent$: Observable<{
    currentEvent: NavigationEnd;
    currentUrl: string;
    previousUrl: string;
  }> = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map((event) => event as NavigationEnd),
    debounceTime(1000), // prevents frequent emmisions that usually happen during redirections
    pairwise(),
    map(([prevNavigationEnd, currentNavigationEnd]) => {
      return {
        currentEvent: currentNavigationEnd,
        currentUrl: currentNavigationEnd.url,
        previousUrl: prevNavigationEnd.url,
      };
    })
  );
}
