import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginLogsTabComponent } from './plugin-logs-tab.component';
import { TranslateModule } from '@ngx-translate/core';
import { PluginFacadeService } from 'core/modules/data/services';
import { configureTestSuite } from 'ng-bullet';
import { Observable, of } from 'rxjs';
import { Service, ServiceLog } from 'core/modules/data/models/domain';
import { PluginsDataService } from 'core/modules/plugins-connection/services/plugins-data-service/plugins.data.service';
import { ActivatedRoute } from '@angular/router';

class MockPluginFacadeService {
  getLogsForParticularPeriod(
    service_id: string,
    service_instance_id: string,
    logPeriodInDays: number,
    sortOrder: 'asc' | 'dsc' = 'asc'
  ): Observable<ServiceLog[]> {
    return of([]);
  }
}

describe('PluginLogsTabComponent', () => {
  configureTestSuite();

  let component: PluginLogsTabComponent;
  let fixture: ComponentFixture<PluginLogsTabComponent>;

  let pluginFacade: MockPluginFacadeService;
  const mockService: Service = {
    service_id: 'testId',
  };

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [PluginLogsTabComponent],
      providers: [{ provide: PluginFacadeService, useValue: MockPluginFacadeService }, { provide: PluginsDataService, useValue: {} }, { provide: ActivatedRoute, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    pluginFacade = TestBed.inject(PluginFacadeService);
    fixture = TestBed.createComponent(PluginLogsTabComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#OnInit', () => {
    beforeEach(() => {
      component.service = mockService;
    });

    // it('should call for getLogsForParticularPeriod and set to displayedServiceLogs$', async () => {
    //   // Arrange
    //   const mockedServiceLogs$: Observable<ServiceLog[]> = of([
    //     { run_id: '123', timestamp: 123 },
    //     { run_id: '1234', timestamp: 1234 },
    //   ]);
    //   pluginFacade.getLogsForParticularPeriod = jasmine
    //     .createSpy('getLogsForParticularPeriod')
    //     .and.returnValue(mockedServiceLogs$);

    //   // Act
    //   fixture.detectChanges();
    //   await fixture.whenStable();

    //   // Assert
    //   expect(component.displayedServiceLogs$).toBe(mockedServiceLogs$);
    // });
  });

  // describe('#convertTimestampToDate', () => {
  //   beforeEach(() => {
  //     component.service = mockService;
  //   });
  //   it('shoud invert visibility of Extended service log', async () => {
  //     // Arrange
  //     const timestamp = 1234;

  //     // Act
  //     fixture.detectChanges();
  //     await fixture.whenStable();

  //     const res = component.convertTimestampToDate(timestamp);

  //     // Assert
  //     expect(res).toEqual(new Date(timestamp * 1000));
  //   });
  // });
});
