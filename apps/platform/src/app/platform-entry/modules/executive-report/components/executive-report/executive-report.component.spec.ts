import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveReportComponent } from './executive-report.component';
import { DashboardHeaderContentResolverService } from '../../../dashboard/services';
import { LoaderManagerService, MessageBusService } from 'core';
import { SpecificSlideContentResolverService } from '../../services/specific-slide-content-resolver.service';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { reducers } from 'core/modules/data/store';
import { DashboardFacadeService, FrameworkService } from 'core/modules/data/services';

describe('ExecutiveReportLayoutComponent', () => {
  let component: ExecutiveReportComponent;
  let fixture: ComponentFixture<ExecutiveReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [HttpClientModule, StoreModule.forRoot(reducers)],
      declarations: [ExecutiveReportComponent],
      providers: [
        provideMockStore(),
        DashboardHeaderContentResolverService,
        LoaderManagerService,
        SpecificSlideContentResolverService,
        MessageBusService,
        FrameworkService,
        { provide: DashboardFacadeService, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutiveReportComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
