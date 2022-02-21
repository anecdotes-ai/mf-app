import { ModalWindowService } from './../../../modals/services/modal-window/modal-window.service';
import { TestBed } from '@angular/core/testing';
import { MitigateControlsModalService } from './mitigate-controls-modal.service';
import { configureTestSuite } from 'ng-bullet';

describe('MitigateControlsModalService', () => {
  configureTestSuite();
  let modalWindowService: ModalWindowService;
  let service: MitigateControlsModalService;

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [MitigateControlsModalService, { provide: ModalWindowService, useValue: {} }],
    });
    service = TestBed.inject(MitigateControlsModalService);

    modalWindowService = TestBed.inject(ModalWindowService);
    modalWindowService.openInSwitcher = jasmine.createSpy('openInSwitcher');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
