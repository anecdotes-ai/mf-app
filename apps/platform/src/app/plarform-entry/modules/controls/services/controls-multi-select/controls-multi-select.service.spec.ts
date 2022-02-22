import { ModalWindowService } from 'core/modules/modals';
import { ControlsFacadeService } from 'core/modules/data/services';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { ControlsMultiSelectService } from './controls-multi-select.service';
import { ControlsReportService } from 'core/modules/shared-controls';

describe('ControlsMultiSelectService', () => {
  let service: ControlsMultiSelectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ControlsMultiSelectService,
        { provide: Router, useValue: {} },
        { provide: ControlsFacadeService, useValue: {} },
        { provide: ModalWindowService, useValue: {} },
        { provide: ControlsReportService, useValue: {} }
      ]
    });
    service = TestBed.inject(ControlsMultiSelectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
