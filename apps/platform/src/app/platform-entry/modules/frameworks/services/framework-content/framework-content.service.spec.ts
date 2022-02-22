import { TestBed } from '@angular/core/testing';
import { FrameworksFacadeService } from 'core/modules/data/services';

import { FrameworkContentService } from './framework-content.service';

describe('FrameworkContentService', () => {
  let service: FrameworkContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ FrameworkContentService, { provide: FrameworksFacadeService, useValue: {} } ]
    });
    service = TestBed.inject(FrameworkContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
