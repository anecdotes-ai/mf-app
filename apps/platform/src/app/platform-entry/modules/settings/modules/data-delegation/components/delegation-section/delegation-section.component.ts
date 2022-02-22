import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DelegationItem, translationRootKey } from '../../models';

@Component({
  selector: 'app-delegation-section',
  templateUrl: './delegation-section.component.html',
})
export class DelegationSectionComponent {
  @Input() items: DelegationItem[];
  @Input() sectionName: string;
  @Output()
  contact = new EventEmitter();
  
  buildTranslationKey(relativeKey: string): string {
    return `${translationRootKey}.sections.${relativeKey}`;
  }

}
