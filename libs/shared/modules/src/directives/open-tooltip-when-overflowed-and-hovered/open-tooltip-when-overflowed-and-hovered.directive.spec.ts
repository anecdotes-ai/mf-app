import { Component, DebugElement, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { configureTestSuite } from 'ng-bullet';
import { OpenTooltipWhenOverflowedAndHoveredDirective } from './open-tooltip-when-overflowed-and-hovered.directive';

@Component({
  selector: 'app-host',
  template: `
    <div
      id="overflowed"
      style="width: 20px;height:30px;"
      [openTooltipWhenOverflowedAndHovered]="openTooltipWhenOverflowedAndHovered"
      [openOnWidthOverflow]="openOnWidthOverflow"
      [openOnHeightOverflow]="openOnHeightOverflow"
    >
      <div id="overflowing" style="width: 2000px;height:3000px;"></div>
    </div>
  `,
})
class HostComponent {
  @Input()
  openTooltipWhenOverflowedAndHovered: boolean;

  @Input()
  openOnWidthOverflow: boolean;

  @Input()
  openOnHeightOverflow: boolean;
}

describe('Directive: OverflowDetection', () => {
  configureTestSuite();

  let hostComponent: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let tooltipMock: NgbTooltip;

  let isTooltipOpen: boolean;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [HostComponent, OpenTooltipWhenOverflowedAndHoveredDirective],
      providers: [{ provide: NgbTooltip, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    tooltipMock = TestBed.inject(NgbTooltip);
    tooltipMock.open = jasmine.createSpy('open');
    tooltipMock.close = jasmine.createSpy('close');
    tooltipMock.isOpen = jasmine.createSpy('isOpen').and.callFake(() => isTooltipOpen);
    hostComponent.openTooltipWhenOverflowedAndHovered = true;
  });

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function getOverflowedElement(): DebugElement {
    return fixture.debugElement.query(By.css('#overflowed'));
  }

  function getOverflowingElement(): DebugElement {
    return fixture.debugElement.query(By.css('#overflowing'));
  }

  describe('openOnWidthOverflow', () => {
    describe('mouseover', () => {
      describe('openOnWidthOverflow is true, inner content overflows parent', () => {
        it('should open tooltip', async () => {
          // Arrange
          hostComponent.openOnWidthOverflow = true;

          // Act
          await detectChanges();
          getOverflowedElement().triggerEventHandler('mouseover', {});

          // Assert
          expect(tooltipMock.open).toHaveBeenCalled();
        });
      });

      describe('openOnWidthOverflow is false, inner content overflows parent', () => {
        it('should not open tooltip', async () => {
          // Arrange
          hostComponent.openOnWidthOverflow = false;

          // Act
          await detectChanges();
          getOverflowedElement().triggerEventHandler('mouseover', {});

          // Assert
          expect(tooltipMock.open).not.toHaveBeenCalled();
        });
      });

      describe('openTooltipWhenOverflowedAndHovered is false, openOnWidthOverflow is false, inner content overflows parent', () => {
        it('should not open tooltip', async () => {
          // Arrange
          hostComponent.openTooltipWhenOverflowedAndHovered = false;
          hostComponent.openOnWidthOverflow = false;

          // Act
          await detectChanges();
          getOverflowedElement().triggerEventHandler('mouseover', {});

          // Assert
          expect(tooltipMock.open).not.toHaveBeenCalled();
        });
      });

      describe('overflowingContent does not overflow parent', () => {
        it('should not open tooltip', async () => {
          // Arrange
          getOverflowingElement().styles['width'] = '100%';
          hostComponent.openTooltipWhenOverflowedAndHovered = true;
          hostComponent.openOnWidthOverflow = true;

          // Act
          await detectChanges();
          getOverflowedElement().triggerEventHandler('mouseover', {});

          // Assert
          expect(tooltipMock.open).not.toHaveBeenCalled();
        });
      });
    });

    describe('mouseleave', () => {
      describe('openOnWidthOverflow is true, tooltip is open', () => {
        it('should close tooltip', async () => {
          // Arrange
          isTooltipOpen = true;
          hostComponent.openOnWidthOverflow = true;

          // Act
          await detectChanges();
          getOverflowedElement().triggerEventHandler('mouseleave', {});

          // Assert
          expect(tooltipMock.close).toHaveBeenCalled();
        });
      });

      describe('openTooltipWhenOverflowedAndHovered is false', () => {
        it('should not close tooltip', async () => {
          // Arrange
          isTooltipOpen = true;
          hostComponent.openTooltipWhenOverflowedAndHovered = false;
          hostComponent.openOnWidthOverflow = true;

          // Act
          await detectChanges();
          getOverflowedElement().triggerEventHandler('mouseleave', {});

          // Assert
          expect(tooltipMock.close).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('openOnHeightOverflow', () => {
    describe('mouseover', () => {
      describe('openOnHeightOverflow is true, inner content overflows parent', () => {
        it('should open tooltip', async () => {
          // Arrange
          hostComponent.openOnHeightOverflow = true;

          // Act
          await detectChanges();
          getOverflowedElement().triggerEventHandler('mouseover', {});

          // Assert
          expect(tooltipMock.open).toHaveBeenCalled();
        });
      });

      describe('openOnHeightOverflow is false, inner content overflows parent', () => {
        it('should not open tooltip', async () => {
          // Arrange
          hostComponent.openOnHeightOverflow = false;

          // Act
          await detectChanges();
          getOverflowedElement().triggerEventHandler('mouseover', {});

          // Assert
          expect(tooltipMock.open).not.toHaveBeenCalled();
        });
      });

      describe('openTooltipWhenOverflowedAndHovered is false, openOnHeightOverflow is false, inner content overflows parent', () => {
        it('should not open tooltip', async () => {
          // Arrange
          hostComponent.openTooltipWhenOverflowedAndHovered = false;
          hostComponent.openOnHeightOverflow = false;

          // Act
          await detectChanges();
          getOverflowedElement().triggerEventHandler('mouseover', {});

          // Assert
          expect(tooltipMock.open).not.toHaveBeenCalled();
        });
      });

      describe('overflowingContent does not overflow parent', () => {
        it('should not open tooltip', async () => {
          // Arrange
          getOverflowingElement().styles['height'] = '100%';
          hostComponent.openTooltipWhenOverflowedAndHovered = true;
          hostComponent.openOnHeightOverflow = true;

          // Act
          await detectChanges();
          getOverflowedElement().triggerEventHandler('mouseover', {});

          // Assert
          expect(tooltipMock.open).not.toHaveBeenCalled();
        });
      });
    });

    describe('mouseleave', () => {
      describe('openOnHeightOverflow is true, tooltip is open', () => {
        it('should close tooltip', async () => {
          // Arrange
          isTooltipOpen = true;
          hostComponent.openOnHeightOverflow = true;

          // Act
          await detectChanges();
          getOverflowedElement().triggerEventHandler('mouseleave', {});

          // Assert
          expect(tooltipMock.close).toHaveBeenCalled();
        });
      });

      describe('openTooltipWhenOverflowedAndHovered is false', () => {
        it('should not close tooltip', async () => {
          // Arrange
          isTooltipOpen = true;
          hostComponent.openTooltipWhenOverflowedAndHovered = false;
          hostComponent.openOnHeightOverflow = true;

          // Act
          await detectChanges();
          getOverflowedElement().triggerEventHandler('mouseleave', {});

          // Assert
          expect(tooltipMock.close).not.toHaveBeenCalled();
        });
      });
    });
  });
});
