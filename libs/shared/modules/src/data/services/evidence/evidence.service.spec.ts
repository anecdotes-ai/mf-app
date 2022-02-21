import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfigurationFile } from 'core';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppConfigService } from 'core/services';
import { EvidenceService } from './evidence.service';
import { SvgRegistryService } from 'core/modules/svg-icons';

describe('EvidenceService', () => {
  let service: EvidenceService;
  let appConfigMock: AppConfigService;

  let fakeConfig: ConfigurationFile;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EvidenceService, { provide: SvgRegistryService, useValue: {}}, { provide: AppConfigService, useValue: {} }],
    });
    service = TestBed.inject(EvidenceService);
    appConfigMock = TestBed.inject(AppConfigService);
    fakeConfig = {
      api: {
        baseUrl: 'fake-base-url',
        endpoints: {},
      },
    } as ConfigurationFile;
    (appConfigMock as any).config = fakeConfig;
    http = TestBed.inject(HttpClient);
  });

  it('should be able to create service instance', () => {
    expect(service).toBeDefined();
  });

  describe('downloadEvidence', () => {
    const endpoint = 'fake-download-evidence';
    const fakeEvidenceInstanceId = 'fakeEvidenceInstanceId';
    let fileNamePart: string;

    function getFakeResponse(): HttpResponse<Blob> {
      return new HttpResponse({
        headers: new HttpHeaders({
          'content-disposition': `attachment; filename=${fileNamePart}`,
        }),
      });
    }

    beforeEach(() => {
      fakeConfig.api.endpoints.downloadEvidence = endpoint;
      spyOn(http, 'get').and.callFake(() => of(getFakeResponse()) as any);
    });

    it('should return file with filename got from content-disposition header', async () => {
      // Arrange
      fileNamePart = 'fakeFile.txt';

      // Act
      const actualFile = await service.downloadEvidence(fakeEvidenceInstanceId).pipe(take(1)).toPromise();

      // Assert
      expect(actualFile.name).toEqual(fileNamePart);
    });

    it('should return file with file name got from content-disposition header when filename enclosed in quotes', async () => {
      // Arrange
      const fileName = 'fake file.txt';
      fileNamePart = `"${fileName}"`;

      // Act
      const actualFile = await service.downloadEvidence(fakeEvidenceInstanceId).pipe(take(1)).toPromise();

      // Assert
      expect(actualFile.name).toEqual(fileName);
    });
  });
});
