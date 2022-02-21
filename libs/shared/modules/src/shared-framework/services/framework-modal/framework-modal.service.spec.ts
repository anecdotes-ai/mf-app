import { TestBed } from '@angular/core/testing';
import { ModalWindowService } from 'core/modules/modals';
import { FrameworkModalService } from './framework-modal.service';

describe('FrameworkModalService', () => {
  let service: FrameworkModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FrameworkModalService,
        { provide: ModalWindowService, useValue: {} }],
    });
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrameworkModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
