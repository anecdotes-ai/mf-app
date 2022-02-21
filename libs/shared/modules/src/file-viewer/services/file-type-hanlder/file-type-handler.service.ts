import { Injectable } from '@angular/core';
import { FileTypeEnum } from '../../models';

const supportedExtensionsDictionary = {
  jpg: FileTypeEnum.Image,
  png: FileTypeEnum.Image,
  pdf: FileTypeEnum.PDF,
  csv: FileTypeEnum.CSV,
  docx: FileTypeEnum.Office,
  // doc: FileTypeEnum.Office, // commented until we support this,
  xlsx: FileTypeEnum.Office,
  // ppt: FileTypeEnum.Office, // commented until we support this,
  pptx: FileTypeEnum.Office,
};

@Injectable()
export class FileTypeHandlerService {
  isFileSupported(fileName: string): boolean {
    return !!this.getFileType(fileName);
  }

  getFileType(fileName: string): FileTypeEnum {
    const dotLastIndex = fileName.lastIndexOf('.');
    const extension = dotLastIndex >= 0 ? fileName.substring(dotLastIndex + 1) : fileName;

    return supportedExtensionsDictionary[extension.toLowerCase()];
  }
}
