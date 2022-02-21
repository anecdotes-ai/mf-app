import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, HostListener, Input } from '@angular/core';
import { ButtonType, ButtonSize, ButtonVerticalSize } from '../../types';

@Component({
  selector: 'app-new-button', // this has such selecto until we remove the old app-button
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// It defines all common behaviors/styles in the app so that we won't smear
// behaviors / styles in each component that requires the use of buttons.
export class ButtonNewComponent {
  @HostBinding('class.loading')
  @Input()
  loading: boolean;

  @Input()
  svgIconPath: string;

  @HostBinding('attr.type')
  @Input()
  type: ButtonType = 'primary';

  @Input()
  size: ButtonSize = 'medium';

  @Input()
  verticalSize: ButtonVerticalSize = 'medium';

  @Input()
  clickOnEnter: boolean;

  @HostBinding('class.disabled')
  @Input()
  disabled: boolean;

  @HostBinding('class.focused')
  @Input()
  focused: boolean;

  @HostBinding('attr.role')
  private role = 'button';

  @HostBinding('class')
  private get classes(): string {
    return `btn ${this.size} vs-${this.verticalSize}`;
  }

  @HostListener('document:keydown.enter', ['$event'])
  private onEnterHandler(event: any): void {
    const buttonElement = (this.hostElement.nativeElement as HTMLElement);
    const isButtonHidden = buttonElement.offsetParent === null;
    if (this.clickOnEnter && !buttonElement.classList.contains('disabled') && !this.loading && !isButtonHidden) {
      this.hostElement.nativeElement.click();
    }
  }

  constructor(private hostElement: ElementRef) { }
}
