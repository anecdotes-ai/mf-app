import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidenceReportComponent } from './evidence-report.component';
import { IntercomService } from 'core';
import { AuthService } from 'core/modules/auth-core/services';
import { TranslateModule } from '@ngx-translate/core';

describe('EvidenceReportComponent', () => {
  let component: EvidenceReportComponent;
  let fixture: ComponentFixture<EvidenceReportComponent>;
  const intercomSpy = jasmine.createSpyObj('IntercomService', ['showNewMessage']);
  let intercomService: IntercomService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [EvidenceReportComponent],
      providers: [
        { provide: IntercomService, useValue: intercomSpy },
        {
          provide: AuthService,
          useValue: { getUserAsync: () => Promise.resolve({ email: 'user@example.com' }) },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidenceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    intercomService = fixture.debugElement.injector.get(IntercomService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('buildTranslationKey', () => {
    ['one', 'two'].forEach((testCase) => {
      it(`should return string that equals to "evidences.evidenceReport.${testCase}"`, () => {
        // Arrange

        // Act
        const key = component.buildTranslationKey(testCase);

        // Assert
        expect(key).toEqual(`evidences.evidenceReport.${testCase}`);
      });
    });
  });

  describe('openIntercom', () => {
    it('should call intercom service', () => {
      component.openIntercom();
      expect(intercomService.showNewMessage).toHaveBeenCalled();
    });
  });
});
