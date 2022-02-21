import { ModalWindowService } from './../../../modals/services/modal-window/modal-window.service';
import { TestBed } from '@angular/core/testing';
import { ConfigureAuditModalService } from './configure-audit-modal.service';
import { configureTestSuite } from 'ng-bullet';

describe('ConfigureAuditModalService', () => {
  configureTestSuite();
  let modalWindowService: ModalWindowService;
  let service: ConfigureAuditModalService;

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [ConfigureAuditModalService, { provide: ModalWindowService, useValue: {} }],
    });
    service = TestBed.inject(ConfigureAuditModalService);

    modalWindowService = TestBed.inject(ModalWindowService);
    modalWindowService.openInSwitcher = jasmine.createSpy('openInSwitcher');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
