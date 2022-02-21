import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef, Input,
  OnDestroy,
  ViewChild
} from '@angular/core';
import createWebViewer, { CoreControls } from '@pdftron/webviewer';
import { SubscriptionDetacher } from 'core/utils';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-office-preview',
  templateUrl: './office-preview.component.html',
  styleUrls: ['./office-preview.component.scss'],
})
export class OfficePreviewComponent implements OnDestroy, AfterViewInit {
  private docViewer: CoreControls.DocumentViewer;
  private subscriptionDetacher = new SubscriptionDetacher();

  @Input()
  file: File;

  @Input()
  useScroll = false;

  @ViewChild('viewer', { static: true })
  private viewer: ElementRef;

  @Input()
  usePagination: boolean;

  isLoading = true;
  documentHeight: number;
  pageCount: number;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this.subscriptionDetacher.detach();
  }

  async ngAfterViewInit(): Promise<void> {
    const webViewerInstance = await createWebViewer(
      {
        path: 'assets/webviewer',
        css:
          this.useScroll && !this.usePagination
            ? '/assets/webviewer-styles/webviewer-scroll-styles.css'
            : '/assets/webviewer-styles/webviewer-noscroll-styles.css',
        enableAnnotations: false,
        isReadOnly: true,
        preloadWorker: 'office',
        disableLogs: true,
        disabledElements: ['header', 'pageNavOverlay', 'progressModal'],
        licenseKey: environment.config.pdfTron.licenseKey,
      },
      this.viewer.nativeElement
    );

    webViewerInstance.loadDocument(this.file, { filename: this.file.name });

    if (this.usePagination) {
      webViewerInstance.disableFeatures([webViewerInstance.Feature.PageNavigation]);
    }

    const docViewer = webViewerInstance.docViewer;
    this.docViewer = docViewer;
    const FitMode = webViewerInstance.FitMode;

    docViewer.on('documentLoaded', () => {
      webViewerInstance.setFitMode(FitMode.FitWidth);

      if (this.usePagination) {
        webViewerInstance.setLayoutMode(webViewerInstance.LayoutMode.Single);
      }
    });

    this.getFinishedRenderingEvent()
      .pipe(this.subscriptionDetacher.takeUntilDetach())
      .subscribe(() => {
        if (this.usePagination) {
          this.documentHeight = this.viewer.nativeElement
            .getElementsByTagName('iframe')[0]
            ?.contentWindow.document.getElementsByClassName('document')[0].offsetHeight;
        }

        this.pageCount = docViewer.getPageCount();
        this.isLoading = false;
        this.cd.detectChanges();
      });
  }

  setPage(page: number): void {
    this.docViewer.setCurrentPage(page);
  }

  private getFinishedRenderingEvent(): Observable<any> {
    return new Observable((observer) => {
      this.docViewer.on('finishedRendering', () => {
        observer.next();
      });
    }).pipe(debounceTime(500));
  }
}
