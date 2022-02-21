import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RiskFacadeService, RiskSourceFacadeService } from 'core/modules/risk/services';
import { RiskSourceLabelComponent } from './risk-source-label.component';
import { Risk, RiskSource } from 'core/modules/risk/models';
import { of } from 'rxjs';

describe('RiskSourceLabelComponent', () => {
  let component: RiskSourceLabelComponent;
  let fixture: ComponentFixture<RiskSourceLabelComponent>;

  let riskFacade: RiskFacadeService;
  let riskSourceFacade: RiskSourceFacadeService;

  const risk: Risk = {
    id: 'id',
  };

  const riskSource: RiskSource = {
    source_name: 'name',
    id: 'id',
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [RiskSourceLabelComponent],
        providers: [
          { provide: RiskSourceFacadeService, useValue: {} },
          { provide: RiskFacadeService, useValue: {} },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskSourceLabelComponent);
    component = fixture.componentInstance;
    component.riskId = risk.id;

    riskFacade = TestBed.inject(RiskFacadeService);
    riskFacade.addOrUpdateSourceForRiskAsync = jasmine.createSpy('addOrUpdateSourceForRiskAsync');

    riskSourceFacade = TestBed.inject(RiskSourceFacadeService);
    riskSourceFacade.getSourceForRisk = jasmine.createSpy('getSourceForRisk').and.returnValue(of(riskSource));
    riskSourceFacade.getAllRiskSources = jasmine.createSpy('getAllRiskSources').and.returnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('buildTranslationKey()', () => {
    it('should return appropriate translation key', () => {
      // Arrange
      const key = 'key';
      const parentKey = 'riskManagement.riskSourceLabel.';

      // Act
      const result = component.buildTranslationKey(key);

      // Assert
      expect(result).toEqual(`${parentKey}${key}`);
    });
  });

  describe('addAndSelectNewSource()', () => {
    it('should call riskFacade.addOrUpdateSourceForRiskAsync with appropriate params', () => {
      // Arrange
      const source = 'source';

      // Act
      component.addAndSelectNewSource(source);

      // Assert
      expect(riskFacade.addOrUpdateSourceForRiskAsync).toHaveBeenCalledWith(component.riskId, { source_name: source });
    });
  });

  describe('sourceDisplayValueSelector()', () => {
    it('should return source name', () => {
      // Arrange
      // Act
      const result = component.sourceDisplayValueSelector(riskSource);

      // Assert
      expect(result).toEqual(riskSource.source_name);
    });
  });

  describe('ngOnInit()', () => {
    it('should set risk source to formControl value', () => {
      // Arrange
      // Act
      fixture.detectChanges();

      // Assert
      expect(component.formControl.value).toEqual(riskSource);
    });

    it('should riskFacade.addOrUpdateSourceForRiskAsync with appropriate params if formControl value was changed', () => {
      // Arrange
      const newSource = { source_name: 'new-value' };
      component.formControl.setValue({ source_name: 'value' });
      fixture.detectChanges();

      // Act
      component.formControl.setValue(newSource);
      fixture.detectChanges();

      // Assert
      expect(riskFacade.addOrUpdateSourceForRiskAsync).toHaveBeenCalledWith(component.riskId, newSource);
    });
  });
});
