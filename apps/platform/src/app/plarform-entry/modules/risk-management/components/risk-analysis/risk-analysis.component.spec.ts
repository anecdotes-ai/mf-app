import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RiskAnalysisComponent } from './risk-analysis.component';
import { RiskFacadeService } from 'core/modules/risk/services';
import { ModalWindowService } from 'core/modules/modals';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('RiskAnalysisComponent', () => {
  let component: RiskAnalysisComponent;
  let fixture: ComponentFixture<RiskAnalysisComponent>;
  let riskFacade: RiskFacadeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [RiskAnalysisComponent],
      providers: [
        { provide: RiskFacadeService, useValue: {} },
        { provide: ModalWindowService, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskAnalysisComponent);
    component = fixture.componentInstance;

    riskFacade = TestBed.inject(RiskFacadeService);
    riskFacade.getRiskById = jasmine.createSpy('getRiskById').and.returnValue(of({}));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
