import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fonts-view',
  templateUrl: './fonts-view.component.html',
  styleUrls: ['./fonts-view.component.scss']
})
export class FontsViewComponent {
  text = 'A Design System is the single source of truth which groups all the elements that will allow the teams to design and develop a product.';
  actionText = 'Call to action';

  @Input()
  fontFamilyClass: string;

  @Input()
  fontSizeClasses: string[];

  @Input()
  boldClass: string;

  @Input()
  underlineClass: string;

  createClickToCopyClassText(htmlElement: HTMLElement): string {
    return `Click to copy "${htmlElement.className}" class into clipboard`;
  }

  copyToClipboard(htmlElement: HTMLElement): void {
    navigator.clipboard.writeText(htmlElement.className);
  }
}
