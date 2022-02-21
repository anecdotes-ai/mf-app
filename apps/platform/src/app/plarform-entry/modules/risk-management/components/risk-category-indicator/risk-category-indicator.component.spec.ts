import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { RiskCategoryFacadeService, RiskFacadeService } from 'core/modules/risk/services';
import { TranslateModule } from '@ngx-translate/core';
import { RiskCategoryIndicatorComponent } from './risk-category-indicator.component';
import { Risk, RiskCategory } from 'core/modules/risk/models';
import { of } from 'rxjs';

describe('RiskCategoryIndicatorComponent', () => {
  configureTestSuite();

  let component: RiskCategoryIndicatorComponent;
  let fixture: ComponentFixture<RiskCategoryIndicatorComponent>;

  let riskFacade: RiskFacadeService;
  let riskCategoryFacade: RiskCategoryFacadeService;

  const risk: Risk = {
    id: 'id',
    name: 'Name',
  };

  const riskCategory: RiskCategory = {
    category_name: 'name',
  };

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [RiskCategoryIndicatorComponent],
        providers: [
          { provide: RiskFacadeService, useValue: {} },
          { provide: RiskCategoryFacadeService, useValue: {} },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskCategoryIndicatorComponent);
    component = fixture.componentInstance;
    component.riskId = risk.id;

    riskFacade = TestBed.inject(RiskFacadeService);
    riskFacade.addOrUpdateCategoryForRiskAsync = jasmine.createSpy('addOrUpdateCategoryForRiskAsync');

    riskCategoryFacade = TestBed.inject(RiskCategoryFacadeService);
    riskCategoryFacade.getAllRiskCategories = jasmine.createSpy('getAllRiskCategories').and.returnValue(of([]));
    riskCategoryFacade.getAllRiskCategories = jasmine.createSpy('getAllRiskCategories');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('buildTranslationKey()', () => {
    it('should return appropriate translation key', () => {
      // Arrange
      const key = 'key';
      const parentKey = 'riskManagement.riskCategory.';

      // Act
      const result = component.buildTranslationKey(key);

      // Assert
      expect(result).toEqual(`${parentKey}${key}`);
    });
  });

  describe('selectRiskCategoryDisplayValue()', () => {
    it('should return risk name', () => {
      // Arrange
      // Act
      const result = component.selectRiskCategoryDisplayValue(riskCategory);

      // Assert
      expect(result).toEqual(riskCategory.category_name);
    });
  });

  describe('addAndSelectNewCategory()', () => {
    it('should set new category for risk', () => {
      // Arrange
      const category = 'category';

      // Act
      component.addAndSelectNewCategory(category);

      // Assert
      expect(riskFacade.addOrUpdateCategoryForRiskAsync).toHaveBeenCalledWith(component.riskId, {
        category_name: category,
      });
    });
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      riskCategoryFacade.getAllRiskCategories = jasmine.createSpy('getAllRiskCategories').and.returnValue(of([]));
    });

    it('should set current risk category to control value', () => {
      // Arrange
      riskCategoryFacade.getCategoryForRisk = jasmine.createSpy('getCategoryForRisk').and.returnValue(of(riskCategory));
      
      // Act
      fixture.detectChanges();

      // Assert
      expect(component.control.value).toEqual(riskCategory);
    });

    it('should call addOrUpdateCategoryForRiskAsync if category was changed', () => {
      // Arrange
      const newCategory = { id: 'id1', category_name: 'name1' };
      riskCategoryFacade.getCategoryForRisk = jasmine.createSpy('getCategoryForRisk').and.returnValue(of(riskCategory));

      // Act
      fixture.detectChanges();
      component.control.setValue(newCategory);

      // Assert
      expect(riskFacade.addOrUpdateCategoryForRiskAsync).toHaveBeenCalledWith(component.riskId, newCategory);
    });
  });
});
