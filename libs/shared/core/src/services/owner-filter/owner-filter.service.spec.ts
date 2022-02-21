import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OwnerFilterService } from './owner-filter.service';

describe('OwnerFilterService', () => {
  let service: OwnerFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [TranslateService],
    });
    service = TestBed.inject(OwnerFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
