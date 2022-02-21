import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-thread-header',
  templateUrl: './thread-header.component.html',
  styleUrls: ['./thread-header.component.scss'],
})
export class ThreadHeaderComponent {
  @HostBinding('class.bg-navy-30')
  @HostBinding('class.text-navy-90')
  private get isNotFocused(): boolean {
    return !this.focused;
  }

  @Input()
  resourceTypeDisplayName: string;

  @Input()
  resourceDisplayName: string;

  @HostBinding('class.bg-blue-90')
  @HostBinding('class.text-white')
  @Input()
  focused: boolean;
}
