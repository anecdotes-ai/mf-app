/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SearchInstancesManagerService } from './search-instances-manager.service';

describe('Service: SearchInstancesManager', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchInstancesManagerService]
    });
  });

  it('should ...', inject([SearchInstancesManagerService], (service: SearchInstancesManagerService) => {
    expect(service).toBeTruthy();
  }));
});
