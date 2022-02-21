/* tslint:disable:no-unused-variable */

import { ElementRef } from '@angular/core';
import { HtmlElementReferenceDirective } from './html-element-reference.directive';

describe('Directive: HtmlElementReference', () => {
  it('should create an instance', () => {
    // Arrange
    const fakeElementRef: ElementRef = { nativeElement: {} };

    // Act
    const directive = new HtmlElementReferenceDirective(fakeElementRef);

    // Assert
    expect(directive).toBeTruthy();
  });

  describe('htmlElement property', () => {
    it('should return nativeElement from ElementRef', () => {
      // Arrange
      const fakeElementRef: ElementRef = { nativeElement: {} };

      // Act
      const directive = new HtmlElementReferenceDirective(fakeElementRef);

      // Assert
      expect(directive.htmlElement).toBe(fakeElementRef.nativeElement);
    });
  });
});
