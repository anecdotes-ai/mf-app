/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TranslateResolverService } from './translate-resolver.service';

describe('Service: TranslateResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TranslateResolverService],
    });
  });

  it('should ...', inject([TranslateResolverService], (service: TranslateResolverService) => {
    expect(service).toBeTruthy();
  }));
});
