import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { DashboardCategoriesResolverService } from '../../services';
import { CategoryProgressStatus } from '../../models/category';
import { DashboardCategoriesComponent } from './dashboard-categories.component';
import { ExploreControlsSource, MediaQueryService } from 'core';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ControlsNavigator } from 'core/modules/shared-controls';
import { configureTestSuite } from 'ng-bullet';

describe('DashboardCategoriesComponent', () => {
  configureTestSuite();

  let component: DashboardCategoriesComponent;
  let fixture: ComponentFixture<DashboardCategoriesComponent>;
  let categoriesResolverService: DashboardCategoriesResolverService;
  let mediaQueryService: MediaQueryService;
  let spyGroupInCategories: jasmine.Spy;
  let spyGetTabletSize: jasmine.Spy;
  let controlsNavigatorMock: ControlsNavigator;

  beforeAll(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, TranslateModule.forRoot()],
      declarations: [DashboardCategoriesComponent],
      providers: [DashboardCategoriesResolverService, MediaQueryService, { provide: ControlsNavigator, useValue: {} }],
    }).compileComponents(); 
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardCategoriesComponent);
    component = fixture.componentInstance;
    component.framework = {
      framework_id: 'fake-id'
    };
    fixture.detectChanges();

    // Mock service dependencies
    categoriesResolverService = fixture.debugElement.injector.get(DashboardCategoriesResolverService);
    mediaQueryService = fixture.debugElement.injector.get(MediaQueryService);

    // Spies
    spyGroupInCategories = spyOn(categoriesResolverService, 'groupInCategories').and.callThrough();
    spyGetTabletSize = spyOn(mediaQueryService, 'getTabletSize').and.callThrough();
    controlsNavigatorMock = TestBed.inject(ControlsNavigator);
    controlsNavigatorMock.navigateToControlsPageAsync = jasmine.createSpy('navigateToControlsPageAsync');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Test: ngOnInit', () => {
    it('should call method getTabletSize', () => {
      // Act
      component.ngOnInit();

      // Assert
      expect(spyGetTabletSize).toHaveBeenCalled();
    });
  });

  describe('Test: getStatusProgress', () => {
    it('should return BASIC status', () => {
      // Arrange
      const mockStatusIndicationBASIC = 20;

      // Act
      const status = component.getStatusProgress(mockStatusIndicationBASIC);
      // Assert
      expect(status).toEqual(CategoryProgressStatus.BASIC);
    });

    it('should return ADVANCED status', () => {
      // Arrange
      const mockStatusIndicationADVANCED = 50;

      // Act
      const status = component.getStatusProgress(mockStatusIndicationADVANCED);

      // Assert
      expect(status).toEqual(CategoryProgressStatus.ADVANCED);
    });

    it('should return SUPERSTAR status', () => {
      // Arrange
      const mockStatusIndicationSUPERSTAR = 100;

      // Act
      const status = component.getStatusProgress(mockStatusIndicationSUPERSTAR);

      // Assert
      expect(status).toEqual(CategoryProgressStatus.SUPERSTAR);
    });

    it('should return undefined', () => {
      // Arrange
      const mockStatusIndication = undefined;

      // Act
      const status = component.getStatusProgress(mockStatusIndication);

      // Assert
      expect(status).toBeUndefined();
    });
  });

  describe('Test: buildTranslationKey', () => {
    it('should return relativeKey with "dashboard.categories." prefix', () => {
      // Arrange
      const relativeKey = 'anyText';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toBe(`dashboard.categories.${relativeKey}`);
    });
  });

  describe('Test: exploreControls', () => {
    const fName = 'bla';
    const catName = 'test-cat';
    const cat = { category_name: catName };
    beforeEach(() => {
      component.framework = { framework_name: fName };
      component.categories = [cat];
    });

    it('should navigate to controls page', () => {
      // Arrange
      // Act
      component.exploreControls(cat);

      // Assert
      expect(controlsNavigatorMock.navigateToControlsPageAsync).toHaveBeenCalledWith(component.framework.framework_id, {
        categories: catName,
      }, ExploreControlsSource.Dashboard);
    });

    it('should call exploreControls when click on the category header', () => {
      // Arrange
      fixture.detectChanges();
      const categoryHeader = fixture.debugElement.query(By.css('.title'));
      const spy = spyOn(component, 'exploreControls');
      
      // Act
      categoryHeader.triggerEventHandler('click', null);
      fixture.detectChanges();

      // Assert
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('empty state handling', () => {
    it('should get categories calling categoriesResolverService.groupInCategories if passed empty state is true', () => {
      // Arrange
      component.emptyState = true;
      component.data = [{ control_id: 'test' }];
      component.framework = { framework_name: '1' };
      categoriesResolverService.filterControlsByFramework = jasmine.createSpy('filterControlsByFramework');

      // Act
      component.ngOnInit();

      // Assert
      expect(spyGroupInCategories).toHaveBeenCalledWith(component.data, false, component.framework);
    });
  });
});
