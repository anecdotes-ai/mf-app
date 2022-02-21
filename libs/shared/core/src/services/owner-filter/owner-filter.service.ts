import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'core/modules/auth-core/models/domain';
import { FilterDefinition } from 'core/modules/data-manipulation/data-filter';

@Injectable({
  providedIn: 'root',
})
export class OwnerFilterService {
  constructor(private translateService: TranslateService) {}

  getOwnerFilterDefinition<T>(users: User[], currentUserName: string, ownerField: string, headerTranslationKey: string): FilterDefinition<T> {
    return {
      translationKey: headerTranslationKey,
      fieldId: 'owner',
      propertySelector: (c) => {
        const owner = users.find((user) => user.email === c[ownerField]);
        return owner ? `${owner?.first_name} ${owner?.last_name}` : '';
      },
      displayed: true,
      expanded: false,
      useSort: true,
      fixedOptions: [
        {
          optionId: 'noOwner',
          value: '',
          translationKey: 'controls.owner.noOwner',
        },
        {
          optionId: 'me',
          value: currentUserName,
          translationKey: `${currentUserName} ${this.translateService.instant('controls.owner.me')}`,
        },
      ],
      customSortCallback: (a: string, b: string) => {
        if (!a) {
          return -1;
        } else if (!b) {
          return 1;
        } else if (a === currentUserName) {
          return -1;
        } else if (b === currentUserName) {
          return 1;
        }
        return a.localeCompare(b);
      },
    };
  }
}
