import { RegularDateFormat } from 'core/constants/date';
import { SpecificSlideContent } from './../../models/specific-slide-content.model';
import {
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  AfterViewInit,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import * as html2canvas from 'html2canvas';
import { TranslateService } from '@ngx-translate/core';

const SlideSizeParameters = {
  widthPx: 1920,
  heightPx: 1080,
};

@Component({
  selector: 'app-executive-report-slide',
  templateUrl: './executive-report-slide.component.html',
  styleUrls: ['./executive-report-slide.component.scss'],
})
export class ExecutiveReportSlideComponent implements AfterViewInit {
  @Input()
  slideContent: SpecificSlideContent;

  @Input()
  lastUpdateDate: Date;
  componentRef: ComponentRef<any>;

  currentTime = new Date();
  dateFormat = RegularDateFormat;

  @ViewChild('slideContentTemplateRef', { read: ViewContainerRef }) slideContentContainer;

  constructor(
    private resolver: ComponentFactoryResolver,
    private el: ElementRef,
    private translateService: TranslateService,
    private cd: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.slideContentContainer.clear();
    const factory = this.resolver.resolveComponentFactory(this.slideContent.slideComponentType);
    this.componentRef = this.slideContentContainer.createComponent(factory);
    this.componentRef.instance.data = this.slideContent.inputData;

    this.cd.detectChanges();
  }

  buildTranslationKey(relativeKey: string): string {
    return `executiveReport.slide.${relativeKey}`;
  }

  modifyDownloadSlideContent(currentContentSelector: string, document: Document): void {
    (document.firstElementChild as HTMLElement).style.position = 'relative';
    const slideContentHostElement = document.querySelector(currentContentSelector) as HTMLElement;
    const genericSlideWrapperElement = slideContentHostElement.closest('#generic-slide-wrapper');

    // Assign sizes for container
    const genericSlideWrapperHtmlElement = genericSlideWrapperElement as HTMLElement;
    genericSlideWrapperHtmlElement.style.width = `${SlideSizeParameters.widthPx}px`;
    genericSlideWrapperHtmlElement.style.height = `${SlideSizeParameters.heightPx}px`;

    const genericSlideComponentHost = genericSlideWrapperElement.parentElement;
    genericSlideComponentHost.classList.add('screen-shot');
    slideContentHostElement.classList.add('screen-shot');

    // Hide pager if it exists
    const pagerButtons = slideContentHostElement.querySelector('#pager').querySelector('#pager-buttons');

    if (pagerButtons) {
      (pagerButtons as HTMLElement).style.display = 'none';
    }
  }

  async downloadSlide(): Promise<void> {
    const currentContentComponentSelector = (this.el.nativeElement as HTMLElement)
      .querySelector('#slide-content-wrapper')
      .firstElementChild.nodeName.toLocaleLowerCase();

    const fileName = await this.translateService
      .get(this.buildTranslationKey(this.slideContent.slideTitleTranslationKey))
      .toPromise();

    html2canvas
      .default(this.el.nativeElement, {
        onclone: this.modifyDownloadSlideContent.bind(this, currentContentComponentSelector),
        width: SlideSizeParameters.widthPx,
        height: SlideSizeParameters.heightPx,
        windowHeight: SlideSizeParameters.heightPx,
        windowWidth: SlideSizeParameters.widthPx,
        scale: 2,
        backgroundColor: '#EDF0F1',
      })
      .then((canvas: HTMLCanvasElement) => {
        // Convert the canvas to blob

        // Polyfill for ToBlob function for borwsers that don't support this functionality
        if (!HTMLCanvasElement.prototype.toBlob) {
          Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
            // tslint:disable-next-line: space-before-function-paren
            value: function (callback, type, quality): void {
              const dataURL = this.toDataURL(type, quality).split(',')[1];
              setTimeout(() => {
                const binStr = atob(dataURL);
                const len = binStr.length;
                const arr = new Uint8Array(len);

                for (let i = 0; i < len; i++) {
                  arr[i] = binStr.charCodeAt(i);
                }
                callback(new Blob([arr], { type: type || 'image/png' }));
              });
            },
          });
        }

        canvas.toBlob((blob) => {
          // To download directly on browser default 'downloads' location
          const link = document.createElement('a');
          link.download = `${fileName}.jpeg`;
          link.href = URL.createObjectURL(blob);
          link.click();
        });
      });
  }
}
