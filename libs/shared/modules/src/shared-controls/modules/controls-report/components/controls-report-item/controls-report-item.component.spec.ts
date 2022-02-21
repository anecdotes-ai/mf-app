import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatedControl } from 'core/modules/data/models';
import { PluginService } from 'core/modules/data/services';
import { configureTestSuite } from 'ng-bullet';
import { ControlsReportItemComponent } from './controls-report-item.component';

describe('ControlsReportItemComponent', () => {
  configureTestSuite();
  let component: ControlsReportItemComponent;
  let fixture: ComponentFixture<ControlsReportItemComponent>;

  let pluginService: PluginService;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [ControlsReportItemComponent],
      providers: [
        {
          provide: PluginService,
          useValue: {
            getServiceIconLink: jasmine.createSpy('getServiceIconLink').and.returnValue('testIconPath'),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlsReportItemComponent);
    pluginService = TestBed.inject(PluginService);
    component = fixture.componentInstance;
    component.control = { control_id: 'testId', automating_services_ids: ['test_service_id1', 'test_service_id1'] };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onChanges()', () => {
    it('should call getServiceIconLink 4 times', async () => {
      // Arrange
      fixture.detectChanges();
      await fixture.whenStable();
      component.control = {
        control_calculated_requirements: [
          {
            requirement_applicability: true,
            requirement_related_evidences: [{ service_id: 'test_id' }, { service_id: 'test_id2' }],
          },
          { requirement_applicability: true, requirement_related_evidences: [{ service_id: 'test_id2' }] },
          { requirement_applicability: true, requirement_related_evidences: [{ service_id: 'test_id' }] },
        ],
      };

      // Act
      component.ngOnChanges({
        control: new SimpleChange(null, component.control, true),
      });

      // Assert
      expect(pluginService.getServiceIconLink).toHaveBeenCalledTimes(4);
    });

    describe('applicable requirements', () => {
      it('should contain only applicable requirements', async () => {
        // Arrange
        component.control = {
          control_calculated_requirements: [
            {
              requirement_name: 'first requirement',
              requirement_applicability: true,
              requirement_related_evidences: [],
            },
            {
              requirement_name: 'second requirement',
              requirement_applicability: true,
              requirement_related_evidences: [],
            },
            {
              requirement_name: 'third requirement',
              requirement_applicability: false,
              requirement_related_evidences: [],
            },
          ],
        };
        fixture.detectChanges();
        await fixture.whenStable();

        // Act
        component.ngOnChanges({
          control: new SimpleChange(null, component.control, true),
        });

        // Assert
        expect(component.applicableRequirements.length).toBe(2);
        component.applicableRequirements.forEach((req) => {
          expect(req.requirement_applicability).toBeTrue();
        });
      });
    });
  });
});
