import { SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { CsvPreviewComponent } from './csv-preview.component';

describe('CsvPreviewComponent', () => {
  configureTestSuite();

  let component: CsvPreviewComponent;
  let fixture: ComponentFixture<CsvPreviewComponent>;

  const mockFileReader = {
    result: '',
    readAsText: () => { },
    onloadend: () => { },
  };

  let readerResult: string;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [VirtualScrollerModule],
      declarations: [CsvPreviewComponent],
      providers: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvPreviewComponent);
    component = fixture.componentInstance;

    spyOn(window, 'FileReader').and.returnValue((mockFileReader as unknown) as FileReader);
    spyOn(mockFileReader, 'readAsText').and.callFake(() => {
      mockFileReader.result = readerResult;
      mockFileReader.onloadend();
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnChanges', () => {
    const changes: SimpleChanges = {
      file: {
        previousValue: undefined,
        firstChange: true,
        currentValue: new File([], 'name'),
        isFirstChange: () => true,
      },
    };

    [{ separator: '\r', name: '\\r' }, { separator: '\n', name: '\\n' }, { separator: '\r\n', name: '\\r\\n' }].forEach((testCase) => {
      describe(`when rows separated by '${testCase.name}'`, () => {
        it(`should set parsedRows to result of fileReader.readAsText splitted by '${testCase.name}'`, () => {
          // Arrange
          const parsedRows = ['one, two, three', 'four, five, six'];
          readerResult = parsedRows.join(testCase.separator);

          // Act
          component.ngOnChanges(changes);

          // Assert
          expect(component.parsedRows).toEqual(parsedRows.map((value, index) => ({ index, value })));
        });
      });
    });
  });
});
