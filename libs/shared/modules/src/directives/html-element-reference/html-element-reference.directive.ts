import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[htmlElementRef]',
  exportAs: 'htmlElementRef',
})
/**
 * This directive helps to get html element instead of component instance (kinda custom reference variable)
 */
export class HtmlElementReferenceDirective {
  public readonly htmlElement: HTMLElement;

  constructor(elementRef: ElementRef) {
    this.htmlElement = elementRef.nativeElement;
  }
}
