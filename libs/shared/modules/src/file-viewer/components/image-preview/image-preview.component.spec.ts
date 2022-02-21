import { SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { ImagePreviewComponent } from './image-preview.component';

describe('ImagePreviewComponent', () => {
  configureTestSuite();

  let component: ImagePreviewComponent;
  let fixture: ComponentFixture<ImagePreviewComponent>;

  const mockFileReader = {
    result: '',
    readAsDataURL: () => {},
    onloadend: () => {},
  };

  const previewSrcResult = 'some-url-result';

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImagePreviewComponent],
      providers: [
        {
          provide: DomSanitizer,
          useValue: {
            sanitize: (ctx: any, val: string) => val,
            bypassSecurityTrustUrl: (val: string) => val,
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagePreviewComponent);
    component = fixture.componentInstance;

    spyOn(window, 'FileReader').and.returnValue((mockFileReader as unknown) as FileReader);
    spyOn(mockFileReader, 'readAsDataURL').and.callFake(() => {
      mockFileReader.result = previewSrcResult;
      mockFileReader.onloadend();
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnChanges', () => {
    it('should set previewSrc to result of fileReader.readAsDataURL', () => {
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
});
