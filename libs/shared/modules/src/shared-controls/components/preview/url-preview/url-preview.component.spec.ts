import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UrlPreviewComponent } from './url-preview.component';
import { configureTestSuite } from 'ng-bullet';
import { WindowHelperService } from 'core';
import { CombinedEvidenceInstance } from './../../../../data/models/domain/combinedEvidenceInstance';

describe('UrlPreviewComponent', () => {
  configureTestSuite();

  let component: UrlPreviewComponent;
  let fixture: ComponentFixture<UrlPreviewComponent>;
  let windowHelperService: WindowHelperService;

  const evidence: CombinedEvidenceInstance = {
    evidence_tip: 'fake tip',
  };

  const evidencePreviewTranslationRoot = 'evidencePreview';

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      declarations: [UrlPreviewComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: WindowHelperService, useValue: {} }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlPreviewComponent);
    component = fixture.componentInstance;

    windowHelperService = TestBed.inject(WindowHelperService);
    windowHelperService.openUrlInNewTab = jasmine.createSpy('openUrlInNewTab');

    component.rootEvidence = evidence;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('openLink()', () => {
    // Arrange
    const link = 'https://link';

    // Act
    component.openLink(link);

    // Assert
    expect(windowHelperService.openUrlInNewTab).toHaveBeenCalledWith(link);
  });

  it('buildTranslationKey()', () => {
    // Arrange
    const key = 'key';

    // Act
    const result = component.buildTranslationKey(key);

    // Assert
    expect(result).toEqual(`${evidencePreviewTranslationRoot}.${key}`);
  });

  it('copyLink()', () => {
    const link = 'www.link.com';

    navigator.clipboard.writeText = jasmine.createSpy('writeText');

    // Act
    component.copyLink(link);

    // Assert
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(link);
  });

  describe('checkTipHidden()', () => {
    it('checkTipHidden() should calls', () => {
      // Arrange
      spyOn(component, 'checkTipHidden');

      // Act
      fixture.debugElement.triggerEventHandler('click', new MouseEvent('click'));

      // Assert
      expect(component.checkTipHidden).toHaveBeenCalledWith();
    });
  });

  it('should return false if app-tip hasn`t `hidden` class)', () => {
    // Arrange

    // Act
    const hasHiddenClass = component.checkTipHidden();

    // Assert
    expect(hasHiddenClass).toBeFalse();
  });

  it('should return true if app-tip has `hidden` class)', () => {
    // Arrange
    const tipEl: HTMLElement = fixture.debugElement.query(By.css('app-tip')).nativeElement;

    // Act
    tipEl.classList.add('hidden');

    const hasHiddenClass = component.checkTipHidden();

    // Assert
    expect(hasHiddenClass).toBeTrue();
  });
});
