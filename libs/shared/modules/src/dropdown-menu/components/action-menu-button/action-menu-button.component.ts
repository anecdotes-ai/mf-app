import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MenuPositionX, MenuPositionY } from '@angular/material/menu';
import { DropdownBaseComponent } from 'core/modules/dropdown-menu/components/dropdown-base/dropdown-base.component';
import { ButtonSize, ButtonType } from 'core/modules/buttons/types';

@Component({
  selector: 'app-action-menu-button',
  templateUrl: './action-menu-button.component.html',
  styleUrls: ['./action-menu-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionMenuButtonComponent extends DropdownBaseComponent {
  @ViewChild('menuTrigger', { read: ElementRef })
  private dropdownButton: ElementRef<HTMLElement>;

  @Input()
  icon: string;

  @Input()
  buttonTextTranslationKey: string;

  @Input()
  listWidth: 'small' | 'medium' | 'asDropdownButton' = 'small';

  @Input()
  buttonSize: ButtonSize = 'medium';

  @Input()
  type: ButtonType = 'primary';

  @Input()
  menuPositionX: MenuPositionX = 'after';

  @Input()
  menuPositionY: MenuPositionY = 'above';

  @Input()
  loading: boolean;

  @Input()
  disabled: boolean;

  get dropdownButtonWidth(): number {
    return this.dropdownButton ? this.dropdownButton.nativeElement.getBoundingClientRect().width : 0;
  }

  constructor(cd: ChangeDetectorRef) {
    super(cd);
  }
}
