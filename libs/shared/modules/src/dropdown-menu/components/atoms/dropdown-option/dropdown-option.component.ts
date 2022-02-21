import { Component, HostBinding, HostListener, Input } from '@angular/core';
import { MenuAction } from '../../../types';

@Component({
  selector: 'app-dropdown-option',
  templateUrl: './dropdown-option.component.html',
  styleUrls: ['./dropdown-option.component.scss'],
})
export class DropdownOptionComponent {
  @HostBinding('class')
  private classes = 'font-main text-base text-navy-90 flex items-center cursor-pointer hover:bg-navy-40';

  @HostBinding('class.pointer-events-none')
  @HostBinding('class.opacity-50')
  private get disabledBinding(): boolean {
    if (this.disabled) {
      return true;
    }

    if (this.menuAction) {
      return this.menuAction.disabledCondition?.call(null, this.context) || this.menuAction.disabled;
    }

    return false;
  }

  @HostBinding('class.hidden')
  private get hidden(): boolean {
    if (this.menuAction) {
      return this.menuAction.displayCondition && !this.menuAction.displayCondition(this.context);
    }

    return false;
  }

  get translationKey(): string {
    return this.menuAction?.translationKeyFactory?.call(null, this.context) || this.menuAction.translationKey;
  }

  @Input()
  menuAction: MenuAction;

  @Input()
  context: any;

  @Input()
  disabled: boolean;

  @HostBinding('class.bg-navy-30')
  @Input()
  selected: boolean;

  @HostListener('click')
  private onClick(): void {
    this.menuAction?.action?.call(null, this.context);
  }
}
