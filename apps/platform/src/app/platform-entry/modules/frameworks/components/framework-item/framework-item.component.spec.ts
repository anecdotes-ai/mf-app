import { FrameworksFacadeService } from 'core/modules/data/services/facades';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AppRoutes, ExploreControlsSource } from 'core';
import { RoleService } from 'core/modules/auth-core/services';
import { FrameworkService, ControlsFacadeService } from 'core/modules/data/services';
import { reducers } from 'core/modules/data/store';
import { configureTestSuite } from 'ng-bullet';
import { FrameworkItemComponent } from './framework-item.component';
import { of } from 'rxjs/internal/observable/of';
import { ControlsNavigator } from 'core/modules/shared-controls';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FrameworkStatus } from 'core/modules/data/models';
import { By } from '@angular/platform-browser';
import { FrameworkContentService } from '../../services';

describe('FrameworkItemComponent', () => {
  configureTestSuite();

  let component: FrameworkItemComponent;
  let fixture: ComponentFixture<FrameworkItemComponent>;
  let frameworkFacadeService: FrameworksFacadeService;
  let controlsNavigatorMock: ControlsNavigator;
  let controlsFacadeService: ControlsFacadeService;

  const roleToReturnFromRoleService = 'fake-role';

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [FrameworkItemComponent],
      providers: [
        FrameworkService,
        RoleService,
        {
          provide: RoleService,
          useValue: {
            getCurrentUserRole: () => of(roleToReturnFromRoleService),
          },
        },
        { provide: FrameworkContentService, useValue: {} },
        { provide: FrameworksFacadeService, useValue: {} },
        { provide: ControlsNavigator, useValue: {} },
        { provide: ControlsFacadeService, useValue: {} },
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatMenuModule,
        TranslateModule.forRoot(),
        StoreModule.forRoot(reducers),
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameworkItemComponent);
    frameworkFacadeService = TestBed.inject(FrameworksFacadeService);
    frameworkFacadeService.isFrameworkInAudit = jasmine.createSpy('isFrameworkInAudit').and.returnValue(of(false));
    controlsFacadeService = TestBed.inject(ControlsFacadeService);
    controlsFacadeService.getControlsByFrameworkId = jasmine.createSpy('getControlsByFrameworkId').and.returnValue(of([]));
    controlsNavigatorMock = TestBed.inject(ControlsNavigator);
    controlsNavigatorMock.navigateToControlsPageAsync = jasmine.createSpy('navigateToControlsPageAsync');
    component = fixture.componentInstance;
    component.framework = {
      framework_id: 'fake-Id',
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('component is clicked', () => {
    it('should navigate to framework manager page with framework name', () => {
      // Arrange
      component.framework.framework_name = 'some-framework-name';
      component.framework.is_applicable = true;

      const router = fixture.debugElement.injector.get(Router);
      spyOn(router, 'navigate');

      // Act
      fixture.debugElement.triggerEventHandler('click', new MouseEvent('click'));

      // Assert
      expect(router.navigate).toHaveBeenCalledWith([
        `/${AppRoutes.Frameworks}/${component.framework.framework_name}/${AppRoutes.FrameworkOverview}`,
      ]);
    });

    it('should not navigate to framework manager page with not applicable framework', () => {
      // Arrange
      component.framework.is_applicable = false;

      const router = fixture.debugElement.injector.get(Router);
      spyOn(router, 'navigate');

      // Act
      fixture.debugElement.triggerEventHandler('click', new MouseEvent('click'));

      // Assert
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('component applicable class', () => {
    it('should be present of framework is applicable', () => {
      // Arrange
      component.framework.framework_name = 'some-framework-name';
      component.framework.is_applicable = true;

      // Act
      fixture.detectChanges();

      // Assert
      expect(fixture.debugElement.classes['applicable']).toBeTruthy();
    });

    it('should not be present if framework is not applicable', () => {
      // Arrange
      component.framework.is_applicable = false;

      // Act
      fixture.detectChanges();

      // Assert
      expect(fixture.debugElement.classes['applicable']).toBeFalsy();
    });
  });

  describe('exploreControls', () => {
    let fakeMouseEvent: MouseEvent;

    beforeEach(() => {
      fakeMouseEvent = new MouseEvent('click');
      fakeMouseEvent.stopPropagation = jasmine.createSpy('stopPropagation');
      component.framework.is_applicable = true;
    });

    it('should NOT navigate to controls page if framework not applicable', () => {
      // Arrange
      component.framework.is_applicable = false;

      // Act
      component.exploreControls({} as any);

      // Assert
      expect(controlsNavigatorMock.navigateToControlsPageAsync).not.toHaveBeenCalled();
    });

    it('should add additional filter to navigation if filter argument is specified', () => {
      // Arrange
      const expectedFilter = { key: 'fakekey', value: 'fakeValue' };

      // Act
      component.exploreControls(expectedFilter);

      // Assert
      expect(controlsNavigatorMock.navigateToControlsPageAsync).toHaveBeenCalledWith(component.framework.framework_id, { [expectedFilter.key]: expectedFilter.value }, ExploreControlsSource.FrameworksPage);
    });

    it('should add all plugins filter when automation key is provided within filter', () => {
      // Arrange
      // Act
      component.exploreControls({ key: 'automation', value: 'fake' });

      // Assert
      expect(controlsNavigatorMock.navigateToControlsPageAsync).toHaveBeenCalledWith(component.framework.framework_id, { plugins: 'All_plugins' },ExploreControlsSource.FrameworksPage);
    });
  });

  describe('rendering based on framework status', () => {
    [FrameworkStatus.AVAILABLE, FrameworkStatus.COMINGSOON, FrameworkStatus.AVAILABLE].forEach(status => {
      it(`should render section with id ${status.toLowerCase()} if framework is ${status}`, () => {
        // Arrange
        component.framework.framework_name = 'some-framework-name';
        component.framework.framework_status = status;
  
        // Act
        fixture.detectChanges();
        fixture.whenStable();
  
        const section = fixture.debugElement.query(By.css(`#${status.toLowerCase()}`));
  
        // Assert
        expect(section).toBeTruthy();
      });
    });
  });
  
});
