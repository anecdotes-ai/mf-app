import { ComponentSwitcherDirective } from 'core/modules/component-switcher';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ItemEditModalComponent } from 'core/modules/customization/components';
import { EditItemModalEnum, ItemSharedContext } from 'core/modules/customization/models';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageBusService } from 'core';
import { ModalWindowService } from 'core/modules/modals';
import { ResourceStatusEnum } from 'core/modules/data/models';
import { PolicyManagerEventService } from 'core/services/policy-manager-event-service/policy-manager-event.service';
import { PoliciesFacadeService } from 'core/modules/data/services/facades/policies-facade/policies-facade.service';
import { PolicyTypesEnum } from 'core/modules/data/models';

describe('ItemEditModalComponent', () => {
  let component: ItemEditModalComponent<any>;
  let fixture: ComponentFixture<ItemEditModalComponent<any>>;
  let switcherMock: ComponentSwitcherDirective;
  let policyManagerEventService: PolicyManagerEventService;
  let policiesFacadeService: PoliciesFacadeService;

  let resolve = (): Promise<void> => Promise.resolve();
  let reject = (): Promise<void> => Promise.reject();
  let fakeContext: ItemSharedContext = {
    item: {
      name: 'some-name',
      type: 'some-type',
      description: 'description',
      status: ResourceStatusEnum.APPROVED
    },
    translationKey: 'fakeTranslationKey',
    submitAction: resolve,
  };
  let modalService: ModalWindowService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemEditModalComponent],
      providers: [
        { provide: ComponentSwitcherDirective, useValue: {} },
        { provide: MessageBusService, useValue: {} },
        { provide: PolicyManagerEventService, useValue: {} },
        { provide: PoliciesFacadeService, useValue: {} },
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemEditModalComponent);
    component = fixture.componentInstance;

    switcherMock = TestBed.inject(ComponentSwitcherDirective);
    switcherMock.sharedContext$ = of({}).pipe(map(() => fakeContext));
    switcherMock.goById = jasmine.createSpy('goById');

    modalService = TestBed.inject(ModalWindowService);
    modalService.close = jasmine.createSpy('close');

    policyManagerEventService = TestBed.inject(PolicyManagerEventService);
    policyManagerEventService.trackUpdatePolicyEvent = jasmine.createSpy('trackUpdatePolicyEvent');

    policiesFacadeService = TestBed.inject(PoliciesFacadeService);
    policiesFacadeService.getPolicyTypesSorted = jasmine.createSpy('getPolicyTypesSorted').and.returnValue(of([PolicyTypesEnum.Policy]));
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#OnInit', () => {
    it('form should be created', async () => {
      // Arrange
      // Act
      await component.ngOnInit();

      // Assert
      expect(component.formGroup).toBeTruthy();
    });
  });

  describe('close() method', () => {
    it('should call modalWindowService.close() method', async () => {
      // Arrange
      // Act
      component.close();

      // Assert
      expect(modalService.close).toHaveBeenCalled();
    });
  });

  describe('updateFormBtnClick() method', () => {
    it(`should call switcherMock.goById() with ${EditItemModalEnum.SuccessModal}`, async () => {
      // Arrange
      await component.ngOnInit();

      // Act
      await component.updateFormBtnClick();

      // Assert
      expect(policyManagerEventService.trackUpdatePolicyEvent).toHaveBeenCalledWith({
        policy_name: component.formGroup.value.name,
        policy_type: component.formGroup.value.type,
        status: ResourceStatusEnum.APPROVED,
      });
      expect(switcherMock.goById).toHaveBeenCalledWith(EditItemModalEnum.SuccessModal);
    });

    it(`should call switcherMock.goById() with ${EditItemModalEnum.ErrorModal}`, async () => {
      // Arrange
      fakeContext.submitAction = reject;
      await component.ngOnInit();

      // Act
      await component.updateFormBtnClick();

      // Assert
      expect(switcherMock.goById).toHaveBeenCalledWith(EditItemModalEnum.ErrorModal);
    });
  });
});
