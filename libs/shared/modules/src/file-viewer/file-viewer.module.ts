import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FileTypeHandlerService } from './services';
import { LoadersModule } from 'core/modules/loaders';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import {
  FileViewerComponent,
  CsvPreviewComponent,
  OfficePreviewComponent,
  PdfPreviewComponent,
  ImagePreviewComponent,
} from './components';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SvgIconsModule } from 'core/modules/svg-icons';


@NgModule({
  imports: [
    CommonModule, 
    PdfViewerModule, 
    LoadersModule, 
    VirtualScrollerModule, 
    NgbPaginationModule, 
    SvgIconsModule,
  ],
  declarations: [
    FileViewerComponent,
    CsvPreviewComponent,
    OfficePreviewComponent,
    PdfPreviewComponent,
    ImagePreviewComponent,
  ],
  exports: [FileViewerComponent],
  providers: [FileTypeHandlerService],
})
export class FileViewerModule {}
