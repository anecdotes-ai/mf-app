import { TestBed } from '@angular/core/testing';
import { ModalWindowService } from 'core/modules/modals';
import { ControlsCustomizationModalService } from './controls-customization-modal.service';
import { ControlsFacadeService } from 'core/modules/data/services';

describe('ControlsCustomizationModalService', () => {
  let service: ControlsCustomizationModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ModalWindowService, useValue: {} },
        { provide: ControlsFacadeService, useValue: {} }
      ],
    });
    service = TestBed.inject(ControlsCustomizationModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
