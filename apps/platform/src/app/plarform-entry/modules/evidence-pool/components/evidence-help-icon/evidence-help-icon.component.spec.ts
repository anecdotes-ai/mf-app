import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { WindowHelperService } from 'core';
import { configureTestSuite } from 'ng-bullet';
import { EvidenceHelpIconComponent } from './evidence-help-icon.component';

describe('EvidenceHelpIconComponent', () => {
  configureTestSuite();

  let component: EvidenceHelpIconComponent;
  let fixture: ComponentFixture<EvidenceHelpIconComponent>;
  let windowHelper: WindowHelperService;
  let origin: string;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NgbTooltipModule],
      declarations: [EvidenceHelpIconComponent],
      providers: [{ provide: WindowHelperService, useValue: {} }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidenceHelpIconComponent);
    component = fixture.componentInstance;

    windowHelper = TestBed.inject(WindowHelperService);
    windowHelper.openUrlInNewTab = jasmine.createSpy('openUrlInNewTab');
    windowHelper.getWindow = jasmine.createSpy('getWindow').and.callFake(() => ({ location: { origin } }));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#buildTranslationKey', () => {
    it('should correctly build translation key', () => {
      // Arrange
      const relativeKey = 'some-key';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toEqual(`evidencePreview.${relativeKey}`);
    });
  });

  describe('#viewRawData', () => {
    it('should open raw data in new tab', () => {
      // Arrange
      component.evidence = { evidence_instance_id: 'some-id' };
      origin = 'some-origin';

      // Act
      component.viewRawData();

      // Assert
      expect(windowHelper.openUrlInNewTab).toHaveBeenCalledWith('some-origin/view-evidence/some-id/raw');
    });
  });
});
