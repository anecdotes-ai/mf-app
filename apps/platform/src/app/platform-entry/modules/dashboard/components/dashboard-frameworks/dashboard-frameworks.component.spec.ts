import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardFrameworksComponent } from './dashboard-frameworks.component';
import { TabModel } from 'core/modules/dropdown-menu';
import { FrameworkService } from 'core/modules/data/services';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardFrameworksResolverService } from '../../services';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { DashboardFrameworksSectionData } from '../../models';

describe('DashboardFrameworksComponent', () => {
  let component: DashboardFrameworksComponent;
  let fixture: ComponentFixture<DashboardFrameworksComponent>;
  let frameworksResolver: DashboardFrameworksResolverService;
  let mockFrameworksData: TabModel[];
  let spyGetFrameworkTabs: jasmine.Spy;
  let mockFrameworksInputData: DashboardFrameworksSectionData;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [TranslateModule.forRoot({})],
      declarations: [DashboardFrameworksComponent],
      providers: [
        DashboardFrameworksResolverService,
        { provide: FrameworkService, useValue: new FrameworkService(null, null) },
      ],
    })
      .overrideComponent(DashboardFrameworksComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DashboardFrameworksComponent);
    component = fixture.componentInstance;

    // Mock service dependencies
    frameworksResolver = fixture.debugElement.injector.get(DashboardFrameworksResolverService);

    // Mock data
    mockFrameworksInputData = {
      frameworksSectionItems: [
        {
          framework: { framework_id: '4234234234' },
          relatedControls: [{ control_id: '777545' }, { control_id: '55454' }],
        },
      ],
    };
    mockFrameworksData = [
      {
        icon: 'frameworks/iso270012013-70px',
        progress: 53,
        tabId: 0,
        translationKey: 'ISO 27001:2013',
      },
    ];

    // Spies
    spyGetFrameworkTabs = spyOn(frameworksResolver, 'getFrameworkTabs').and.returnValue(mockFrameworksData);
    fixture.detectChanges();
  });

  it('should create', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  describe('Test: ngOnChanges', () => {
    it('should not call frameworksResolver', () => {
      // Arrange
      component.data = mockFrameworksInputData;

      // Act
      component.ngOnChanges({
        name: new SimpleChange(null, component.data, true),
      });

      // Assert
      expect(spyGetFrameworkTabs.calls.any()).toBeFalse();
    });

    it('should call FrameworkTabs', () => {
      // Arrange
      component.data = mockFrameworksInputData;

      // Act
      component.ngOnChanges({
        data: new SimpleChange(null, component.data, true),
      });
      fixture.detectChanges();

      // Assert
      expect(spyGetFrameworkTabs).toHaveBeenCalled();
    });
  });

  describe('Test: buildTranslationKey', () => {
    it('should return relativeKey with dashboard.frameworks. prefix', () => {
      // Arrange
      const relativeKey = 'anyText';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toBe(`dashboard.frameworks.${relativeKey}`);
    });
  });
});
