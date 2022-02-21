import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FileTypeEnum } from '../../models';
import { FileTypeHandlerService } from '../../services';

@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FileTypeHandlerService]
})
export class FileViewerComponent {
  @Input()
  file: File;

  @Input()
  useScroll: boolean;

  @Input()
  usePagination: boolean;

  fileTypeEnum = FileTypeEnum;

  constructor(private fileTypeHandler: FileTypeHandlerService) {}

  getFileType(): FileTypeEnum {
    return this.fileTypeHandler.getFileType(this.file.name);
  }
}
