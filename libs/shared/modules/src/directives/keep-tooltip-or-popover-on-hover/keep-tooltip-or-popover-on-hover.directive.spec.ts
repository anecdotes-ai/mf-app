import { ElementRef, SimpleChange } from '@angular/core';
import { NgbPopover, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { WindowHelperService } from 'core/services';
import { delayedPromise } from 'core/utils';
import { ClassIdProvider, KeepTooltipOrPopoverOnHoverDirective } from './keep-tooltip-or-popover-on-hover.directive';

describe('Directive: KeepTooltipOnHover', () => {
  let ngbTooltip: NgbTooltip;
  let ngbPopover: NgbPopover;
  let htmlRef: ElementRef;
  let htmlElement: HTMLElement;
  let windowHelper: WindowHelperService;
  let classIdProvider: ClassIdProvider;
  let tooltipOrPopoverHtmlElement: HTMLElement;
  let documentMock: Document;
  const classId = 'fake-class-id';

  let underTest: KeepTooltipOrPopoverOnHoverDirective;

  beforeEach(() => {
    ngbTooltip = {} as any;
    ngbPopover = {} as any;
    htmlElement = document.createElement('div');
    tooltipOrPopoverHtmlElement = document.createElement('div');
    htmlRef = { nativeElement: htmlElement };
    documentMock = {} as any;
    windowHelper = {} as any;
    classIdProvider = {
      getNextPopoverClassId: jasmine.createSpy('getNextPopoverClassId').and.returnValue(classId),
      getNextTooltipClassId: jasmine.createSpy('getNextTooltipClassId').and.returnValue(classId),
    };

    windowHelper.getWindow = jasmine.createSpy('getWindow').and.returnValue({ document: documentMock });

    documentMock.querySelector = jasmine.createSpy('querySelector').and.returnValue(tooltipOrPopoverHtmlElement);
  });

  describe('for tooltip', () => {
    const tooltipInitialClass = 'someClass';
    const tooltipClassIdFromClassIdProvider = 'fake-tooltip-classid';

    beforeEach(() => {
      classIdProvider = {
        getNextTooltipClassId: jasmine
          .createSpy('getNextTooltipClassId')
          .and.returnValue(tooltipClassIdFromClassIdProvider),
      } as any;
      ngbTooltip.tooltipClass = tooltipInitialClass;
      ngbTooltip.isOpen = jasmine.createSpy('isOpen').and.returnValue(false);

      underTest = new KeepTooltipOrPopoverOnHoverDirective(classIdProvider, ngbTooltip, null, htmlRef, windowHelper);
      underTest.keepOnHover = true;
      ngbTooltip.open = jasmine.createSpy('open');
      ngbTooltip.close = jasmine.createSpy('close');
      underTest.ngOnChanges({
        keepOnHover: new SimpleChange(null, true, true),
      });
    });

    it('should append class for tooltip from classIdProvider', () => {
      // Arrange
      // Act
      // Assert
      expect(ngbTooltip.tooltipClass).toBe(`${tooltipInitialClass} ${tooltipClassIdFromClassIdProvider}`);
    });

    it('should set null for "triggers" property', () => {
      // Arrange
      // Act
      // Assert
      expect(ngbTooltip.triggers).toBeNull();
    });

    it('should open tooltip when mouseenter event is triggered for host', () => {
      // Arrange
      // Act
      htmlElement.dispatchEvent(new MouseEvent('mouseenter'));

      // Assert
      expect(ngbTooltip.open).toHaveBeenCalled();
    });

    it('should query tooltip html element by classId', () => {
      // Arrange
      // Act
      htmlElement.dispatchEvent(new MouseEvent('mouseenter'));

      // Assert
      expect(documentMock.querySelector).toHaveBeenCalledWith(`.${tooltipClassIdFromClassIdProvider}`);
    });

    describe('tooltip is open', () => {
      beforeEach(() => {
        htmlElement.dispatchEvent(new MouseEvent('mouseenter'));
      });

      it('should close tooltip after mouseenter event dispatched and then mouseleave event dispatched', async () => {
        // Arrange
        tooltipOrPopoverHtmlElement.dispatchEvent(new MouseEvent('mouseenter'));

        // Act
        htmlElement.dispatchEvent(new MouseEvent('mouseleave'));
        tooltipOrPopoverHtmlElement.dispatchEvent(new MouseEvent('mouseleave'));

        await delayedPromise(600);

        // Assert
        expect(ngbTooltip.close).toHaveBeenCalled();
      });
    });
  });

  describe('for popover', () => {
    const popoverInitialClass = 'someClass';
    const popoverClassIdFromClassIdProvider = 'fake-popover-classid';

    beforeEach(() => {
      classIdProvider = {
        getNextPopoverClassId: jasmine
          .createSpy('getNextPopoverClassId')
          .and.returnValue(popoverClassIdFromClassIdProvider),
      } as any;
      ngbPopover.popoverClass = popoverInitialClass;
      ngbPopover.isOpen = jasmine.createSpy('isOpen').and.returnValue(false);

      underTest = new KeepTooltipOrPopoverOnHoverDirective(classIdProvider, null, ngbPopover, htmlRef, windowHelper);
      underTest.keepOnHover = true;
      ngbPopover.open = jasmine.createSpy('open');
      ngbPopover.close = jasmine.createSpy('close');
      underTest.ngOnChanges({
        keepOnHover: new SimpleChange(null, true, true),
      });
    });

    it('should append class for popover from classIdProvider', () => {
      // Arrange
      // Act
      // Assert
      expect(ngbPopover.popoverClass).toBe(`${popoverInitialClass} ${popoverClassIdFromClassIdProvider}`);
    });

    it('should set null for "triggers" property', () => {
      // Arrange
      // Act
      // Assert
      expect(ngbPopover.triggers).toBeNull();
    });

    it('should open popover when mouseenter event is triggered for host', () => {
      // Arrange
      // Act
      htmlElement.dispatchEvent(new MouseEvent('mouseenter'));

      // Assert
      expect(ngbPopover.open).toHaveBeenCalled();
    });

    it('should query popover html element by classId', () => {
      // Arrange
      // Act
      htmlElement.dispatchEvent(new MouseEvent('mouseenter'));

      // Assert
      expect(documentMock.querySelector).toHaveBeenCalledWith(`.${popoverClassIdFromClassIdProvider}`);
    });

    describe('popover is open', () => {
      beforeEach(() => {
        htmlElement.dispatchEvent(new MouseEvent('mouseenter'));
      });

      it('should close popover after mouseenter event dispatched and then mouseleave event dispatched', async () => {
        // Arrange
        tooltipOrPopoverHtmlElement.dispatchEvent(new MouseEvent('mouseenter'));

        // Act
        htmlElement.dispatchEvent(new MouseEvent('mouseleave'));
        tooltipOrPopoverHtmlElement.dispatchEvent(new MouseEvent('mouseleave'));

        await delayedPromise(600);

        // Assert
        expect(ngbPopover.close).toHaveBeenCalled();
      });
    });
    
    describe('close popover on click', () => {
      beforeEach(() => {
        htmlElement.dispatchEvent(new MouseEvent('mouseenter'));
      });

      it('default value of closeOnClick should be false', async () => {
        // Assert
        expect(underTest.closeOnClick).toBeFalse();
      });

      it('should close popover after click event dispatched if closeOnClick is true', async () => {
        // Arrange
        underTest.closeOnClick = true;
        tooltipOrPopoverHtmlElement.dispatchEvent(new MouseEvent('click'));

        // Act
        await delayedPromise(600);

        // Assert
        expect(ngbPopover.close).toHaveBeenCalled();
      });

      it('shouldnt close popover after click event dispatched if closeOnClick is false', async () => {
        // Arrange
        underTest.closeOnClick = false;
        tooltipOrPopoverHtmlElement.dispatchEvent(new MouseEvent('click'));

        // Act
        await delayedPromise(600);

        // Assert
        expect(ngbPopover.close).toHaveBeenCalledTimes(0);
      });
    });
  });
});
