import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SvgRegistryService } from 'core/modules/svg-icons';
import { fromEvent } from 'rxjs';

function groupBy<T, R>(array: T[], selector: (item: T) => R): { key: R; values: T[] }[] {
  return array.reduce((objectsByKeyValue: any[], obj) => {
    const key = selector(obj);
    let group = objectsByKeyValue.find((t) => t.key === key);

    if (!group) {
      group = { key };
      objectsByKeyValue.push(group);
    }

    group.values = (group.values || []).concat([obj]);

    return objectsByKeyValue;
  }, []);
}

interface IconGroup {
  folder: string;
  iconPaths: string[];
}

@Component({
  selector: 'app-icons-view',
  templateUrl: './icons-view.component.html',
  styleUrls: ['./icons-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconsViewComponent implements OnInit {
  @ViewChild('colorPicker', { static: true })
  private colorPicker: ElementRef<HTMLInputElement>;
  private defaultBackgroundColor = '#ffffff';

  icons: IconGroup[];
  iconBackground: string;

  constructor(private host: ElementRef<HTMLElement>, private svgRegistryService: SvgRegistryService) {}

  ngOnInit(): void {
    this.icons = this.getIcons();
    this.colorPicker.nativeElement.value = this.defaultBackgroundColor;
    fromEvent(this.colorPicker.nativeElement, 'change').subscribe(() =>
      this.setIconBackground(this.colorPicker.nativeElement.value)
    );
  }

  createCopyIconPathText(iconPath: string): string {
    return `Click to copy ${iconPath} icon path into clipboard`;
  }

  createOpenInNewTabText(): string {
    return `Click to open in a new tab`;
  }

  setDefaultBackground(): void {
    this.colorPicker.nativeElement.value = this.defaultBackgroundColor;
    this.setIconBackground(this.defaultBackgroundColor);
  }

  copyToClipboard(iconPath: string): void {
    navigator.clipboard.writeText(iconPath);
  }

  private getIcons(): IconGroup[] {
    const icons: string[] = this.svgRegistryService.getAllIconRelativePaths();
    return groupBy(icons, (path) => path.substr(0, path.lastIndexOf('/'))).map((group) => ({
      folder: group.key,
      iconPaths: group.values,
    }));
  }

  private setIconBackground(val: string): void {
    this.iconBackground = val;
  }
}
