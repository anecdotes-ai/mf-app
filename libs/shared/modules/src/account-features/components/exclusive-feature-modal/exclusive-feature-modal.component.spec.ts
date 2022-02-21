import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IntercomService } from 'core/services';
import { configureTestSuite } from 'ng-bullet';
import { ExclusiveFeatureModalComponent } from './exclusive-feature-modal.component';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { of, Subject } from 'rxjs';
import { AccountFeatureEnum } from 'core/modules/data/models/domain';
import { Directive } from '@angular/core';
import { map } from 'rxjs/operators';
@Directive({
  selector: '[componentsToSwitch]',
  exportAs: 'switcher',
})
class MockSwitcherDir {
  public sharedContext$ = new Subject<{ feature: AccountFeatureEnum }>();

  goById = jasmine.createSpy('goById');
}

describe('ExclusiveFeatureModalComponent', () => {
  configureTestSuite();

  let component: ExclusiveFeatureModalComponent;
  let fixture: ComponentFixture<ExclusiveFeatureModalComponent>;
  let intercomService: IntercomService;
  let switcher: ComponentSwitcherDirective;
  let fakeContext;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ExclusiveFeatureModalComponent],
      providers: [
        { provide: IntercomService, useValue: {} },
        {
          provide: ComponentSwitcherDirective,
          useClass: MockSwitcherDir,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExclusiveFeatureModalComponent);
    component = fixture.componentInstance;

    intercomService = TestBed.inject(IntercomService);
    intercomService.showNewMessage = jasmine.createSpy('showNewMessage');

    switcher = TestBed.inject(ComponentSwitcherDirective);
    switcher.sharedContext$ = of({}).pipe(map(() => fakeContext));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#contactUs', () => {
    it('should call intercomService.showNewMessage', () => {
      // Act
      component.contactUs();

      // Assert
      expect(intercomService.showNewMessage).toHaveBeenCalled();
    });
  });

  describe('#buildTranslationKey', () => {
    it('should return translationKey based on relativeKey', () => {
      // Arrange
      const relativeKey = 'someRelativeKey';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toBe(`core.exclusiveFeatureModal.${relativeKey}`);
    });
  });

  describe('#build Correct relativeTitleKey', () => {
    [
      { feature: AccountFeatureEnum.AdoptFramework, result: 'exclusiveAdoptframework' },
      { feature: AccountFeatureEnum.PolicyTemplates, result: 'exclusivePolicyTemplates' },
      { feature: AccountFeatureEnum.ExportControls, result: 'exclusiveExportcontrols' },
    ].forEach((testcase) => {
      it(`if feature is ${testcase.feature} relativeTitleKey should be ${testcase.result}`, async () => {
        // Arrange
        fakeContext = { feature: testcase.feature };

        // Act
        fixture.detectChanges();
        await fixture.whenStable();

        // Assert
        expect(component.relativeTitleKey).toBe(testcase.result);
      });
    });
  });

  describe('#build Correct icon', () => {
    [
      { feature: AccountFeatureEnum.AdoptFramework, result: 'exclusive-framework' },
      { feature: AccountFeatureEnum.PolicyTemplates, result: 'exclusive-documents' },
      { feature: AccountFeatureEnum.ExportControls, result: 'exclusive-documents' },
    ].forEach((testcase) => {
      it(`if feature is ${testcase.feature} icon should be ${testcase.result}`, async () => {
        // Arrange
        fakeContext = { feature: testcase.feature };

        // Act
        fixture.detectChanges();
        await fixture.whenStable();

        // Assert
        expect(component.icon).toBe(testcase.result);
      });
    });
  });
});
