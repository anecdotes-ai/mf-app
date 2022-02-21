import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { RiskManagementPageComponent } from './risk-management-page.component';
import {
  RiskFacadeService,
  AddRiskModalService,
  RiskCategoryFacadeService,
  RiskSourceFacadeService,
  RiskFilterService
} from 'core/modules/risk/services';
import { of } from 'rxjs';

describe('RiskManagementPageComponent', () => {
  configureTestSuite();

  let component: RiskManagementPageComponent;
  let fixture: ComponentFixture<RiskManagementPageComponent>;
  let riskFacadeService: RiskFacadeService;

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [RiskManagementPageComponent],
        providers: [
          { provide: RiskFacadeService, useValue: {} },
          { provide: AddRiskModalService, useValue: {} },
          { provide: RiskCategoryFacadeService, useValue: {} },
          { provide: RiskSourceFacadeService, useValue: {} },
          { provide: RiskFilterService, useValue: {} },

        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskManagementPageComponent);
    component = fixture.componentInstance;

    riskFacadeService = TestBed.inject(RiskFacadeService);
    riskFacadeService.getAllRisks = jasmine.createSpy('getAllRisks').and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
