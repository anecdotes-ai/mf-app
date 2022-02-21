/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WindowHelperService } from 'core/services/window-helper/window-helper.service';
import { FirebaseWrapperService } from './firebase-wrapper.service';
import { TenantFacadeService } from '../facades';

describe('Service: FirebaseWrapper', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirebaseWrapperService, { provide: WindowHelperService, useValue: {} }, { provide: TenantFacadeService, useValue: {} }],
    });
  });

  it('should ...', inject([FirebaseWrapperService], (service: FirebaseWrapperService) => {
    expect(service).toBeTruthy();
  }));
});
