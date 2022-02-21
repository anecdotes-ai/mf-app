import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { LoggerService } from '../logger/logger.service';

const CHECK_UPDATE_INTERVAL = 1000 * 60 * 5; // 5 min

@Injectable({
  providedIn: 'root',
})
export class UpdatesService {
  constructor(updates: SwUpdate, logger: LoggerService) {
    /**
     * Force the page to be reloaded if the service worker has an update available.
     * https://angular.io/guide/service-worker-communications
     * If the current tab needs to be updated to the latest app version immediately, it can ask to do so with the activateUpdate():
     */
    if (updates.isEnabled) {
      setInterval(function(){ updates.checkForUpdate(); }, CHECK_UPDATE_INTERVAL);
      updates.available.subscribe((event) => {
        logger.log(event);
        updates.activateUpdate().then(() => document.location.reload());
      });
    }
  }
}
