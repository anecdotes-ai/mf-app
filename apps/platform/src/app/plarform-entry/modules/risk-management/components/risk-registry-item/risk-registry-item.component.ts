import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-risk-registry-item',
  templateUrl: './risk-registry-item.component.html',
})
export class RiskRegistryItemComponent {
  @HostBinding('class')
  private classes = `relative flex flex-col rounded-xl px-4 py-3.5 max-h-18 max-w-27 justify-content-center align-items-center font-main text-center`;

  @Input()
  text: string;

  @Input()
  value: number | string;

  @HostBinding('class.bg-navy-20')
  @Input()
  isHeader: boolean;
}
