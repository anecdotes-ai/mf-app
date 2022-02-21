import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BaseModalComponent } from 'core/modules/modals';
import { TextAreaControl, TextFieldControl } from 'core/models';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { ControlsFacadeService, FrameworksFacadeService, RequirementsFacadeService } from 'core/modules/data/services';
import { configureTestSuite } from 'ng-bullet';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequirementCreationSharedContext } from '../../services/requirement-customization-modal-service/requirement-creation-shared-context';
import { RequirementCreationModalComponent } from './requirement-creation-modal.component';
import { AddRequirementModalEnum } from '../../models';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { CalculatedControl } from 'core/modules/data/models';
import { Framework } from 'core/modules/data/models/domain';

class MockFrameworkFacade {
  getFrameworkById(frameworkId: string): Observable<Framework> {
    return of({});
  }
}

class MockControlFacade {
  getControl(control_id: string): Observable<CalculatedControl> {
    return of({});
  }
}

describe('RequirementCreationModalComponent', () => {
  configureTestSuite();

  let componentUnderTest: RequirementCreationModalComponent;
  let fixture: ComponentFixture<RequirementCreationModalComponent>;

  let requirementsFacade: RequirementsFacadeService;
  let switcherMock: ComponentSwitcherDirective;

  let fakeContext: RequirementCreationSharedContext;

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ControlsFacadeService, useClass: MockControlFacade },
        { provide: FrameworksFacadeService, useClass: MockFrameworkFacade },
        { provide: RequirementsFacadeService, useValue: {} },
        { provide: ComponentSwitcherDirective, useValue: {} },
      ],
      declarations: [RequirementCreationModalComponent, BaseModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementCreationModalComponent);
    componentUnderTest = fixture.componentInstance;

    requirementsFacade = TestBed.inject(RequirementsFacadeService);
    switcherMock = TestBed.inject(ComponentSwitcherDirective);
    switcherMock.goById = jasmine.createSpy('goById');
    switcherMock.sharedContext$ = of({}).pipe(map(() => fakeContext));
    fakeContext = {
      control_id: 'fakeControlId',
      framework_id: 'fakeFrameworkId',
      translationKey: 'fakeTranslationKey',
    };
  });

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  describe('buildTranslationKey()', () => {
    beforeEach(async () => {
      await detectChanges();
    });

    it('should return full translation key', () => {
      // Arrange
      const relativeKey = 'fakeRelativeKey';

      // Act
      const actuallFullKey = componentUnderTest.buildTranslationKey(relativeKey);

      // Assert
      expect(actuallFullKey).toBe(`${fakeContext.translationKey}.${relativeKey}`);
    });
  });

  it('should have newRequirementName and description controls', async () => {
    // Arrange
    // Act
    await detectChanges();

    // Assert
    expect(componentUnderTest.formGroup.items.newRequirementName).toBeInstanceOf(TextFieldControl);
    expect(componentUnderTest.formGroup.items.description).toBeInstanceOf(TextAreaControl);
  });

  describe('newRequirementName control', () => {
    let newRequirementNameControl: TextFieldControl;

    beforeEach(async () => {
      await detectChanges();
      newRequirementNameControl = componentUnderTest.formGroup.items.newRequirementName;
    });

    it('should be invalid when the field is not filled', () => {
      // Arrange
      newRequirementNameControl.setValue(undefined);

      // Act
      // Assert
      expect(newRequirementNameControl.invalid).toBeTrue();
      expect(newRequirementNameControl.errors).toEqual({ required: true });
    });

    it('should be valid when the field is filled', () => {
      // Arrange
      newRequirementNameControl.setValue('fake value');

      // Act
      // Assert
      expect(newRequirementNameControl.valid).toBeTrue();
      expect(newRequirementNameControl.errors).toBeFalsy();
    });

    it('should be an instance of text field', () => {
      // Arrange
      // Act
      // Assert
      expect(newRequirementNameControl).toBeInstanceOf(TextFieldControl);
    });

    it('should have required input set to true', () => {
      // Arrange
      // Act
      // Assert
      expect(newRequirementNameControl.inputs.required).toBeTrue();
    });

    it('should have label input set', () => {
      // Arrange
      // Act
      // Assert
      expect(newRequirementNameControl.inputs.label).toBe(
        `${fakeContext.translationKey}.newRequirementForm.newRequirementNameLabel`
      );
    });

    it('should have displayCharactersCounter input set to true', () => {
      // Arrange
      // Act
      // Assert
      expect(newRequirementNameControl.inputs.displayCharactersCounter).toBeTrue();
    });
  });

  describe('description control', () => {
    let descriptionControl: TextAreaControl;

    beforeEach(async () => {
      await detectChanges();
      descriptionControl = componentUnderTest.formGroup.items.description;
    });

    it('should have label input set', () => {
      // Arrange
      // Act
      // Assert
      expect(descriptionControl.inputs.label).toBe(`${fakeContext.translationKey}.newRequirementForm.descriptionLabel`);
    });

    it('should have resizable input set to false', () => {
      // Arrange
      // Act
      // Assert
      expect(descriptionControl.inputs.resizable).toBeFalse();
    });

    it('should have displayCharactersCounter input set to true', () => {
      // Arrange
      // Act
      // Assert
      expect(descriptionControl.inputs.displayCharactersCounter).toBeTrue();
    });
  });

  describe('switchToSelectExistingView()', () => {
    it(`should call switcher goById with ${AddRequirementModalEnum.SelectExisting}`, () => {
      // Arrange
      switcherMock.goById = jasmine.createSpy('goById');

      // Act
      componentUnderTest.switchToSelectExistingView();

      // Assert
      expect(switcherMock.goById).toHaveBeenCalledWith(AddRequirementModalEnum.SelectExisting);
    });
  });

  describe('addNewRequirement()', () => {
    beforeEach(async () => {
      requirementsFacade.addNewRequirement = jasmine.createSpy('addNewRequirement').and.returnValue(Promise.resolve());
      await detectChanges();
    });

    it('should call addNewRequirement from requirements facade with requirement', async () => {
      // Arrange
      const newRequirementName = 'fakeReqName';
      componentUnderTest.formGroup.items.newRequirementName.setValue(newRequirementName);

      const description = 'fakeReqName';
      componentUnderTest.formGroup.items.description.setValue(description);

      // Act
      await componentUnderTest.addNewRequirement();

      // Assert
      expect(requirementsFacade.addNewRequirement).toHaveBeenCalledWith({
        requirement_help: description,
        requirement_description: newRequirementName,
        requirement_related_controls: [fakeContext.control_id],
        requirement_related_frameworks: [fakeContext.framework_id]
      });
    });

    it('should set isLoading to false when adding is success', async () => {
      // Arrange
      // Act
      await componentUnderTest.addNewRequirement();

      // Assert
      expect(componentUnderTest.isLoading).toBeFalsy();
    });

    it('should set isLoading to false when adding is failed', async () => {
      // Arrange
      requirementsFacade.addNewRequirement = jasmine.createSpy('addNewRequirement').and.returnValue(Promise.reject());

      // Act
      await componentUnderTest.addNewRequirement();

      // Assert
      expect(componentUnderTest.isLoading).toBeFalsy();
    });

    it(`should call switcher goById with ${AddRequirementModalEnum.Success} id when adding is success`, async () => {
      // Arrange
      // Act
      await componentUnderTest.addNewRequirement();

      // Assert
      expect(switcherMock.goById).toHaveBeenCalledWith(AddRequirementModalEnum.Success);
    });

    it(`should call switcher goById with ${AddRequirementModalEnum.Success} id when adding is success`, async () => {
      // Arrange
      requirementsFacade.addNewRequirement = jasmine.createSpy('addNewRequirement').and.returnValue(Promise.reject());

      // Act
      await componentUnderTest.addNewRequirement();

      // Assert
      expect(switcherMock.goById).toHaveBeenCalledWith(AddRequirementModalEnum.Error);
    });

    it('should set isLoading to true when the promise being returned is not resolved', () => {
      // Arrange
      requirementsFacade.addNewRequirement = jasmine
        .createSpy('addNewRequirement')
        .and.returnValue(new Promise(() => { }));

      // Act
      componentUnderTest.addNewRequirement();

      // Assert
      expect(componentUnderTest.isLoading).toBeTruthy();
    });
  });

  describe('add requirement btb', () => {
    function getAddRequirementButton(): DebugElement {
      return fixture.debugElement.query(By.css('#add-requirement-btn'));
    }

    it('should call addNewRequirement() when clicked', async () => {
      // Arrange
      spyOn(componentUnderTest, 'addNewRequirement');

      // Act
      await detectChanges();
      getAddRequirementButton().triggerEventHandler('click', {});

      // Assert
      expect(componentUnderTest.addNewRequirement).toHaveBeenCalled();
    });

    it('should have disabled class when form is invalid', async () => {
      // Arrange
      spyOnProperty(componentUnderTest.formGroup, 'invalid').and.returnValue(true);

      // Act
      await detectChanges();

      // Assert
      expect(getAddRequirementButton().classes['disabled']).toBeTruthy();
    });

    it('should have disabled class when form is invalid', async () => {
      // Arrange
      spyOnProperty(componentUnderTest.formGroup, 'invalid').and.returnValue(false);

      // Act
      await detectChanges();

      // Assert
      expect(getAddRequirementButton().classes['disabled']).toBeFalsy();
    });
  });
});
