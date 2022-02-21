import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-anecdotes-footer',
  templateUrl: './anecdotes-footer.component.html',
  styleUrls: ['./anecdotes-footer.component.scss'],
})
export class AnecdotesFooterComponent {
  @HostBinding('class.no-background')
  @Input()
  noBackground: boolean;

  buildTranslationKey(relativeKey: string): string {
    return `anecdotes-footer.${relativeKey}`;
  }
}
