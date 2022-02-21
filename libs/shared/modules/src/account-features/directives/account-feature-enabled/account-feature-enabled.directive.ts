import {
  Directive,
  EmbeddedViewRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AccountFeatureEnum } from 'core/modules/data/models/domain';
import { SubscriptionDetacher } from 'core/utils';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AccountFeaturesService } from '../../services';

@Directive({
  selector: '[isAccountFeatureEnabled]',
})
export class AccountFeatureEnabledDirective implements OnInit, OnChanges, OnDestroy {
  private accountFeatureSubject = new BehaviorSubject<AccountFeatureEnum>(null);
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @Input()
  isAccountFeatureEnabled: AccountFeatureEnum;

  @Input()
  isAccountFeatureEnabledElse: TemplateRef<any>;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private accountFeaturesService: AccountFeaturesService
  ) {}

  ngOnInit(): void {
    this.accountFeatureSubject
      .pipe(
        switchMap((feature) => this.accountFeaturesService.doesAccountHaveFeature(feature)),
        this.detacher.takeUntilDetach()
      )
      .subscribe((isAccountFeatureEnabled) => {
        this.viewContainerRef.clear();
        let embeddedView: EmbeddedViewRef<any>;

        if (isAccountFeatureEnabled) {
          embeddedView = this.viewContainerRef.createEmbeddedView(this.templateRef);
        } else if (this.isAccountFeatureEnabledElse) {
          embeddedView = this.viewContainerRef.createEmbeddedView(this.isAccountFeatureEnabledElse);
        }

        embeddedView?.detectChanges();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('isAccountFeatureEnabled' in changes) {
      this.accountFeatureSubject.next(this.isAccountFeatureEnabled);
    }
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }
}
