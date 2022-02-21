import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as createWebViewer from '@pdftron/webviewer';
import { configureTestSuite } from 'ng-bullet';
import { environment } from 'src/environments/environment';
import { OfficePreviewComponent } from './office-preview.component';

describe('OfficePreviewComponent', () => {
  configureTestSuite();

  let component: OfficePreviewComponent;
  let fixture: ComponentFixture<OfficePreviewComponent>;

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
  }

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [OfficePreviewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficePreviewComponent);
    component = fixture.componentInstance;

    spyOn(createWebViewer, 'default');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('web viewer setup', () => {
    const options = {
      path: 'assets/webviewer',
      enableAnnotations: false,
      isReadOnly: true,
      preloadWorker: 'office',
      disableLogs: true,
      disabledElements: ['header', 'pageNavOverlay', 'progressModal'],
      licenseKey: environment.config.pdfTron.licenseKey,
    };

    it('should call createWebViewer with proper parameters if useScroll is false', () => {
      // Arrange
      component.useScroll = false;

      // Act
      detectChanges();

      // Assert
      expect(createWebViewer.default).toHaveBeenCalledWith(
        {
          ...options,
          css: '/assets/webviewer-styles/webviewer-noscroll-styles.css',
        },
        jasmine.anything()
      );
    });

    it('should call createWebViewer with proper parameters if useScroll is true', () => {
      // Arrange
      component.useScroll = true;

      // Act
      detectChanges();

      // Assert
      expect(createWebViewer.default).toHaveBeenCalledWith(
        {
          ...options,
          css: '/assets/webviewer-styles/webviewer-scroll-styles.css',
        },
        jasmine.anything()
      );
    });
  });
});
