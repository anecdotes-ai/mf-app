import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { ControlsReportService } from './controls-report.service';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { ControlsFacadeService, FrameworksFacadeService } from 'core/modules/data/services';

describe('ControlsReportService', () => {
  let service: ControlsReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: {} },
        { provide: UserEventService, useValue: {} },
        { provide: FrameworksFacadeService, useValue: {} },
        { provide: ControlsFacadeService, useValue: {} },
        ControlsReportService
      ]
    });
    service = TestBed.inject(ControlsReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
