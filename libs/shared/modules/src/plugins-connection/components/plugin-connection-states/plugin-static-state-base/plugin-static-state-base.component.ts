import { BehaviorSubject, Observable } from 'rxjs';
import { SubscriptionDetacher } from 'core/utils';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import {
  PluginConnectionStaticStateSharedContext,
  PluginStaticStateSharedContextInputKeys,
  PluginStaticStateInputsToTypesMapping,
  PluginStaticBaseStateInputKeys,
  PluginStaticBaseStateInputKeysEnum
} from '../../../models/plugin-static-content.model';
import { Service } from 'core/modules/data/models/domain';

@Component({
  selector: 'app-plugin-static-state-base',
  template: '',
})
export abstract class PluginStaticStateBaseComponent implements OnInit, OnChanges {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();  
  private _serviceEntityIncoming$ = new BehaviorSubject<Service>(undefined);

  abstract get footerDisplayed(): boolean;
  abstract get headerDisplayed(): boolean;

  switcherContextData: PluginConnectionStaticStateSharedContext;

  get serviceEntityIncoming$(): Observable<Service> {
    return this._serviceEntityIncoming$;
  }

  @Input(PluginStaticBaseStateInputKeys.service)
  service: PluginStaticStateInputsToTypesMapping[PluginStaticBaseStateInputKeysEnum.service];

  @Input(PluginStaticBaseStateInputKeys.displayHeader)
  displayHeader: PluginStaticStateInputsToTypesMapping[PluginStaticBaseStateInputKeysEnum.displayHeader];

  @Input(PluginStaticBaseStateInputKeys.displayHeaderThreeDotsMenu)
  displayHeaderThreeDotsMenu: PluginStaticStateInputsToTypesMapping[PluginStaticBaseStateInputKeysEnum.displayHeaderThreeDotsMenu];

  @Input(PluginStaticBaseStateInputKeys.displayCloseButton)
  displayCloseButton: PluginStaticStateInputsToTypesMapping[PluginStaticBaseStateInputKeysEnum.displayCloseButton];

  @Input(PluginStaticBaseStateInputKeys.displayServiceTipIfExists)
  displayServiceTipIfExists: PluginStaticStateInputsToTypesMapping[PluginStaticBaseStateInputKeysEnum.displayServiceTipIfExists] = true;

  @Input(PluginStaticBaseStateInputKeys.displayFooter)
  displayFooter: PluginStaticStateInputsToTypesMapping[PluginStaticBaseStateInputKeysEnum.displayFooter];

  constructor(public switcher: ComponentSwitcherDirective, protected cd: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if ('service' in changes) {
      this._serviceEntityIncoming$.next(this.service);
    }
  }

  ngOnInit(): void {
    this.switcher.sharedContext$
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((context: PluginConnectionStaticStateSharedContext) => {
        this.service = context[PluginStaticStateSharedContextInputKeys.service];
        this._serviceEntityIncoming$.next(this.service);
        // set context to local property
        this.switcherContextData = context;
        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }
}
