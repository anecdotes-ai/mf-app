import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ItemCreationModalComponent } from 'core/modules/customization/components';
import { AddItemModalEnum, ItemSharedContext } from 'core/modules/customization/models';
import { PolicyManagerEventService } from 'core/services/policy-manager-event-service/policy-manager-event.service';
import { ResourceStatusEnum } from 'core/modules/data/models';
import { PolicyAddType, UserEvents } from 'core';
import { PoliciesFacadeService } from 'core/modules/data/services/facades/policies-facade/policies-facade.service';
import { PolicyTypesEnum } from 'core/modules/data/models';

describe('ItemCreationModalComponent', () => {
  configureTestSuite();

  let componentUnderTest: ItemCreationModalComponent;
  let fixture: ComponentFixture<ItemCreationModalComponent>;
  let policyManagerEventService: PolicyManagerEventService;
  let policiesFacadeService: PoliciesFacadeService;

  let switcherMock: ComponentSwitcherDirective;
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
  };
  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: ComponentSwitcherDirective, useValue: {} },
        { provide: PolicyManagerEventService, useValue: {} },
        { provide: PoliciesFacadeService, useValue: {} },
      ],
      declarations: [ItemCreationModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCreationModalComponent);
    componentUnderTest = fixture.componentInstance;

    switcherMock = TestBed.inject(ComponentSwitcherDirective);
    switcherMock.goById = jasmine.createSpy('goById');
    switcherMock.sharedContext$ = of({}).pipe(map(() => fakeContext));

    policyManagerEventService = TestBed.inject(PolicyManagerEventService);
    policyManagerEventService.trackAddPolicyEvent = jasmine.createSpy('trackAddPolicyEvent');

    policiesFacadeService = TestBed.inject(PoliciesFacadeService);
    policiesFacadeService.getPolicyTypesSorted = jasmine.createSpy('getPolicyTypesSorted').and.returnValue(of([PolicyTypesEnum.Policy]));
  });

  it('should create', () => {
    expect(componentUnderTest).toBeTruthy();
  });

  describe('OnInit', () => {
    it('form should be created', async () => {
      // Arrange
      // Act
      await componentUnderTest.ngOnInit();

      // Assert
      expect(componentUnderTest.formGroup).toBeTruthy();
    });
  });

  describe('switchToSelectExistingView()', () => {
    it(`should call switcherMock.goById with ${AddItemModalEnum.SelectExisting}`, async () => {
      // Arrange
      // Act
      componentUnderTest.switchToSelectExistingView();

      // Assert
      expect(switcherMock.goById).toHaveBeenCalledWith(AddItemModalEnum.SelectExisting);
    });
  });

  describe('addNewItem()', () => {
    it(`should send ${UserEvents.ADD_POLICY} event and call switcherMock.goById with ${AddItemModalEnum.Success} on success`, async () => {
      // Arrange
      await componentUnderTest.ngOnInit();
      fakeContext.submitAction = resolve;
      componentUnderTest.formGroup.value.type = 'some-type';
      componentUnderTest.formGroup.value.name = 'some-name';

      // Act
      await componentUnderTest.addNewItem();

      // Assert
      expect(policyManagerEventService.trackAddPolicyEvent).toHaveBeenCalledWith(
        {
          policy_name: 'some-name',
          policy_type: 'some-type',
          status: ResourceStatusEnum.NOTSTARTED,
        },
        PolicyAddType.Created
      );
      expect(switcherMock.goById).toHaveBeenCalledWith(AddItemModalEnum.Success);
    });

    it(`should call switcherMock.goById with ${AddItemModalEnum.Error} on error`, async () => {
      // Arrange
      // Act
      fakeContext.submitAction = reject;
      await componentUnderTest.ngOnInit();
      await componentUnderTest.addNewItem();

      // Assert
      expect(switcherMock.goById).toHaveBeenCalledWith(AddItemModalEnum.Error);
    });
  });
});
