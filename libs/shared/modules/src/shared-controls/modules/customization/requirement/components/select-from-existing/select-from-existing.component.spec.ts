import { CalculatedControl } from 'core/modules/data/models';
/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { ControlRequirement, Framework } from 'core/modules/data/models/domain';
import { BaseModalComponent } from 'core/modules/modals';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { ControlsFacadeService, FrameworksFacadeService, RequirementsFacadeService } from 'core/modules/data/services';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddRequirementModalEnum } from '../../models';
import { RequirementCreationSharedContext } from '../../services/requirement-customization-modal-service/requirement-creation-shared-context';
import { SelectFromExistingComponent } from './select-from-existing.component';
import { DropdownControl } from 'core/models/form';
import { configureTestSuite } from 'ng-bullet';

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

describe('SelectFromExistingComponent', () => {
  configureTestSuite();

  let componentUnderTest: SelectFromExistingComponent;
  let fixture: ComponentFixture<SelectFromExistingComponent>;

  let requirementsFacade: RequirementsFacadeService;
  let switcherMock: ComponentSwitcherDirective;

  let fakeContext: RequirementCreationSharedContext;
  let fakeRequirements: ControlRequirement[];

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ComponentSwitcherDirective, useValue: {} },
        { provide: ControlsFacadeService, useClass: MockControlFacade },
        { provide: FrameworksFacadeService, useClass: MockFrameworkFacade },
        { provide: RequirementsFacadeService, useValue: {} },
        { provide: ComponentSwitcherDirective, useValue: {} },
      ],
      declarations: [SelectFromExistingComponent, BaseModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectFromExistingComponent);
    componentUnderTest = fixture.componentInstance;

    requirementsFacade = TestBed.inject(RequirementsFacadeService);
    switcherMock = TestBed.inject(ComponentSwitcherDirective);
    switcherMock.goById = jasmine.createSpy('goById');
    switcherMock.changeContext = jasmine.createSpy('changeContext');
    switcherMock.sharedContext$ = of({}).pipe(map(() => fakeContext));
    fakeContext = {
      control_id: 'fakeControlId',
      framework_id: 'fakeFrameworkId',
      translationKey: 'fakeTranslationKey',
    };
    fakeRequirements = [
      { requirement_id: 'fake-req-id-1', requirement_name: 'bla1' },
      { requirement_id: 'fake-req-id-2', requirement_name: 'bla2' },
      { requirement_id: 'fake-req-id-3', requirement_name: 'bla3' },
    ];
    requirementsFacade.getRequirements = jasmine.createSpy('getRequirements').and.callFake(() => of(fakeRequirements));
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

  describe('formGroup', () => {
    it('should have requirement DropdownControl', () => {
      // Arrange
      // Act
      // Assert
      expect(componentUnderTest.formGroup.items.requirement).toBeInstanceOf(DropdownControl);
    });
  });

  describe('requirement control', () => {
    beforeEach(async () => {
      await detectChanges();
    });

    it('should have data set to requirements from requirement facade', () => {
      // Arrange
      // Act
      // Assert
      expect(componentUnderTest.formGroup.items.requirement.inputs.data).toEqual(fakeRequirements);
    });

    it('should have searchEnabled set to true', () => {
      // Arrange
      // Act
      // Assert
      expect(componentUnderTest.formGroup.items.requirement.inputs.searchEnabled).toBeTruthy();
    });

    it('should have displayValueSelector set to requirement_name selector', () => {
      // Arrange
      const fakeRequirement: ControlRequirement = { requirement_name: 'fakeReqName' };
      // Act
      const selectorReturnValue = componentUnderTest.formGroup.items.requirement.inputs.displayValueSelector(
        fakeRequirement
      );

      // Assert
      expect(selectorReturnValue).toBe(selectorReturnValue);
    });

    it('should have titleTranslationKey', () => {
      // Arrange
      // Act
      // Assert
      expect(componentUnderTest.formGroup.items.requirement.inputs.titleTranslationKey).toBe(
        `${fakeContext.translationKey}.newRequirementForm.selectRequirementLabel`
      );
    });

    it('should have searchFieldPlaceholder', () => {
      // Arrange
      // Act
      // Assert
      expect(componentUnderTest.formGroup.items.requirement.inputs.searchFieldPlaceholder).toBe(
        `${fakeContext.translationKey}.newRequirementForm.search`
      );
    });

    it('should have placeholderTranslationKey', () => {
      // Arrange
      // Act
      // Assert
      expect(componentUnderTest.formGroup.items.requirement.inputs.placeholderTranslationKey).toBe(
        `${fakeContext.translationKey}.newRequirementForm.selectRequirement`
      );
    });
  });

  describe('switchToCreateNewView()', () => {
    it(`should call switcher goById with ${AddRequirementModalEnum.AddNew}`, () => {
      // Arrange
      switcherMock.goById = jasmine.createSpy('goById');

      // Act
      componentUnderTest.switchToCreateNewView();

      // Assert
      expect(switcherMock.goById).toHaveBeenCalledWith(AddRequirementModalEnum.AddNew);
    });
  });

  describe('addExistingRequirement()', () => {
    let fakeRequirement: ControlRequirement;
    beforeEach(async () => {
      requirementsFacade.addExistingRequirement = jasmine
        .createSpy('addExistingRequirement')
        .and.returnValue(Promise.resolve());
      fakeRequirement = {
        requirement_id: 'fake-id',
      };
      componentUnderTest.formGroup.items.requirement.setValue(fakeRequirement);
      await detectChanges();
    });

    it('should call addExistingRequirement from requirements facade with requirement', async () => {
      // Arrange
      // Act
      await componentUnderTest.addExistingRequirement();

      // Assert
      expect(requirementsFacade.addExistingRequirement).toHaveBeenCalledWith({
        requirement_id: fakeRequirement.requirement_id,
        requirement_related_controls: [fakeContext.control_id],
        requirement_related_frameworks: [fakeContext.framework_id]
      });
    });

    it('should set isLoading to false when adding is success', async () => {
      // Arrange
      // Act
      await componentUnderTest.addExistingRequirement();

      // Assert
      expect(componentUnderTest.isLoading).toBeFalsy();
    });

    it('should set isLoading to false when adding is failed', async () => {
      // Arrange
      requirementsFacade.addExistingRequirement = jasmine
        .createSpy('addExistingRequirement')
        .and.returnValue(Promise.reject());

      // Act
      await componentUnderTest.addExistingRequirement();

      // Assert
      expect(componentUnderTest.isLoading).toBeFalsy();
    });

    it(`should call switcher goById with ${AddRequirementModalEnum.Success} id when adding is success`, async () => {
      // Arrange
      // Act
      await componentUnderTest.addExistingRequirement();

      // Assert
      expect(switcherMock.goById).toHaveBeenCalledWith(AddRequirementModalEnum.Success);
    });

    it(`should call switcher goById with ${AddRequirementModalEnum.Success} id when adding is success`, async () => {
      // Arrange
      requirementsFacade.addExistingRequirement = jasmine
        .createSpy('addExistingRequirement')
        .and.returnValue(Promise.reject());

      // Act
      await componentUnderTest.addExistingRequirement();

      // Assert
      expect(switcherMock.goById).toHaveBeenCalledWith(AddRequirementModalEnum.Error);
    });

    it('should set isLoading to true when the promise being returned is not resolved', () => {
      // Arrange
      requirementsFacade.addExistingRequirement = jasmine
        .createSpy('addExistingRequirement')
        .and.returnValue(new Promise(() => {}));

      // Act
      componentUnderTest.addExistingRequirement();

      // Assert
      expect(componentUnderTest.isLoading).toBeTruthy();
    });
  });

  describe('add existing requirement btb', () => {
    function getAddRequirementButton(): DebugElement {
      return fixture.debugElement.query(By.css('#add-existing-requirement-btn'));
    }

    it('should call addExistingRequirement() when clicked', async () => {
      // Arrange
      spyOn(componentUnderTest, 'addExistingRequirement');

      // Act
      await detectChanges();
      getAddRequirementButton().triggerEventHandler('click', {});

      // Assert
      expect(componentUnderTest.addExistingRequirement).toHaveBeenCalled();
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
