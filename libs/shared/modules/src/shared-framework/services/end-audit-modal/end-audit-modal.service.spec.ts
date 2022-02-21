import { ModalWindowService } from './../../../modals/services/modal-window/modal-window.service';
import { TestBed } from '@angular/core/testing';
import { EndAuditModalService } from './end-audit-modal.service';
import { configureTestSuite } from 'ng-bullet';

describe('EndAuditModalService', () => {
  configureTestSuite();
  let modalWindowService: ModalWindowService;
  let service: EndAuditModalService;

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [EndAuditModalService, { provide: ModalWindowService, useValue: {} }],
    });
    service = TestBed.inject(EndAuditModalService);

    modalWindowService = TestBed.inject(ModalWindowService);
    modalWindowService.openInSwitcher = jasmine.createSpy('openInSwitcher');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
