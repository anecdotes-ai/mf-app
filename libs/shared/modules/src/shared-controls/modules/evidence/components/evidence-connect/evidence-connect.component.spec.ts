import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatedControl, CalculatedRequirement, EvidenceLike } from 'core/modules/data/models';
import { ControlsFacadeService, DataAggregationFacadeService, FrameworksFacadeService, RequirementsFacadeService } from 'core/modules/data/services';
import { BaseModalComponent, ModalWindowService } from 'core/modules/modals';
import { TranslateModule } from '@ngx-translate/core';
import { EvidenceConnectComponent } from './evidence-connect.component';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ControlsNavigator } from '../../../../services';
import { Framework } from 'core/modules/data/models/domain';

const mockFrameworks: Framework[] = [
  {
    framework_name: 'fakeFrameWorkName',
    framework_id: 'fakeFrameWorkId',
  },
];

const mockControls: CalculatedControl[] = [
  {
    control_name: 'fakeControlName',
    control_id: 'fakeControlName',
  },
];

const mockEvidenceLike: EvidenceLike[] = [
  {
    id: 'fakeEvidenceId1',
    name: 'fakeEvidenceName1',
  },
  {
    id: 'fakeEvidenceId2',
    name: 'fakeEvidenceName2',
  },
  {
    id: 'fakeEvidenceId3',
    name: 'fakeEvidenceName3',
  },
];

const mockRequirements: CalculatedRequirement[] = [
  {
    requirement_id: 'fakeRequirementId',
    requirement_name: 'fakeRequirementName',
    requirement_related_evidences: mockEvidenceLike,
  },
];

const mockEvidenceToUpdate: EvidenceLike = {
  id: 'fakeEvidenceId4',
  name: 'fakeEvidenceName4',
};

describe('EvidenceConnectComponent', () => {
  configureTestSuite();
  let component: EvidenceConnectComponent;
  let fixture: ComponentFixture<EvidenceConnectComponent>;
  let controlsFacade: ControlsFacadeService;
  let requirementsFacade: RequirementsFacadeService;
  let modalWindowService: ModalWindowService;
  let dataAggregationFacadeService: DataAggregationFacadeService;

  beforeAll(() => {
    TestBed.configureTestingModule({
      declarations: [EvidenceConnectComponent, BaseModalComponent],
      providers: [
        {
          provide: ControlsFacadeService,
          useValue: {},
        },
        {
          provide: DataAggregationFacadeService,
          useValue: {},
        },
        {
          provide: RequirementsFacadeService,
          useValue: {},
        },
        {
          provide: ModalWindowService,
          useValue: {},
        },
        {
          provide: ControlsNavigator,
          useValue: {}
        }
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidenceConnectComponent);
    component = fixture.componentInstance;
    component.evidenceLike = mockEvidenceToUpdate;
    controlsFacade = TestBed.inject(ControlsFacadeService);
    requirementsFacade = TestBed.inject(RequirementsFacadeService);
    modalWindowService = TestBed.inject(ModalWindowService);
    dataAggregationFacadeService = TestBed.inject(DataAggregationFacadeService);
    dataAggregationFacadeService.getPluginRelatedFrameworks = jasmine.createSpy('getPluginRelatedFrameworks').and.callFake(() => of(mockFrameworks));
    controlsFacade.getControlsByFrameworkId = jasmine
      .createSpy('getControlsByFramework')
      .and.callFake(() => of(mockControls));
    requirementsFacade.updateRequirement = jasmine
      .createSpy('updateRequirement')
      .and.callFake(() => of(mockRequirements).toPromise());
    modalWindowService.close = jasmine.createSpy('close').and.callThrough();
    component.updateRequirement = jasmine.createSpy('updateRequirementMethod').and.callThrough();
    component.gotIt = jasmine.createSpy('gotIt').and.callThrough();
    component.viewRequirement = jasmine.createSpy('viewRequirement').and.callThrough();
    modalWindowService.close = jasmine.createSpy('close');
  });

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    it('should initialize component in right way', () => {
      // Arrange

      // Act
      detectChanges();

      // Assert
      expect(component.form).toBeTruthy();
    });
  });

  describe('#updateRequirement', () => {
    it('should call updateRequirement method', () => {
      // Arrange
      component.isFormInvalid = false;
      detectChanges();

      // Act
      fixture.debugElement.query(By.css('.update-requirement')).triggerEventHandler('click', {});

      // Assert
      expect(component.updateRequirement).toHaveBeenCalled();
    });

    it('should set flag is updating to false after updateRequirement method was finished', () => {
      // Arrange
      component.isFormInvalid = false;
      detectChanges();

      // Act
      fixture.debugElement.query(By.css('.update-requirement')).triggerEventHandler('click', {});

      // Assert
      expect(component.isRequirementUpdating).toBeFalse();
    });
  });

  describe('#updatedRequirement', () => {
    it('should be able to call gotIt() method if flag isRequirementUpdated is true', () => {
      // Arrange
      component.isRequirementUpdated = true;
      detectChanges();

      // Act
      fixture.debugElement.query(By.css('.got-it')).triggerEventHandler('click', {});

      // Assert
      expect(component.gotIt).toHaveBeenCalled();
    });

    it('should be able to call viewRequirement() method if flag isRequirementUpdated is true', () => {
      // Arrange
      component.isRequirementUpdated = true;
      detectChanges();

      // Act
      fixture.debugElement.query(By.css('.view-requirement')).triggerEventHandler('click', {});

      // Assert
      expect(component.viewRequirement).toHaveBeenCalled();
    });
  });
});
