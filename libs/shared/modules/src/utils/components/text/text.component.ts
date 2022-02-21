import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

/**
 * This component breakes text by \n (line-break) into a bunch of spans.
 * It allows us to use one-line translation without breaking them down on separate strings.
 */
@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextComponent {
  @Input()
  text: string;

  @Input()
  textParameters: any;

  buildSpans(translatedText: string): string[] {
    return translatedText.split('\n');
  }
}
