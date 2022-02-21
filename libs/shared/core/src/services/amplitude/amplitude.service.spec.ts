import { HttpBackend } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppConfigService, MessageBusService, RouterExtensionService } from 'core/services';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { of } from 'rxjs';

import { AmplitudeService } from './amplitude.service';

describe('AmplitudeService', () => {
  let service: AmplitudeService;
  let userService: UserEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppConfigService,
        HttpBackend,
        UserEventService,
        MessageBusService,
        { provide: RouterExtensionService, useValue: {} },
      ],
      imports: [RouterTestingModule],
    });
    service = TestBed.inject(AmplitudeService);
    userService = TestBed.inject(UserEventService);
    spyOn(userService, 'subscribeForAllEvents').and.returnValue(of({} as any));
  });

  // it('should be created', () => {
  //   expect(service).toBeTruthy();
  // });
});
