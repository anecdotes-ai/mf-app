/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'core/modules/auth-core/services';
import { IntercomService } from './intercom.service';

describe('Service: Intercom', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [IntercomService, { provide: AuthService, useValue: {} }],
    });
  });

  it('should ...', inject([IntercomService], (service: IntercomService) => {
    expect(service).toBeTruthy();
  }));
});
