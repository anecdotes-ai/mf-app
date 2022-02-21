import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ControlsFacadeService } from 'core/modules/data/services';
import { Risk } from 'core/modules/risk/models';
import { MitigateControlsModalService, RiskFacadeService } from 'core/modules/risk/services';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { MitigationControlsSection } from './mitigation-controls-section.component';

describe('MitigationControlsSection', () => {
  configureTestSuite();

  let riskFacadeServiceMock: RiskFacadeService;
  let mitigateControlsModalService: MitigateControlsModalService;
  let component: MitigationControlsSection;
  let fixture: ComponentFixture<MitigationControlsSection>;

  const mockRisk: Risk = { id: 'risk-id' };

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [MitigationControlsSection],
        providers: [
          { provide: RiskFacadeService, useValue: {} },
          { provide: ControlsFacadeService, useValue: {} },
          { provide: MitigateControlsModalService, useValue: {} },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    mitigateControlsModalService = TestBed.inject(MitigateControlsModalService);
    mitigateControlsModalService.openMitigateControlskModal = jasmine.createSpy('openMitigateControlskModal');
    riskFacadeServiceMock = TestBed.inject(RiskFacadeService);
    riskFacadeServiceMock.getRiskById = jasmine.createSpy('getRiskById').and.callFake(() => of(mockRisk));

    fixture = TestBed.createComponent(MitigationControlsSection);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set risk with correct value', () => {
      // Act
      fixture.detectChanges();

      // Assert
      expect(component.risk).toEqual(mockRisk);
    });
  });

  describe('linkControlClicked', () => {
    it('should call openMitigateControlskModal', () => {
      // Arrange
      component.risk = mockRisk;

      // Act
      component.linkControlClicked();

      // Assert
      expect(mitigateControlsModalService.openMitigateControlskModal).toHaveBeenCalledWith(mockRisk);
    });
  });
});
