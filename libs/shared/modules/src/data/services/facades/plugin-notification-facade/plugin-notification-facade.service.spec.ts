/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { PluginNotificationFacadeService } from './plugin-notification-facade.service';

describe('Service: PluginNotificationFacadeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore(), PluginNotificationFacadeService],
    });
  });

  it('should ...', inject([PluginNotificationFacadeService], (service: PluginNotificationFacadeService) => {
    expect(service).toBeTruthy();
  }));
});
