import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ControlsFacadeService, FrameworksFacadeService, PluginFacadeService } from 'core/modules/data/services';
import { DashboardFacadeService } from './dashboard-facade.service';

describe('DashboardFacadeService', () => {
  let service: DashboardFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        DashboardFacadeService,
        { provide: ControlsFacadeService, useValue: {} },
        { provide: FrameworksFacadeService, useValue: {} },
        { provide: PluginFacadeService, useValue: {} },
      ],
    });
    service = TestBed.inject(DashboardFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
