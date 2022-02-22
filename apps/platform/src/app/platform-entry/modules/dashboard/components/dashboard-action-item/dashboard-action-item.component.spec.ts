import { AppRoutes } from 'core/constants/routes';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardActionItemComponent } from './dashboard-action-item.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CalculatedControl } from 'core/modules/data/models';
import { ControlStatusEnum } from 'core/modules/data/models/domain';
import { ControlStatusMappingData } from 'core/utils';
import { Router } from '@angular/router';
import { AnecdotesUnifiedFramework } from 'core/modules/data/constants/anecdotes-unified-framework';

describe('DashboardActionItemComponent', () => {
  let component: DashboardActionItemComponent;
  let fixture: ComponentFixture<DashboardActionItemComponent>;
  let mockControl: CalculatedControl;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [DashboardActionItemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    mockControl = {
      control_id: '312312312',
      control_name: 'TestName',
      control_status: { status: ControlStatusEnum.INPROGRESS },
    };
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(DashboardActionItemComponent);
    component = fixture.componentInstance;
    component.control = mockControl;
    component.statusMappingConst = ControlStatusMappingData;
  });

  it('should create', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    // Assert
    expect(component).toBeDefined();
  });

  describe('#exploreControl function', () => {
    it('should navigate user to controls page with filtering by control name', async () => {
      // Arrange
      const navigateSpy = jasmine.createSpy('navigate');
      router.navigate = navigateSpy;

      // Act
      component.exploreControl();
      await fixture.whenStable();

      // Assert
      expect(router.navigate).toHaveBeenCalledWith(
        [AppRoutes.Controls.replace(':framework', AnecdotesUnifiedFramework.framework_name)],
        jasmine.objectContaining({
          queryParams: {
            searchQuery: component.control.control_name,
          },
        })
      );
    });
  });

  describe('#buildTranslationKey function', () => {
    it('translation key should start with  "dashboard.action."', async () => {
      // Arrange
      const expectedKeyToStartWith = 'dashboard.action.';

      // Act
      const builtTranslationKey = component.buildTranslationKey('anyValue');
      await fixture.whenStable();

      // Assert
      expect(builtTranslationKey).toEqual(expectedKeyToStartWith + 'anyValue');
    });
  });
});
