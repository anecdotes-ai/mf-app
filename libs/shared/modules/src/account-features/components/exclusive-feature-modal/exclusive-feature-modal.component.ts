import { Component, OnDestroy, OnInit } from '@angular/core';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { IntercomService } from 'core/services';
import { SubscriptionDetacher } from 'core/utils';
import { AccountFeatureEnum } from 'core/modules/data/models/domain';

@Component({
  selector: 'app-exclusive-feature-modal',
  templateUrl: './exclusive-feature-modal.component.html',
  styleUrls: ['./exclusive-feature-modal.component.scss'],
})
export class ExclusiveFeatureModalComponent implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();
  private accountFeature: AccountFeatureEnum;

  relativeTitleKey: string;
  icon: string;

  constructor(private intercom: IntercomService, private switcher: ComponentSwitcherDirective) {}

  ngOnInit(): void {
    this.switcher.sharedContext$
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((context: { feature: AccountFeatureEnum }) => {
        this.accountFeature = context.feature;
        this.buildIcon();
        this.buildRelativeTitleKey();
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(relativeKey: string): string {
    return `core.exclusiveFeatureModal.${relativeKey}`;
  }

  contactUs(): void {
    this.intercom.showNewMessage();
  }

  private buildRelativeTitleKey(): void {
    const suffix = this.accountFeature.replace(' ', '');
    this.relativeTitleKey = `exclusive${suffix}`;
  }

  private buildIcon(): void {
    switch (this.accountFeature) {
      case AccountFeatureEnum.AdoptFramework:
        this.icon = 'exclusive-framework';
        break;
      case AccountFeatureEnum.PolicyTemplates:
      case AccountFeatureEnum.ExportControls:
        this.icon = 'exclusive-documents';
        break;
      default:
        break;
    }
  }
}
