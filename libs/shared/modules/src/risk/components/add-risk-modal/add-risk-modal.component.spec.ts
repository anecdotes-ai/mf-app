import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { WindowHelperService } from 'core/services';
import { has } from 'lodash';
import { configureTestSuite } from 'ng-bullet';
import { Subject } from 'rxjs';
import { RiskCategory, RiskSource } from '../../models';
import { RiskCategoryFacadeService, RiskFacadeService, RiskSourceFacadeService } from '../../services';
import { AddRiskModalComponent, AddRiskModalEnum, FormControlKeys } from './add-risk-modal.component';
class MockSwitcherDir {
  public sharedContext$ = new Subject<{ riskCategories: RiskCategory[]; riskSources: RiskSource[] }>();

  goById = jasmine.createSpy('goById');
}

describe('AddRiskModalComponent', () => {
  configureTestSuite();
  let fixture: ComponentFixture<AddRiskModalComponent>;
  let component: AddRiskModalComponent;

  let riskCategoryFacadeService: RiskCategoryFacadeService;
  let riskFacadeService: RiskFacadeService;
  let riskSourceFacadeService: RiskSourceFacadeService;
  let translateService: TranslateService;
  let switcher: MockSwitcherDir;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: RiskCategoryFacadeService, useValue: {} },
        { provide: RiskFacadeService, useValue: {} },
        { provide: RiskSourceFacadeService, useValue: {} },
        { provide: TranslateService, useValue: {} },
        { provide: ComponentSwitcherDirective, useClass: MockSwitcherDir },
        { provide: WindowHelperService, useValue: {} },
      ],
      declarations: [AddRiskModalComponent],
    });

    switcher = TestBed.inject(ComponentSwitcherDirective) as any;

    translateService = TestBed.inject(TranslateService);
    translateService.instant = jasmine.createSpy('instant');

    riskCategoryFacadeService = TestBed.inject(RiskCategoryFacadeService);
    riskCategoryFacadeService.addRiskCategory = jasmine.createSpy('addRiskCategory');

    riskFacadeService = TestBed.inject(RiskFacadeService);
    riskFacadeService.addRisk = jasmine.createSpy('addRisk');

    riskSourceFacadeService = TestBed.inject(RiskSourceFacadeService);
    riskSourceFacadeService.addRiskSource = jasmine.createSpy('addRiskSource');

    fixture = TestBed.createComponent(AddRiskModalComponent);
    component = fixture.componentInstance;
  });

  it('should be able to create component instance', () => {
    expect(component).toBeDefined();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(AddRiskModalComponent);
      component = fixture.componentInstance;
    });

    it('should set correct values in form', () => {
      // Act
      fixture.detectChanges();

      // Assert
      expect(has(component.form.items, FormControlKeys.risk_category)).toBeTruthy();
      expect(has(component.form.items, FormControlKeys.risk_strategy)).toBeTruthy();
      expect(has(component.form.items, FormControlKeys.risk_effect)).toBeTruthy();
      expect(has(component.form.items, FormControlKeys.risk_name)).toBeTruthy();
      expect(has(component.form.items, FormControlKeys.risk_source)).toBeTruthy();
    });
  });

  describe('addRisk', () => {
    it('should call addRisk', async () => {
      // Act
      fixture.detectChanges();
      await component.addRisk();

      // // Assert
      expect(riskFacadeService.addRisk).toHaveBeenCalled();
    });

    it('should call goById with success value', async () => {
      // Act
      fixture.detectChanges();
      await component.addRisk();

      // // Assert
      expect(switcher.goById).toHaveBeenCalledWith(AddRiskModalEnum.Success);
    });

    it('should call goById with error value when addRisk throw error', async () => {
      // Arrange
      riskFacadeService.addRisk = jasmine.createSpy('addRisk').and.throwError(new Error());

      // Act
      fixture.detectChanges();
      await component.addRisk();

      // // Assert
      expect(switcher.goById).toHaveBeenCalledWith(AddRiskModalEnum.Error);
    });
  });
});
