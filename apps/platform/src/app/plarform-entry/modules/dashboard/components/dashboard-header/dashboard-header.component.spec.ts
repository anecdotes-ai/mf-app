import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardHeaderComponent } from './dashboard-header.component';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { DashboardHeaderContentResolverService } from '../../services';
import { DashboardHeaderData, DashboardHeaderItem } from '../../models';
import { SpecificInformationContentValueTypes, WindowHelperService } from 'core';

describe('DashboardHeaderComponent', () => {
  let component: DashboardHeaderComponent;
  let fixture: ComponentFixture<DashboardHeaderComponent>;
  let resolverService: DashboardHeaderContentResolverService;
  let windowHelper: WindowHelperService;
  let mockData: DashboardHeaderData;
  let spyBuildTranslationKey: jasmine.Spy;
  let spyGetHeaderItems: jasmine.Spy;
  let mockHeaderItems: DashboardHeaderItem[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [TranslateModule.forRoot()],
      declarations: [DashboardHeaderComponent],
      providers: [DashboardHeaderContentResolverService, { provide: WindowHelperService, useValue: {}}],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardHeaderComponent);
    component = fixture.componentInstance;

    // Mock service dependencies
    resolverService = fixture.debugElement.injector.get(DashboardHeaderContentResolverService);
    windowHelper = fixture.debugElement.injector.get(WindowHelperService);

    //  Mock data
    mockData = {
      applicableControls: 58,
      automatedEvidence: 160,
      connectedPlugins: 4,
      savedThisYear: 48000,
    };
    mockHeaderItems = [
      {
        icon: 'plugins',
        value: 0,
        valueTypeToRepresent: SpecificInformationContentValueTypes.NUMBER,
        descriptionTranslateKey: 'items.connectedPlugins',
      },
    ];

    // Spies
    spyBuildTranslationKey = spyOn(component, 'buildTranslationKey').and.callThrough();
    spyGetHeaderItems = spyOn(resolverService, 'getHeaderItems').and.returnValue(mockHeaderItems);
  });

  it('should create', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  describe('Test: ngOnChanges', () => {
    it('should call resolverService and assign it to headerDisplayItems', () => {
      // Arrange
      component.data = { ...mockData };
      // Act
      component.ngOnChanges({
        data: new SimpleChange(null, component.data, true),
      });
      fixture.detectChanges();

      // Assert
      expect(spyGetHeaderItems.calls.any()).toBeTrue();
      expect(component.headerDisplayItems).toEqual(spyGetHeaderItems());
    });

    it('transferDataToProceed =  changes["data"].currentValue', () => {
      // Arrange
      component.data = { ...mockData };
      // Act
      component.ngOnChanges({
        data: new SimpleChange(null, component.data, true),
      });

      // Assert
      expect(spyGetHeaderItems).toHaveBeenCalledWith(component.data);
    });

    it('transferDataToProceed =  new DashboardHeaderData()', () => {
      // Arrange
      component.data = null;
      // Act
      component.ngOnChanges({
        data: new SimpleChange(null, component.data, true),
      });

      // Assert
      expect(spyGetHeaderItems).toHaveBeenCalledWith(new DashboardHeaderData());
    });
  });

  describe('Test: buildTranslationKey', () => {
    it('should return relativeKey with dashboard.header. prefix', () => {
      // Arrange
      const relativeKey = 'anyText';

      // Act
      const actual = spyBuildTranslationKey(relativeKey);

      // Assert
      expect(actual).toBe(`dashboard.header.${relativeKey}`);
    });
  });
});
