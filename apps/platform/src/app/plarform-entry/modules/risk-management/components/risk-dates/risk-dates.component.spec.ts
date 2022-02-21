import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RiskDatesComponent } from './risk-dates.component';
import { TranslateModule } from '@ngx-translate/core';
import { LocalDatePipe } from 'core/modules/pipes';
import { of } from 'rxjs';
import { RiskFacadeService } from 'core/modules/risk/services';

describe('RiskDatesComponent', () => {
  let component: RiskDatesComponent;
  let fixture: ComponentFixture<RiskDatesComponent>;

  let riskFacade: RiskFacadeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RiskDatesComponent, LocalDatePipe],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: RiskFacadeService, useValue: {} }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskDatesComponent);
    component = fixture.componentInstance;

    riskFacade = TestBed.inject(RiskFacadeService);
    riskFacade.getRiskById = jasmine.createSpy('getRiskById').and.returnValue(
      of({
        creator_name: 'name',
        creation_time: new Date().toISOString(),
        last_updated: new Date().toISOString(),
      })
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return appropriate translation key', () => {
    // Arrange
    const key = 'key';
    const parentKey = 'riskManagement.riskDates.';

    // Act
    const result = component.buildTranslationKey(key);

    // Assert
    expect(result).toEqual(`${parentKey}${key}`);
  });
});
