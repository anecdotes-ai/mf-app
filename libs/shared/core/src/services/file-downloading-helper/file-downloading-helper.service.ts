import { Injectable } from '@angular/core';

@Injectable()
export class FileDownloadingHelperService {
  downloadFile(file: File, overrideFileName: string = null): void {
    // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
    const blobUrl = URL.createObjectURL(file);

    this.download(blobUrl, overrideFileName ?? file.name);
  }

  downloadBlob(blob: Blob, fileName: string): void {
    // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
    const blobUrl = URL.createObjectURL(blob);

    this.download(blobUrl, fileName);
  }

  downloadFileByUrl(url: string, fileName?: string): void {
    this.download(url, fileName);
  }

  private download(url: string, fileName: string): void {
    // Found this trick here https://dev.to/nombrekeff/download-file-from-blob-21ho

    // Create a link element
    const link = document.createElement('a');

    // Set link's href to point to the Blob URL
    link.href = url;

    if (fileName) {
      link.download =
        fileName.startsWith('"') && fileName.endsWith('"') ? fileName.substring(1, fileName.length - 1) : fileName;
    }

    // Append link to the body
    document.body.appendChild(link);

    // Dispatch click event on the link
    // This is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window.parent,
      })
    );

    // Remove link from body
    document.body.removeChild(link);
  }
}
