import { TestBed } from '@angular/core/testing';

import { EvidenceModalService } from './evidence-modal.service';

describe('EvidenceModalService', () => {
  let service: EvidenceModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvidenceModalService);
  });
});
