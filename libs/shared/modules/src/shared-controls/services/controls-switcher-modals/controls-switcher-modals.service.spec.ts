import { ModalWindowService } from './../../../modals/services/modal-window/modal-window.service';
import { TestBed } from '@angular/core/testing';
import { ControlsSwitcherModalsService } from './controls-switcher-modals.service';

describe('ControlsSwitcherModalsService', () => {
  let modalWindowService: ModalWindowService;
  let service: ControlsSwitcherModalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    TestBed.configureTestingModule({
      providers: [ControlsSwitcherModalsService, { provide: ModalWindowService, useValue: {} }],
    });
    service = TestBed.inject(ControlsSwitcherModalsService);

    modalWindowService = TestBed.inject(ModalWindowService);
    modalWindowService.openInSwitcher = jasmine.createSpy('openInSwitcher');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
