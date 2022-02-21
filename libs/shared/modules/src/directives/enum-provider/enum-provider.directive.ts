import { TipTypeEnum } from 'core/models/tip.model';
import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[enumProvider]',
  exportAs: 'enumProviderEnum'
})
export class EnumProviderDirective {

  tipTypeEnum: TipTypeEnum;

  constructor(private vcRef: ViewContainerRef, private templateRef: TemplateRef<any>) {}

}
