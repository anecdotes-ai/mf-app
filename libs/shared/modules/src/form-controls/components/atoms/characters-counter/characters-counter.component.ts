import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-characters-counter',
  templateUrl: './characters-counter.component.html',
  styleUrls: ['./characters-counter.component.scss'],
})
export class CharactersCounterComponent {
  @HostBinding('class')
  private classes = 'inline font-main text-sm text-navy-70';

  @Input()
  value: string;

  @Input()
  maxLength: number;
}
