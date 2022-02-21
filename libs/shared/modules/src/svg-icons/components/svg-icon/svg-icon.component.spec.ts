/* tslint:disable:no-unused-variable */
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SvgRegistryService } from '../../services';
import { SvgIconComponent } from './svg-icon.component';
import { LoggerService } from 'core';

@Component({
  selector: 'app-host',
  template: ` <svg-icon [src]="src"></svg-icon> `,
})
export class HostComponent {
  src: string;
}

describe('SvgIconComponent', () => {
  let componentUnderTest: SvgIconComponent;
  let hostComponent: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  let svgRegistryMock: SvgRegistryService;
  let loggerServiceMock: LoggerService;

  const fakeIconSrc = 'fakeSrc';
  const fakeSvgElement = document.createElement('svg');

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HostComponent, SvgIconComponent],
        providers: [
          { provide: SvgRegistryService, useValue: {} },
          { provide: LoggerService, useValue: {} },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    componentUnderTest = fixture.debugElement.query(By.directive(SvgIconComponent)).componentInstance;
    loggerServiceMock = TestBed.inject(LoggerService);
    svgRegistryMock = TestBed.inject(SvgRegistryService);
    svgRegistryMock.getRequiredSvgElement = jasmine.createSpy('getRequiredSvgElement').and.returnValue(fakeSvgElement);
    loggerServiceMock.error = jasmine.createSpy('error');
  });

  function getSvgIconComponentNativeElement(): HTMLElement {
    return fixture.debugElement.query(By.directive(SvgIconComponent)).nativeElement;
  }

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  describe('src input provided', () => {
    beforeEach(() => {
      hostComponent.src = fakeIconSrc;
    });

    it('should call getRequiredSvgElement with provided src', () => {
      // Arrange
      // Act
      fixture.detectChanges();

      // Assert
      expect(svgRegistryMock.getRequiredSvgElement).toHaveBeenCalledWith(fakeIconSrc);
    });

    it('should insert obtained svg element into host element', () => {
      // Arrange
      // Act
      fixture.detectChanges();

      // Assert
      expect(getSvgIconComponentNativeElement().childNodes.item(0)).toBe(fakeSvgElement);
    });

    describe('and then falsy value is written into src', () => {
      beforeEach(() => {
        fixture.detectChanges();
        hostComponent.src = undefined;
      });

      it('should set empty string for SvgIconComponent native element', () => {
        // Arrange
        // Act
        fixture.detectChanges();

        // Assert
        expect(getSvgIconComponentNativeElement().innerHTML).toBe('');
      });
    });
  });

  describe('an error occures in getRequiredSvgElement', () => {
    let expectedError: Error;

    beforeEach(() => {
      expectedError = new Error('fake error');
      hostComponent.src = 'any';
      svgRegistryMock.getRequiredSvgElement = jasmine.createSpy('getRequiredSvgElement').and.throwError(expectedError);
    });

    it('should call loggerService.error with thrown error', () => {
      // Arrange
      // Act
      fixture.detectChanges();

      // Assert
      expect(loggerServiceMock.error).toHaveBeenCalledWith(expectedError);
    });

    it('should set empty string for SvgIconComponent native element.', () => {
      // Arrange
      // Act
      fixture.detectChanges();

      // Assert
      expect(getSvgIconComponentNativeElement().innerHTML).toBe('');
    });
  });
});
