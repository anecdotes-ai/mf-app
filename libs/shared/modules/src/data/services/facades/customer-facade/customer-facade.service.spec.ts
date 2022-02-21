/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ActionDispatcherService } from 'core/modules/data/services';
import { CustomerFacadeService } from './customer-facade.service';

describe('Service: CustomerFacade', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerFacadeService, provideMockStore(), { provide: ActionDispatcherService, useValue: {}}]
    });
  });

  it('should ...', inject([CustomerFacadeService], (service: CustomerFacadeService) => {
    expect(service).toBeTruthy();
  }));
});
