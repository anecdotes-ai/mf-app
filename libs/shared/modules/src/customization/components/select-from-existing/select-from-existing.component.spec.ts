import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Policy } from 'core/modules/data/models/domain';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { map } from 'rxjs/operators';
import { SelectFromExistingComponent } from './select-from-existing.component';
import { configureTestSuite } from 'ng-bullet';
import { AddItemModalEnum, ItemSharedContext } from 'core/modules/customization/models';
import { of } from 'rxjs';
import { PolicyManagerEventService } from 'core/services/policy-manager-event-service/policy-manager-event.service';
import { PolicyAddType, UserEvents } from 'core';

// class MockFrameworkFacade {
//   getCalculatedFramework(frameworkId: string): Observable<Framework> {
//     return of({});
//   }
// }

// class MockControlFacade {
//   getControl(control_id: string): Observable<CalculatedControl> {
//     return of({});
//   }
// }

describe('SelectFromExistingComponent', () => {
  configureTestSuite();

  let componentUnderTest: SelectFromExistingComponent;
  let fixture: ComponentFixture<SelectFromExistingComponent>;

  let switcherMock: ComponentSwitcherDirective;
  let policyManagerEventService: PolicyManagerEventService;

  let resolve = (): Promise<void> => Promise.resolve();
  let reject = (): Promise<void> => Promise.reject();
  let fakeContext: ItemSharedContext = {
    item: {
      name: 'some-name',
      type: 'some-type',
      description: 'description',
    },
    translationKey: 'fakeTranslationKey',
    submitAction: resolve,
    poolOfItems: [
      {
        policy_name: 'some-name',
        policy_type: 'some-type',
        status: 'some-status',
      },
    ],
    poolValueSelector: (policy: Policy) => policy.policy_name,
  };

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ComponentSwitcherDirective, useValue: {} },
        { provide: PolicyManagerEventService, useValue: {} },
      ],
      declarations: [SelectFromExistingComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectFromExistingComponent);
    componentUnderTest = fixture.componentInstance;

    switcherMock = TestBed.inject(ComponentSwitcherDirective);
    switcherMock.goById = jasmine.createSpy('goById');
    switcherMock.changeContext = jasmine.createSpy('changeContext');
    switcherMock.sharedContext$ = of({}).pipe(map(() => fakeContext));

    policyManagerEventService = TestBed.inject(PolicyManagerEventService);
    policyManagerEventService.trackAddPolicyEvent = jasmine.createSpy('trackAddPolicyEvent');
  });

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  describe('addExistingItem()', () => {
    it(`should send ${UserEvents.ADD_POLICY} event`, async () => {
      // Arrange
      fakeContext.submitAction = resolve;

      // Act
      componentUnderTest.ngOnInit();
      await detectChanges();
      componentUnderTest.formGroup.items.item.value = {
        policy_name: 'some-name',
        policy_type: 'some-type',
        status: 'some-status',
      };
      await componentUnderTest.addExistingItem();

      // Assert
      expect(policyManagerEventService.trackAddPolicyEvent).toHaveBeenCalledWith(
        {
          policy_name: componentUnderTest.formGroup.items.item.value.policy_name,
          policy_type: componentUnderTest.formGroup.items.item.value.policy_type,
          status: componentUnderTest.formGroup.items.item.value.status,
        },
        PolicyAddType.SelectedFromExisting
      );
      expect(switcherMock.goById).toHaveBeenCalledWith(AddItemModalEnum.Success);
    });
  });

  // describe('buildTranslationKey()', () => {
  //   beforeEach(async () => {
  //     await detectChanges();
  //   });
  //
  //   it('should return full translation key', () => {
  //     // Arrange
  //     const relativeKey = 'fakeRelativeKey';
  //
  //     // Act
  //     const actuallFullKey = componentUnderTest.buildTranslationKey(relativeKey);
  //
  //     // Assert
  //     expect(actuallFullKey).toBe(`${fakeContext.translationKey}.${relativeKey}`);
  //   });
  // });
  //
  // describe('formGroup', () => {
  //   it('should have requirement DropdownControl', () => {
  //     // Arrange
  //     // Act
  //     // Assert
  //     expect(componentUnderTest.formGroup.items.requirement).toBeInstanceOf(DropdownControl);
  //   });
  // });
  //
  // describe('requirement control', () => {
  //   beforeEach(async () => {
  //     await detectChanges();
  //   });
  //
  //   it('should have data set to requirements from requirement facade', () => {
  //     // Arrange
  //     // Act
  //     // Assert
  //     expect(componentUnderTest.formGroup.items.requirement.inputs.data).toBe(fakeRequirements);
  //   });
  //
  //   it('should have searchEnabled set to true', () => {
  //     // Arrange
  //     // Act
  //     // Assert
  //     expect(componentUnderTest.formGroup.items.requirement.inputs.searchEnabled).toBeTruthy();
  //   });
  //
  //   it('should have displayValueSelector set to requirement_name selector', () => {
  //     // Arrange
  //     const fakeRequirement: ControlRequirement = { requirement_name: 'fakeReqName' };
  //     // Act
  //     const selectorReturnValue = componentUnderTest.formGroup.items.requirement.inputs.displayValueSelector(
  //       fakeRequirement
  //     );
  //
  //     // Assert
  //     expect(selectorReturnValue).toBe(selectorReturnValue);
  //   });
  //
  //   it('should have titleTranslationKey', () => {
  //     // Arrange
  //     // Act
  //     // Assert
  //     expect(componentUnderTest.formGroup.items.requirement.inputs.titleTranslationKey).toBe(
  //       `${fakeContext.translationKey}.newRequirementForm.selectRequirementLabel`
  //     );
  //   });
  //
  //   it('should have searchFieldPlaceholder', () => {
  //     // Arrange
  //     // Act
  //     // Assert
  //     expect(componentUnderTest.formGroup.items.requirement.inputs.searchFieldPlaceholder).toBe(
  //       `${fakeContext.translationKey}.newRequirementForm.search`
  //     );
  //   });
  //
  //   it('should have placeholderTranslationKey', () => {
  //     // Arrange
  //     // Act
  //     // Assert
  //     expect(componentUnderTest.formGroup.items.requirement.inputs.placeholderTranslationKey).toBe(
  //       `${fakeContext.translationKey}.newRequirementForm.selectRequirement`
  //     );
  //   });
  // });
  //
  // describe('switchToCreateNewView()', () => {
  //   it(`should call switcher goById with ${AddRequirementModalEnum.AddNew}`, () => {
  //     // Arrange
  //     switcherMock.goById = jasmine.createSpy('goById');
  //
  //     // Act
  //     componentUnderTest.switchToCreateNewView();
  //
  //     // Assert
  //     expect(switcherMock.goById).toHaveBeenCalledWith(AddRequirementModalEnum.AddNew);
  //   });
  // });
  //
  // describe('addExistingRequirement()', () => {
  //   let fakeRequirement: ControlRequirement;
  //
  //   beforeEach(async () => {
  //     requirementsFacade.addExistingRequirement = jasmine
  //       .createSpy('addExistingRequirement')
  //       .and.returnValue(Promise.resolve());
  //     fakeRequirement = {
  //       requirement_id: 'fake-id',
  //     };
  //     componentUnderTest.formGroup.items.requirement.setValue(fakeRequirement);
  //     await detectChanges();
  //   });
  //
  //   it('should call addExistingRequirement from requirements facade with requirement', async () => {
  //     // Arrange
  //     // Act
  //     await componentUnderTest.addExistingRequirement();
  //
  //     // Assert
  //     expect(requirementsFacade.addExistingRequirement).toHaveBeenCalledWith({
  //       requirement_id: fakeRequirement.requirement_id,
  //       requirement_related_controls: [fakeContext.control_id],
  //       requirement_related_frameworks: [fakeContext.framework_id],
  //     });
  //   });
  //
  //   it('should set isLoading to false when adding is success', async () => {
  //     // Arrange
  //     // Act
  //     await componentUnderTest.addExistingRequirement();
  //
  //     // Assert
  //     expect(componentUnderTest.isLoading).toBeFalsy();
  //   });
  //
  //   it('should set isLoading to false when adding is failed', async () => {
  //     // Arrange
  //     requirementsFacade.addExistingRequirement = jasmine
  //       .createSpy('addExistingRequirement')
  //       .and.returnValue(Promise.reject());
  //
  //     // Act
  //     await componentUnderTest.addExistingRequirement();
  //
  //     // Assert
  //     expect(componentUnderTest.isLoading).toBeFalsy();
  //   });
  //
  //   it(`should call switcher goById with ${AddRequirementModalEnum.Success} id when adding is success`, async () => {
  //     // Arrange
  //     // Act
  //     await componentUnderTest.addExistingRequirement();
  //
  //     // Assert
  //     expect(switcherMock.goById).toHaveBeenCalledWith(AddRequirementModalEnum.Success);
  //   });
  //
  //   it(`should call switcher goById with ${AddRequirementModalEnum.Success} id when adding is success`, async () => {
  //     // Arrange
  //     requirementsFacade.addExistingRequirement = jasmine
  //       .createSpy('addExistingRequirement')
  //       .and.returnValue(Promise.reject());
  //
  //     // Act
  //     await componentUnderTest.addExistingRequirement();
  //
  //     // Assert
  //     expect(switcherMock.goById).toHaveBeenCalledWith(AddRequirementModalEnum.Error);
  //   });
  //
  //   it('should set isLoading to true when the promise being returned is not resolved', () => {
  //     // Arrange
  //     requirementsFacade.addExistingRequirement = jasmine
  //       .createSpy('addExistingRequirement')
  //       .and.returnValue(new Promise(() => {}));
  //
  //     // Act
  //     componentUnderTest.addExistingRequirement();
  //
  //     // Assert
  //     expect(componentUnderTest.isLoading).toBeTruthy();
  //   });
  // });

  // describe('add existing requirement btb', () => {
  //   function getAddRequirementButton(): DebugElement {
  //     return fixture.debugElement.query(By.css('#add-existing-requirement-btn'));
  //   }
  //
  //   it('should call addExistingRequirement() when clicked', async () => {
  //     // Arrange
  //     spyOn(componentUnderTest, 'addExistingRequirement');
  //
  //     // Act
  //     await detectChanges();
  //     getAddRequirementButton().triggerEventHandler('click', {});
  //
  //     // Assert
  //     expect(componentUnderTest.addExistingRequirement).toHaveBeenCalled();
  //   });
  //
  //   it('should have disabled class when form is invalid', async () => {
  //     // Arrange
  //     spyOnProperty(componentUnderTest.formGroup, 'invalid').and.returnValue(true);
  //
  //     // Act
  //     await detectChanges();
  //
  //     // Assert
  //     expect(getAddRequirementButton().classes['disabled']).toBeTruthy();
  //   });
  //
  //   it('should have disabled class when form is invalid', async () => {
  //     // Arrange
  //     spyOnProperty(componentUnderTest.formGroup, 'invalid').and.returnValue(false);
  //
  //     // Act
  //     await detectChanges();
  //
  //     // Assert
  //     expect(getAddRequirementButton().classes['disabled']).toBeFalsy();
  //   });
  // });
});
