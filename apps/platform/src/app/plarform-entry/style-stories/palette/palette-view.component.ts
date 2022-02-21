import { Component, Input } from '@angular/core';

export interface ColorFamily {
  name: string;
  colors: Color[];
}

export interface Color {
  backgroundClass: string;
  fontColorClass: string;
  variable: string;
}

@Component({
  selector: 'app-palette-view',
  templateUrl: './palette-view.component.html',
  styleUrls: ['./palette-view.component.scss'],
})
export class PaletteViewComponent {
  @Input()
  colors: Color[];

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);
  }

  createClickToCopyClassText(klass: string): string {
    return `Click to copy ${klass} class into clipboard`;
  }

  createClickToCopyVariableText(variable: string): string {
    return `Click to copy ${variable} variable into clipboard`;
  }

  getHexBackgroundColor(el: HTMLElement): string {
    let color = window.getComputedStyle(el).backgroundColor;
    color = color.replace(/\s/g, '');

    const aRGB = color.match(/^rgb\((\d{1,3}[%]?),(\d{1,3}[%]?),(\d{1,3}[%]?)\)$/i);

    if (aRGB) {
      color = '';

      for (let i = 1; i <= 3; i++)
        color += Math.round((aRGB[i][aRGB[i].length - 1] == '%' ? 2.55 : 1) * parseInt(aRGB[i]))
          .toString(16)
          .replace(/^(.)$/, '0$1');
    } else color = color.replace(/^#?([\da-f])([\da-f])([\da-f])$/i, '$1$1$2$2$3$3');

    return `#${color}`;
  }
}
