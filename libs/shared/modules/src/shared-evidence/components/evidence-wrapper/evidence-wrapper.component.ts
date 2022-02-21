import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-evidence-wrapper',
  templateUrl: './evidence-wrapper.component.html',
})
export class EvidenceWrapperComponent {
  @HostBinding('class')
  private get classes(): string {
    let classes = 'flex items-center h-16 w-full bg-white px-5';

    if (this.bordered) {
      classes += ` border border-solid border-navy-40 rounded-md`;
    }

    return classes;
  }

  @Input()
  bordered: boolean;
}
