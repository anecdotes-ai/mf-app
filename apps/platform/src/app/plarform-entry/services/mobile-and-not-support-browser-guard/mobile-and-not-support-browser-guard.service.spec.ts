/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MobileAndNotSupportBrowserViewGuardService } from './mobile-and-not-support-browser-guard.service';

describe('Service: MobileViewGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [MobileAndNotSupportBrowserViewGuardService],
    });
  });

  it('should ...', inject(
    [MobileAndNotSupportBrowserViewGuardService],
    (service: MobileAndNotSupportBrowserViewGuardService) => {
      expect(service).toBeTruthy();
    }
  ));
});
