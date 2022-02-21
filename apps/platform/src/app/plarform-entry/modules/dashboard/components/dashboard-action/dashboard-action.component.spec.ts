import { CalculatedControl } from 'core/modules/data/models';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { DashboardActionComponent } from './dashboard-action.component';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { Router } from '@angular/router';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-action-item',
  template: `<span> MockDashboardActionItemComponent </span>`,
})
class MockDashboardActionItemComponent {
  @Input()
  data: CalculatedControl;
}

describe('DashboardActionComponent', () => {
  let component: DashboardActionComponent;
  let fixture: ComponentFixture<DashboardActionComponent>;
  let mockControlsData: CalculatedControl[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [TranslateModule.forRoot()],
      providers: [Router],
      declarations: [DashboardActionComponent, PerfectScrollbarComponent, MockDashboardActionItemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    mockControlsData = [{ control_id: '234234234' }, { control_id: '25467456745675' }, { control_id: '88656756757' }];
    fixture = TestBed.createComponent(DashboardActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('css class binding to host component test', () => {
    it('should apply "actions-exists" class if data in input field is defined', async () => {
      // Arrange
      component.data = mockControlsData;

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(fixture.debugElement.classes['actions-exists']).toBeTruthy();
    });

    it('should not apply "actions-exists" class if data is not provided', async () => {
      // Arrange
      component.data = undefined;

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(fixture.debugElement.classes['actions-exists']).toBeFalsy();
    });
  });

  describe('Different content displaying depending on input data exists', () => {
    it('When input data provided - should show the exact number of action-required-items components', async () => {
      // Arrange
      component.data = mockControlsData;

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      const itemsElements = fixture.debugElement.queryAll(By.directive(MockDashboardActionItemComponent));
      const noActionsYetElement = fixture.debugElement.query(By.css('#no-actions-content'));

      expect(itemsElements.length).not.toBe(0);
      expect(noActionsYetElement).toBeFalsy();
      expect(itemsElements.length).toBe(mockControlsData.length);
    });

    it('When input data is not provided - should show "No Actions Yet" template', async () => {
      // Arrange
      component.data = undefined;

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      const noActionsYetElement = fixture.debugElement.query(By.css('#no-actions-content'));
      const itemsElements = fixture.debugElement.queryAll(By.directive(MockDashboardActionItemComponent));

      expect(noActionsYetElement).toBeTruthy();
      expect(itemsElements.length).toBe(0);
    });
  });

  describe('Test: buildTranslationKey', () => {
    it('should return relativeKey with dashboard.action. prefix', () => {
      // Arrange
      const relativeKey = 'anyText';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toBe(`dashboard.action.${relativeKey}`);
    });
  });
});
