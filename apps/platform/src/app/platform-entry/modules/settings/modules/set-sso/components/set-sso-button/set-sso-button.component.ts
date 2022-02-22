import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { SelectedItemToSetSSO, translationRootKey } from '../../models';

@Component({
  selector: 'app-set-sso-button',
  templateUrl: './set-sso-button.component.html',
  styleUrls: ['./set-sso-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SetSsoButtonComponent {
  @HostBinding('class')
  private classes = 'flex flex-row justify-between border border-navy-70 border-opacity-50 hover:border-opacity-100 rounded-md px-5 bg-navy-10 hover:bg-white cursor-pointer';
  
  @HostBinding('class.pointer-events-none')
  @HostBinding('class.opacity-70')
  @HostBinding('class.shadow-none')
  get isComingSoon(): boolean {
    return this.samlItem.comingSoon;
  }

  get isConnected(): boolean {
    return !!this.samlItem.link;
  }

  @Input()
  samlItem: SelectedItemToSetSSO;

  @Output()
  setClick = new EventEmitter();

  @Output()
  editClick = new EventEmitter();

  buildTranslationKey(key: string): string {
    return `${translationRootKey}.${key}`;
  }

  @HostListener('click')
  private onClick(): void {
    if(this.isConnected) {
      this.editClick.emit();
    } else {
      this.setClick.emit();
    }
  }
}
