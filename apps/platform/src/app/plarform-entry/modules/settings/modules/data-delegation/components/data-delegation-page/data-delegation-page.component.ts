import { Component } from '@angular/core';
import { IntercomService } from 'core';
import { BehaviorSubject } from 'rxjs';
import { DelegationItem, translationRootKey } from '../../models';

@Component({
  selector: 'app-data-delegation-page',
  templateUrl: './data-delegation-page.component.html',
  styleUrls: ['./data-delegation-page.component.scss']
})
export class DataDelegationPageComponent {
  items: DelegationItem[] = [
    {displayName: "Snowflake", category: ["Metadata"], service: "snowflake"} as DelegationItem,
    {displayName: "GCP", category: ["Raw data", "Secrets"], service: "gcp"} as DelegationItem,
    {displayName: "AWS", category: ["Raw data", "Secrets"], service: "aws"} as DelegationItem
  ]

  loading$ = new BehaviorSubject<boolean>(undefined);

  constructor(private intercom: IntercomService /*private slack: SlackService */) { }

  buildTranslationKey(relativeKey: string): string {
    return `${translationRootKey}.${relativeKey}`;
  }

  getSections(): string[] {
    let s = new Set(this.items.map(i => i.category).reduce((p,v) => p.concat(v)));
    return Array.from(s.values());
  }
  
  getSectionItems(section: string): DelegationItem[] {
    return this.items.filter(i => i.category.includes(section));
  }

  showIntercomMessage(): void {
    this.intercom.showNewMessage();
  }

}
