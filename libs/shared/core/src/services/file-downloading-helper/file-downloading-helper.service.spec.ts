/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FileDownloadingHelperService } from './file-downloading-helper.service';

describe('Service: FileDownloadingHelper', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileDownloadingHelperService],
    });
  });

  it('should ...', inject([FileDownloadingHelperService], (service: FileDownloadingHelperService) => {
    expect(service).toBeTruthy();
  }));
});
