/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { FileTypeEnum } from '../../models';
import { FileTypeHandlerService } from './file-type-handler.service';

describe('Service: FileTypeHandler', () => {
  let serviceUnderTests: FileTypeHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FileTypeHandlerService],
    });
  });

  beforeEach(() => {
    serviceUnderTests = TestBed.inject(FileTypeHandlerService);
  });

  [
    { extension: 'jPg', expectedFileType: FileTypeEnum.Image },
    { extension: 'Png', expectedFileType: FileTypeEnum.Image },
    { extension: 'pdF', expectedFileType: FileTypeEnum.PDF },
    { extension: 'xlSx', expectedFileType: FileTypeEnum.Office },
    { extension: 'docX', expectedFileType: FileTypeEnum.Office },
    { extension: 'PPtx', expectedFileType: FileTypeEnum.Office },
    { extension: 'csv', expectedFileType: FileTypeEnum.CSV },
    { extension: undefined, expectedFileType: undefined },
    { extension: 'randomnotsupportedextension', expectedFileType: undefined },
  ].forEach((testCase) => {
    describe('getFileType()', () => {
      it(`should return "${testCase.expectedFileType}" file type for "${testCase.extension}" extension`, () => {
        // Arrange
        let fakeFileName = `file.${testCase.extension}`;

        // Act
        const actualFileType = serviceUnderTests.getFileType(fakeFileName);

        // Assert
        expect(actualFileType).toBe(testCase.expectedFileType);
      });
    });

    describe('isFileSupported()', () => {
      it(`should return "${!!testCase.expectedFileType}" for "${testCase.extension}"`, () => {
        // Arrange
        let fakeFileName = `file.${testCase.extension}`;

        // Act
        const actual = serviceUnderTests.isFileSupported(fakeFileName);

        // Assert
        expect(actual).toBe(!!testCase.expectedFileType);
      });
    });
  });
});
