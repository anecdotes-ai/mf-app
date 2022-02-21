import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { ControlsStatusBarComponent } from './controls-status-bar.component';

describe('ControlsStatusBarComponent', () => {
  configureTestSuite();

  let component: ControlsStatusBarComponent;
  let fixture: ComponentFixture<ControlsStatusBarComponent>;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [ControlsStatusBarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlsStatusBarComponent);
    component = fixture.componentInstance;
    component.progressBarDefinition = {
      one: { count: 20, cssClass: 'class-one' },
      two: { count: 30, cssClass: 'class-two' },
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#getControlsStatusBarData', () => {
    it('should return null if progressBarDefinition is not defined', () => {
      // Arrange
      component.progressBarDefinition = null;

      // Act
      const result = component.getControlsStatusBarData();

      // Assert
      expect(result).toBeNull();
    });

    it('should return null if maxValue is not defined and calculated maxValue === 0', () => {
      // Arrange
      component.progressBarDefinition = {};
      component.maxValue = null;

      // Act
      const result = component.getControlsStatusBarData();

      // Assert
      expect(result).toBeNull();
    });

    it('should return correct resultArray if maxValue is not passed', () => {
      // Arrange
      component.maxValue = null;

      // Act
      const result = component.getControlsStatusBarData();

      // Assert
      expect(result).toEqual([
        { width: '40', controlsAmount: 20, cssClass: 'class-one' },
        { width: '60', controlsAmount: 30, cssClass: 'class-two' },
      ]);
    });

    it('should return correct resultArray if maxValue is passed', () => {
      // Arrange
      component.maxValue = 40;

      // Act
      const result = component.getControlsStatusBarData();

      // Assert
      expect(result).toEqual([
        { width: '-25', controlsAmount: -85, cssClass: 'reduced-percents' },
        { width: '50', controlsAmount: 20, cssClass: 'class-one' },
        { width: '75', controlsAmount: 30, cssClass: 'class-two' },
      ]);
    });
  });

  describe('displaySectionPercentage', () => {
    it('should display bar-section-info with proper data if displaySectionPercentage === true', async () => {
      // Arrange

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      const barSectionInfoElements = fixture.debugElement.queryAll(By.css('.bar-section-info'));
      expect(barSectionInfoElements[0].nativeElement.innerText).toEqual('20');
      expect(barSectionInfoElements[1].nativeElement.innerText).toEqual('30');
    });
  });
});
