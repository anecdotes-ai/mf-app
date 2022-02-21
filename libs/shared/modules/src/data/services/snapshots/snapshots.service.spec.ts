import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { SnapshotsService } from './snapshots.service';

describe('SnapshotsService', () => {
  let service: SnapshotsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [SnapshotsService],
    });
    service = TestBed.inject(SnapshotsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
