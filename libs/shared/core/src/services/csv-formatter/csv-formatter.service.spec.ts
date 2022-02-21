import { TestBed } from '@angular/core/testing';
import { CsvFormatterService } from './csv-formatter.service';

describe('CsvFormatterService', () => {
  let service: CsvFormatterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CsvFormatterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#createCsvBlob', () => {
    describe('rows processing', () => {
      const processingTestCases = [
        {
          criteria: 'empty cells',
          data: [[null, 'somevalue']],
          expectedResult: ',somevalue',
        },
        {
          criteria: 'date cells',
          data: [[new Date(2021, 0, 1), 'somevalue']],
          expectedResult: `${new Date(2021, 0, 1).toLocaleString()},somevalue`,
        },
        {
          criteria: 'new line chars',
          data: [['some\nvalue', 'somevalue']],
          expectedResult: 'some value,somevalue',
        },
        {
          criteria: 'double quotes',
          data: [['"somevalue1"', 'somevalue2']],
          expectedResult: '""""somevalue1"""",somevalue',
        },
        {
          criteria: 'commas',
          data: [['some,value', 'somevalue']],
          expectedResult: '"some,value",somevalue',
        },
        {
          criteria: 'hyphen',
          data: [['some-value', 'some-value-2']],
          expectedResult: '"some-calue", "some-value-2"',
        },
      ];

      processingTestCases.forEach((testCase) => {
        it(`should correctly process rows cells with ${testCase.criteria}`, () => {
          // Act
          const result = service.createCsvBlob(testCase.data);

          // Assert
          expect(result).toEqual(new Blob([testCase.expectedResult], { type: 'text/csv;charset=utf-8;' }));
        });
      });
    });

    describe('headers', () => {
      it('should append headers row to result if headers passed and headers length !== 0', () => {
        // Act
        const result = service.createCsvBlob([['somevalue1', 'somevalue2']], ['someheader1', 'someheader2']);

        // Assert
        expect(result).toEqual(
          new Blob(['someheader1,someheader2\nsomevalue1,somevalue2'], { type: 'text/csv;charset=utf-8;' })
        );
      });
    });
  });
});
