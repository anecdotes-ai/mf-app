import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ControlStatusEnum } from 'core/modules/data/models/domain';
import { FrameworkCategoryItem } from './framework-category-item.component';
import { ControlsNavigator } from 'core/modules/shared-controls';
import { ExploreControlsSource } from 'core';

describe('FrameworkCategoryItem', () => {
  let fixture: ComponentFixture<FrameworkCategoryItem>;
  let component: FrameworkCategoryItem;

  let controlsNavigatorMock: ControlsNavigator;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: ControlsNavigator, useValue: {} }],
      declarations: [FrameworkCategoryItem],
    });

    fixture = TestBed.createComponent(FrameworkCategoryItem);
    component = fixture.componentInstance;

    controlsNavigatorMock = TestBed.inject(ControlsNavigator);
    controlsNavigatorMock.navigateToControlsPageAsync = jasmine.createSpy('navigateToControlsPageAsync');
    component.framework = {
      framework_id: 'fake-id',
    };
  });

  it('should be able to create component instance', () => {
    expect(component).toBeDefined();
  });

  describe('navigateToControlsCategory', () => {
    beforeEach(() => {
      component.category = {
        control_category: 'category-name',
        control_category_id: 123,
        controls: [
          { control_id: '123', control_name: '123', control_status: { status: ControlStatusEnum.READY_FOR_AUDIT } },
          { control_id: '678', control_name: '123', control_status: { status: ControlStatusEnum.READY_FOR_AUDIT } },
          { control_id: '345', control_name: '789', control_status: { status: ControlStatusEnum.APPROVED_BY_AUDITOR } },
        ],
      };
    });

    it('should have been called on click event', () => {
      // Arrange
      spyOn(component, 'navigateToControlsCategory').and.callFake(() => {});

      // Act
      fixture.debugElement.triggerEventHandler('click', {});

      // Assert
      expect(component.navigateToControlsCategory).toHaveBeenCalled();
    });

    it('should navigate to controls with specific category filter', () => {
      // Arrange
      const expectedCategoryFilter = component.category.control_category;

      // Act
      component.navigateToControlsCategory();

      // Assert
      expect(controlsNavigatorMock.navigateToControlsPageAsync).toHaveBeenCalledWith(
        component.framework.framework_id,
        { categories: expectedCategoryFilter },
        ExploreControlsSource.FrameworkOverview
      );
    });
  });
});
