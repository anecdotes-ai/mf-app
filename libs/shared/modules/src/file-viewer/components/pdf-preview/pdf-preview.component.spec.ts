import { SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PdfPreviewComponent } from './pdf-preview.component';

describe('PdfPreviewComponent', () => {
  configureTestSuite();

  let component: PdfPreviewComponent;
  let fixture: ComponentFixture<PdfPreviewComponent>;

  const mockFileReader = {
    result: null,
    readAsArrayBuffer: () => {},
    onloadend: () => {},
  };

  const previewSrcResult = new Uint8Array(10);

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [PdfViewerModule],
      declarations: [PdfPreviewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfPreviewComponent);
    component = fixture.componentInstance;

    spyOn(window, 'FileReader').and.returnValue((mockFileReader as unknown) as FileReader);
    spyOn(mockFileReader, 'readAsArrayBuffer').and.callFake(() => {
      mockFileReader.result = previewSrcResult;
      mockFileReader.onloadend();
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnChanges', () => {
    it('should set previewSrc to result of fileReader.readAsArrayBuffer', () => {
      // Arrange
      const changes: SimpleChanges = {
        file: {
          previousValue: undefined,
          firstChange: true,
          currentValue: new File([], 'name'),
          isFirstChange: () => true,
        },
      };

      // Act
      component.ngOnChanges(changes);

      // Assert
      expect(component.previewSrc).toEqual(previewSrcResult);
    });
  });

  describe('useScroll input', () => {
    it('should set use-scroll class for host when it is true', () => {
      // Arrange
      component.useScroll = true;

      // Act
      fixture.detectChanges();

      // Assert
      expect(fixture.debugElement.classes['use-scroll']).toBeTruthy();
    });

    it('should remove use-scroll class for host when it is false', () => {
      // Arrange
      component.useScroll = false;

      // Act
      fixture.detectChanges();

      // Assert
      expect(fixture.debugElement.classes['use-scroll']).toBeFalsy();
    });
  });
});
