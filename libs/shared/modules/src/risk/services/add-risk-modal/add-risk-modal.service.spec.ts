import { ModalWindowService } from './../../../modals/services/modal-window/modal-window.service';
import { TestBed } from '@angular/core/testing';
import { AddRiskModalService } from './add-risk-modal.service';
import { configureTestSuite } from 'ng-bullet';

describe('AddRiskModalService', () => {
  configureTestSuite();
  let modalWindowService: ModalWindowService;
  let service: AddRiskModalService;

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [AddRiskModalService, { provide: ModalWindowService, useValue: {} }],
    });
    service = TestBed.inject(AddRiskModalService);

    modalWindowService = TestBed.inject(ModalWindowService);
    modalWindowService.openInSwitcher = jasmine.createSpy('openInSwitcher');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
