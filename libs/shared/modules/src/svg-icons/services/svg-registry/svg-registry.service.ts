import { Inject, Injectable } from '@angular/core';
import { SvgLoaderService } from '../svg-loader/svg-loader.service';
import { DOCUMENT } from '@angular/common';

const defsPropertyKey = 'defsElement';

@Injectable()
export class SvgRegistryService {
  private get defsElement(): HTMLElement {
    return this.document[defsPropertyKey];
  }

  private registry: { [key: string]: SVGSVGElement } = {};

  constructor(private svgLoader: SvgLoaderService, @Inject(DOCUMENT) private document: Document) {}

  /** Initializes registry by loading svg sprite from SvgLoaderService */
  async initAsync(): Promise<void> {
    const sprite = await this.svgLoader.getSprite().toPromise();
    const defsElement = this.document.createElement('defs');
    defsElement.innerHTML = sprite;
    this.document[defsPropertyKey] = defsElement;
  }

  /** Throws error in case an unknown relativePath provided */
  getRequiredSvgElement(relativePath: string): SVGSVGElement {
    const iconFromRegistry = this.getSvgElement(relativePath);

    if (!iconFromRegistry) {
      throw new Error(`Icon with the relative path "${relativePath}" does not exist`);
    }

    return iconFromRegistry;
  }

  /** Returns svg element for provided relativePath */
  getSvgElement(relativePath: string): SVGSVGElement {
    const svgElement = this.getOrAddIconToRegistry(relativePath)?.cloneNode(true) as SVGSVGElement;
    return svgElement || null;
  }

  /** Returns svg element string representation (<svg>...</svg>) for provided relativePath */
  getSvgElementString(relativePath: string): string {
    const svgElementString = this.getOrAddIconToRegistry(relativePath)?.outerHTML;
    return svgElementString || null;
  }

  /** Returns value indicating whether an icon by the provided relativePath exists */
  doesIconExist(relativePath: string): boolean {
    return !!this.registry[relativePath] || !!this.getOrAddIconToRegistry(relativePath);
  }

  /** Returns all possible icon relative paths */
  getAllIconRelativePaths(): string[] {
    return Array.from(this.defsElement.querySelector('svg').childNodes)
      .filter((element: HTMLElement) => element.tagName === 'svg')
      .map((element: HTMLElement) => {
        return this.convertIdToRelativePath(element.id);
      });
  }

  private getOrAddIconToRegistry(src: string): SVGSVGElement {
    if (!this.registry[src]) {
      const iconFromDefs = this.defsElement.querySelector(`svg#${this.convertRelativePathToId(src)}`) as SVGSVGElement;

      if (iconFromDefs) {
        this.registry[src] = iconFromDefs;
      } else {
        return null;
      }
    }

    return this.registry[src];
  }

  private convertIdToRelativePath(id: string): string {
    return id.split('--').join('/');
  }

  private convertRelativePathToId(relativePath: string): string {
    return relativePath.split('/').join('--');
  }
}
