import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DataFilterManagerService, FilterOptionState } from 'core/modules/data-manipulation/data-filter';
import { ControlStatusEnum, Framework } from 'core/modules/data/models/domain';
import { ControlsCsvExportService } from 'core/modules/shared-controls/services';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { ALL_CATEGORIES, ControlsSecondaryHeaderComponent } from './controls-secondary-header.component';
import { ControlsFacadeService, EvidenceService } from 'core/modules/data/services';
import { FileDownloadingHelperService, MessageBusService } from 'core';
import { CalculatedControl } from 'core/modules/data/models';
import { ModalWindowService } from 'core/modules/modals';
import { ActionMenuButtonComponent } from 'core/modules/dropdown-menu';
import { MatMenuModule } from '@angular/material/menu';

describe('ControlsSecondaryHeaderComponent', () => {
  configureTestSuite();

  let component: ControlsSecondaryHeaderComponent;
  let fixture: ComponentFixture<ControlsSecondaryHeaderComponent>;
  let filterManager: DataFilterManagerService;
  let controlsFacade: ControlsFacadeService;
  let filteringOptions: {
    [key: string]: {
      [key: string]: FilterOptionState<any>;
    };
  } = {
    categories: {},
  };

  const applicableControls: CalculatedControl[] = [
    {
      control_category: 'category',
      control_name: 'control-name',
      control_is_applicable: true,
    },
  ];
  const framework: Framework = { framework_id: 'some-id', framework_name: 'some-name' };
  const controls = [...applicableControls, { control_is_applicable: false }];

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), MatMenuModule],
      declarations: [ControlsSecondaryHeaderComponent, ActionMenuButtonComponent],
      providers: [
        { provide: DataFilterManagerService, useValue: {} },
        { provide: ControlsCsvExportService, useValue: {} },
        { provide: ControlsFacadeService, useValue: {} },
        { provide: EvidenceService, useValue: {} },
        { provide: FileDownloadingHelperService, useValue: {} },
        { provide: MessageBusService, useValue: {} },
        { provide: ModalWindowService, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlsSecondaryHeaderComponent);
    component = fixture.componentInstance;

    filterManager = TestBed.inject(DataFilterManagerService);
    filterManager.resetField = jasmine.createSpy('resetField');
    filterManager.toggleOptions = jasmine.createSpy('toggleOptions');
    filterManager.getFilteringOptions = jasmine
      .createSpy('getFilteringOptions')
      .and.callFake(() => of(filteringOptions));
    filterManager.getDataFilterEvent = jasmine.createSpy('getDataFilterEvent').and.callFake(() => of(controls));

    controlsFacade = TestBed.inject(ControlsFacadeService);
    controlsFacade.getControlsByFrameworkId = jasmine.createSpy('getControlsByFrameworkId').and.callFake(() => of(applicableControls));

    component.framework = framework;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    beforeEach(() => {
      filteringOptions = {
        status: {
          [ControlStatusEnum.NOTSTARTED]: { calculatedCount: 2 } as FilterOptionState<any>,
          [ControlStatusEnum.COMPLIANT]: { calculatedCount: 1 } as FilterOptionState<any>,
          [ControlStatusEnum.INPROGRESS]: { calculatedCount: 1 } as FilterOptionState<any>,
        },
      };
    });

    it('should correctly get controlsCategories if getFilteringOptions emits value', (done) => {
      // Arrange
      filteringOptions = {
        categories: {
          'category-1': {
            value: 'category-1',
          } as FilterOptionState<any>,
          'category-2': {
            value: 'category-2',
          } as FilterOptionState<any>,
        },
      };

      // Act
      fixture.detectChanges();

      // Assert
      component.controlsCategories$.subscribe((result) => {
        expect(result).toEqual([ALL_CATEGORIES, 'category-1', 'category-2']);
        done();
      });
    });

    it('should correctly get controlsCategories if getFilteringOptions emits empty value', (done) => {
      // Arrange
      filteringOptions = {};

      // Act
      fixture.detectChanges();

      // Assert
      component.controlsCategories$.subscribe((result) => {
        expect(result).toEqual([ALL_CATEGORIES]);
        done();
      });
    });
  });

  describe('#buildTranslationKey', () => {
    it('should correctly build translation key', () => {
      // Arrange
      const relativeKey = 'some-key';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toEqual(`controls.secondaryHeader.${relativeKey}`);
    });
  });
});
