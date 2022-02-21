import { Component, Input, HostBinding, ElementRef, ViewChild, HostListener, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

/**
 * @deprecated Use just button tag from ButtonsModule with [type]="..." attribute instead.
 */
@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
// It defines all common behaviors/styles in the app so that we won't smear
// behaviors / styles in each component that requires the use of buttons.
export class ButtonComponent {
  @ViewChild('contentContainer')
  private contentContainer: ElementRef<HTMLElement>;

  @HostBinding('class.content-exist')
  private get contentExists(): boolean {
    return this.contentContainer && !!this.contentContainer.nativeElement.childNodes.length;
  }

  @HostBinding('class.loading')
  @Input()
  loading: boolean;

  @Input()
  routerLink: string;

  @Input()
  icon: string;

  @HostBinding('class.coming-soon')
  @Input()
  comingSoon: boolean;

  @HostBinding('class.exclusive-feature')
  @Input()
  exclusiveFeature: boolean;

  @Input()
  clickOnEnter: boolean;

  @HostListener('document:keydown.enter', ['$event'])
  private onEnterHandler(event: any): void {
    const buttonElement = (this.hostElement.nativeElement as HTMLElement);
    const isButtonHidden = buttonElement.offsetParent === null;
    if (this.clickOnEnter && !buttonElement.classList.contains('disabled') && !this.loading && !isButtonHidden) {
      this.hostElement.nativeElement.click();
    }
  }

  @HostListener('click', ['$event'])
  private hostClick(event: MouseEvent): void {
    if (this.routerLink) {
      this.router.navigate([this.routerLink]);
    }
  }

  constructor(private router: Router, private hostElement: ElementRef) { }
}
