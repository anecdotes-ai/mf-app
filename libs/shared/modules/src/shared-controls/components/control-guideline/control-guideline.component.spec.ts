import { guidelineTabKeys } from './constants/control-guideline.constants';
import { ModalWindowService } from './../../../modals/services/modal-window/modal-window.service';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { ControlGuidelineComponent } from './control-guideline.component';
import { CalculatedControl } from './../../../data/models/calculated-control.model';
import { Framework } from 'core/modules/data/models/domain';
import { GuidelineTabModel } from './../../models/guideline-tab.model';

describe('ControlGuidelineComponent', () => {
  configureTestSuite();
  let component: ControlGuidelineComponent;
  let fixture: ComponentFixture<ControlGuidelineComponent>;
  let modalWindowService: ModalWindowService;

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  const controlInstance1: CalculatedControl = {
    control_name: 'control1',
    control_guidance_for_customers: 'some text for customers',
    control_guidance_for_providers: 'some text for providers',
  };

  const frameworkInstanceWithSeparate: Framework = {
    framework_name: 'ISO 27017:2015',
  };

  const frameworkInstance1: Framework = {
    framework_name: 'ISO 27018:2019',
  };

  const frameworkInstance2: Framework = {
    framework_name: 'some random not iso',
  };

  const expectedTabs1: GuidelineTabModel[] = [
    {
      textContent: controlInstance1.control_guidance_for_customers,
      translationKey: guidelineTabKeys['control_guidance_for_customers'],
      isActive: true,
    },
    {
      textContent: controlInstance1.control_guidance_for_providers,
      translationKey: guidelineTabKeys['control_guidance_for_providers'],
      isActive: false,
    },
  ];

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [ControlGuidelineComponent],
      providers: [{ provide: ModalWindowService, useValue: {} }],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlGuidelineComponent);
    component = fixture.componentInstance;
    modalWindowService = TestBed.inject(ModalWindowService);
    modalWindowService.close = jasmine.createSpy('close');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {
    it('should not set tabs mode when framework is not in frameworksWithSeparatedGuidline', async () => {
      // Arrange
      component.framework = frameworkInstance2;
      spyOn(component, 'selectTab');

      // Act
      await detectChanges();

      // Assert
      expect(component.selectTab).not.toHaveBeenCalled();
      expect(component.tabs).toBeFalsy();
      expect(component.inTabsMode).toBeFalse();
    });

    it('should properly set tabs when framework is in frameworksWithSeparatedGuidline', async () => {
      // Arrange
      component.framework = frameworkInstanceWithSeparate;
      component.control = controlInstance1;

      // Act
      await detectChanges();

      // Assert
      expect(component.tabs).toEqual(expectedTabs1);
    });

    it('should call selectTab with first tab after setting tabs when framework is in frameworksWithSeparatedGuidline', async () => {
      // Arrange
      component.framework = frameworkInstanceWithSeparate;
      component.control = controlInstance1;
      const tabBeforSelecting = expectedTabs1[0];
      tabBeforSelecting.isActive = false;

      spyOn(component, 'selectTab');

      // Act
      await detectChanges();

      // Assert
      expect(component.selectTab).toHaveBeenCalledWith(tabBeforSelecting);
    });
  });

  describe('onCloseBtnClick()', () => {
    it('should close modal window', () => {
      // Arrange
      // Act
      component.onCloseBtnClick();

      // Assert
      expect(modalWindowService.close).toHaveBeenCalled();
    });
  });

  describe('selectTab()', () => {
    it('should set all the tabs to false except for selected', () => {
      // Arrange
      const mockedTabs1: GuidelineTabModel[] = [
        {
          textContent: controlInstance1.control_guidance_for_customers,
          translationKey: guidelineTabKeys['control_guidance_for_customers'],
          isActive: true,
        },
        {
          textContent: controlInstance1.control_guidance_for_providers,
          translationKey: guidelineTabKeys['control_guidance_for_providers'],
          isActive: false,
        },
      ];
      const expectedTabsMock: GuidelineTabModel[] = [
        {
          textContent: controlInstance1.control_guidance_for_customers,
          translationKey: guidelineTabKeys['control_guidance_for_customers'],
          isActive: false,
        },
        {
          textContent: controlInstance1.control_guidance_for_providers,
          translationKey: guidelineTabKeys['control_guidance_for_providers'],
          isActive: true,
        },
      ];
      component.tabs = mockedTabs1;

      // Act
      component.selectTab(mockedTabs1[1]);

      // Assert
      expect(component.tabs).toEqual(expectedTabsMock);
    });
  });

  describe('buildTranslationKey()', () => {
    it('should return translationKey based on relativeKey', () => {
      // Arrange
      const relativeKey = 'someRelativeKey';

      // Act
      const actual = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actual).toBe(`controls.guideline.${relativeKey}`);
    });
  });
});
