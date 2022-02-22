import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DelegationItem, translationRootKey } from '../../models';

@Component({
  selector: 'app-delegation-item',
  templateUrl: './delegation-item.component.html',
})
export class DelegationItemComponent {

  @Input() item: DelegationItem;
  @Output() contact = new EventEmitter();

  buildTranslationKey(key: string): string {
    return `${translationRootKey}.${key}`;
  }

}
