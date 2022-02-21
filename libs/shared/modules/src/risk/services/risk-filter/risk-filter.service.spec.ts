import { TestBed } from '@angular/core/testing';
import { RiskFilterService } from './risk-filter.service';
import { RiskCategoryFacadeService, RiskFacadeService } from 'core/modules/risk/services';
import { Risk, RiskCategory, RiskFilterObject } from 'core/modules/risk/models';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';

describe('RiskFilterService', () => {
  let service: RiskFilterService;

  let riskFacade: RiskFacadeService;
  let riskCategoryFacade: RiskCategoryFacadeService;

  const riskFacadeData: Risk[] = [{ id: 'id1' }, { id: 'id2' }];
  const riskCategoryFacadeData: RiskCategory = { category_name: 'name' };

  const resultData: RiskFilterObject[] = [
    { id: 'id1', category_name: 'name' },
    { id: 'id2', category_name: 'name' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RiskFilterService,
        { provide: RiskFacadeService, useValue: {} },
        { provide: RiskCategoryFacadeService, useValue: {} },
      ],
    });
    service = TestBed.inject(RiskFilterService);

    riskFacade = TestBed.inject(RiskFacadeService);
    riskFacade.getAllRisks = jasmine.createSpy('getAllRisks').and.returnValue(of(riskFacadeData));

    riskCategoryFacade = TestBed.inject(RiskCategoryFacadeService);
    riskCategoryFacade.getCategoryForRisk = jasmine
      .createSpy('getAllRisks')
      .and.returnValue(of(riskCategoryFacadeData));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllRiskFilterObjects should return appropriate data', async () => {
    // Arrange
    // Act
    const result = await service.getAllRiskFilterObjects().pipe(take(1)).toPromise();

    // Assert
    expect(result).toEqual(resultData);
  });
});
