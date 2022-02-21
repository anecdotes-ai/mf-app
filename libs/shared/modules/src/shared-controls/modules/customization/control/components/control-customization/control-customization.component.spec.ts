import { RouterTestingModule } from '@angular/router/testing';
import { Control } from 'core/modules/data/models/domain';
import { ControlCustomizationSharedContext } from './../../services/controls-customization-modal-service/controls-customization-shared-context';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ControlCustomizationComponent } from './control-customization.component';
import { ControlsFacadeService, FrameworksFacadeService } from 'core/modules/data/services';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import {DropdownControl, TextAreaControl} from 'core';
import { BaseModalComponent } from 'core/modules/modals';
import { TranslateModule } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { TextFieldControl } from 'core';

class MockSwitcherDir {
  public constructor() { }

  goById = jasmine.createSpy('goById');
}

const mockControls: Control[] = [
  {
    control_id: 'first_control',
    control_category: 'First Category',
    control_name: 'First control name',
    control_description: 'first test desc',
  },
  {
    control_id: 'second_id',
    control_category: 'second Category',
    control_name: 'Second control name',
    control_description: 'second test desc',
  },
  {
    control_id: 'third_control',
    control_category: 'Third Category',
    control_name: 'Third control name',
    control_description: 'Third test desc',
  },
];

describe('ControlCustomizationComponent', () => {
  configureTestSuite();
  let component: ControlCustomizationComponent;
  let fixture: ComponentFixture<ControlCustomizationComponent>;
  let switcher: ComponentSwitcherDirective;
  let controlsFacadeServiceMock: ControlsFacadeService;
  let frameworksFacade: FrameworksFacadeService;
  let fakeContext: ControlCustomizationSharedContext;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      declarations: [ControlCustomizationComponent, BaseModalComponent],
      providers: [
        {
          provide: ControlsFacadeService,
          useValue: {},
        },
        {
          provide: FrameworksFacadeService,
          useValue: {},
        },
        { provide: ComponentSwitcherDirective, useValue: MockSwitcherDir }
      ],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlCustomizationComponent);
    switcher = TestBed.inject(ComponentSwitcherDirective);
    component = fixture.componentInstance;
    controlsFacadeServiceMock = TestBed.inject(ControlsFacadeService);
    controlsFacadeServiceMock.getControlsByFrameworkId = jasmine
      .createSpy('getControlsByFrameworkId')
      .and.callFake(() => of(mockControls));
    switcher.sharedContext$ = of({}).pipe(map(() => fakeContext));

    frameworksFacade = TestBed.inject(FrameworksFacadeService);
    frameworksFacade.getFrameworkById = jasmine.createSpy('getFrameworkById').and.callFake(() => of({}));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    it('should subscribe for shared switcher context and set form with empty values if not edit mode', async () => {
      // Arrange
      fakeContext = {
        framework_id: 'test_id',
        translationKey: 'testTranslationKey',
      };

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      expect(component.form.items).toEqual({
        category: jasmine.any(DropdownControl),
        controlName: jasmine.any(TextFieldControl),
        addDescription: jasmine.any(TextAreaControl),
      });

      const categoryDropdown = component.form.items.category;
      expect(categoryDropdown.value).toBeFalsy();
      expect(categoryDropdown.inputs.data).toEqual(mockControls.map((c) => c.control_category));
    });

    it('should subscribe for shared switcher context and set form with control values if edit mode', async () => {
      // Arrange
      const fakeControl: Control = mockControls[0];
      fakeContext = {
        framework_id: 'test_id',
        control_id: fakeControl.control_id,
        translationKey: 'testTranslationKey',
        isEditMode: true,
      };

      controlsFacadeServiceMock.getControl = jasmine.createSpy('getControl').and.returnValue(of(fakeControl));

      // Act
      fixture.detectChanges();
      await fixture.whenStable();

      // Assert
      const formItems = component.form.items;
      expect(formItems).toEqual({
        category: jasmine.any(DropdownControl),
        controlName: jasmine.any(TextFieldControl),
        addDescription: jasmine.any(TextAreaControl),
      });
      expect(formItems.category.value).toEqual(fakeControl.control_category);
      expect(formItems.controlName.value).toEqual(fakeControl.control_name);
      expect(formItems.addDescription.value).toEqual(fakeControl.control_description);
    });
  });

  describe('#submit form button', () => {
    it('should call submitFormBtnClick method when Update/Add Control button are pressed', async () => {
      // Arrange
      spyOn(component, 'submitFormBtnClick');
      fixture.detectChanges();
      await fixture.whenStable();
      await fixture.whenRenderingDone();

      // Act
      fixture.debugElement.query(By.css('#submit-form-btn')).triggerEventHandler('click', {});

      // Assert
      expect(component.submitFormBtnClick).toHaveBeenCalled();
    });
  });

  describe('#submitFormBtnClick', () => {
    let btnLoaderSpy: jasmine.Spy<(value?: boolean) => void>;

    beforeEach(async () => {
      btnLoaderSpy = spyOn(component.submitFormBtnLoader$, 'next');

      fakeContext = {
        framework_id: 'test_id',
        translationKey: 'testKey',
      };

      fixture.detectChanges();
      await fixture.whenStable();
      await fixture.whenRenderingDone();

      spyOn(component.form, 'enable');
      spyOn(component.form, 'disable');
    });

    it('submitFormBtnLoader should emit true and false, form should be disabled and enabled', async () => {
      // Arrange
      switcher.goById = jasmine.createSpy('goById');

      // Act
      await component.submitFormBtnClick();

      // Assert
      const loaderNextMethodCallInSequenceArguments = btnLoaderSpy.calls.allArgs().map((val) => val[0]);
      expect(loaderNextMethodCallInSequenceArguments).toEqual([true, false]);
      expect(component.form.disable).toHaveBeenCalled();
      expect(component.form.enable).toHaveBeenCalled();
    });
  });

  // Should be rewrited regarding new flow
  // describe('#submitFormBtnClick Add Control case', () => {
  //   beforeEach(async () => {
  //     fakeContext = {
  //       framework_id: 'test_id',
  //       translationKey: 'testKey'
  //     };

  //     fixture.detectChanges();
  //     await fixture.whenStable();
  //     await fixture.whenRenderingDone();
  //   });

  //   it('should call openSuccessModalWhenControlAdded of customizeControl service', async () => {
  //     // Arrange
  //     component.form.setValue({
  //       addDescription: 'someDescription',
  //       category: mockControls[0].control_category,
  //       controlName: 'asd',
  //     });

  //     // Act
  //     await component.submitFormBtnClick();

  //     // Assert
  //     const actionPayload: CustomControlFormData = {
  //       control_description: component.form.items.addDescription.value,
  //       control_framework_category: component.form.items.category.value,
  //       control_name: component.form.items.controlName.value,
  //       // Commented in case that currently we don't use sub categories
  //       // my_controls_category: this.form.items.subCategory.value,
  //     };

  //     const actionToDispatch = new AddCustomControlAction(fakeContext.framework_id, actionPayload);
  //     expect(customizeControlService.openSuccessModalWhenControlAdded).toHaveBeenCalledWith(
  //       jasmine.any(String),
  //       actionToDispatch
  //     );
  //   });
  // });

  // describe('#submitFormBtnClick Edit Control case', () => {
  //   const fakeControl = mockControls[2];
  //   beforeEach(async () => {
  //     fakeContext = {
  //       framework_id: 'test_id',
  //       control_id: fakeControl.control_id,
  //       translationKey: 'testKey',
  //       isEditMode: true,
  //     };

  //     fixture.detectChanges();
  //     await fixture.whenStable();
  //     await fixture.whenRenderingDone();
  //   });

  //   it('should call openSuccessModalWhenControlUpdated of customizeControl service and should pass control values if fields were not changed', async () => {
  //     // Arrange
  //     // Act
  //     await component.submitFormBtnClick();

  //     // Assert
  //     const actionPayload: CustomControlFormData = {
  //       control_description: fakeContext.control.control_description,
  //       control_framework_category: fakeContext.control.control_category,
  //       control_name: fakeContext.control.control_name,
  //       // Commented in case that currently we don't use sub categories
  //       // my_controls_category: this.form.items.subCategory.value,
  //     };

  //     const actionToDispatch = new EditCustomControlAction(fakeContext.control_id, actionPayload);
  //     expect(customizeControlService.openSuccessModalWhenControlUpdated).toHaveBeenCalledWith(
  //       jasmine.any(String),
  //       actionToDispatch
  //     );
  //   });
  // });
});
