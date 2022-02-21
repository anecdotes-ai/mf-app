import { TestBed } from '@angular/core/testing';
import { FrameworkService } from 'core/modules/data/services';

import { SpecificSlideContentResolverService } from './specific-slide-content-resolver.service';
import { DashboardCategoriesResolverService } from '../../dashboard/services';
import { HttpClientModule } from '@angular/common/http';

describe('SpecificSlideContentResolverService', () => {
  let service: SpecificSlideContentResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FrameworkService, DashboardCategoriesResolverService],
      imports: [HttpClientModule],
    });
    service = TestBed.inject(SpecificSlideContentResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
