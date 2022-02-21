import { InviteUserEventsService } from './../../services/invite-user-events-service/invite-user-events.service';
import { Framework } from 'core/modules/data/models/domain';
/* tslint:disable:no-unused-variable */
import { HttpErrorResponse } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent, RadioButtonsGroupControl, TextFieldControl } from 'core';
import { UserEventService } from 'core/services/user-event/user-event.service';
import { BaseModalComponent } from 'core/modules/modals';
import { DynamicFormOutletMockComponent } from 'core/mocks';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher/directives';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { FrameworksFacadeService, OperationsTrackerService, TrackOperations } from 'core/modules/data/services';
import { State } from 'core/modules/data/store';
import { CreateUserAction } from 'core/modules/auth-core/store';
import { configureTestSuite } from 'ng-bullet';
import { Observable, of, Subject } from 'rxjs';
import { FormControlKeys, InviteUserModalIds } from '../../models';
import { InviteUserModalComponent } from './invite-user-modal.component';
import { InviteUserSource } from 'core/models/user-events/user-event-data.model';

class MockSwitcherDir {
  public sharedContext$ = new Subject<{ selectedRole: RoleEnum }>();

  goById = jasmine.createSpy('goById');
}

describe('InviteUserModalComponent', () => {
  configureTestSuite();

  let component: InviteUserModalComponent;
  let fixture: ComponentFixture<InviteUserModalComponent>;
  let operationTrackerService: OperationsTrackerService;
  let store: Store<State>;
  let switcher: MockSwitcherDir;
  let frameworkFacade: FrameworksFacadeService;
  let inviteUserEventsService: InviteUserEventsService;

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
  }

  function getSendButton(): DebugElement {
    return fixture.debugElement.query(By.css('#create-user-btn'));
  }

  beforeAll(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [InviteUserModalComponent, DynamicFormOutletMockComponent, ButtonComponent, BaseModalComponent],
      providers: [
        { provide: ComponentSwitcherDirective, useClass: MockSwitcherDir },
        { provide: UserEventService, useValue: {} },
        {
          provide: FrameworksFacadeService,
          useValue: {
            getApplicableFrameworks(): Observable<Framework[]> {
              return of([]);
            },
          },
        },
        provideMockStore(),
        {
          provide: OperationsTrackerService,
          useValue: {},
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteUserModalComponent);
    component = fixture.componentInstance;
    operationTrackerService = TestBed.inject(OperationsTrackerService);
    store = TestBed.inject(Store);
    switcher = TestBed.inject(ComponentSwitcherDirective) as any;
    frameworkFacade = TestBed.inject(FrameworksFacadeService);

    inviteUserEventsService = TestBed.inject(InviteUserEventsService);
    inviteUserEventsService.trackUserInvitation = jasmine.createSpy('trackUserInvitation');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('formGroup', () => {
    it('should be passed into dynamic form group outlet component', async () => {
      // Act
      await detectChanges();

      // Assert
      expect(
        (fixture.debugElement.query(By.directive(DynamicFormOutletMockComponent))
          .componentInstance as DynamicFormOutletMockComponent).dynamicFormGroup
      ).toBe(component.formGroup);
    });

    it('should have first_name textfield control', async () => {
      // Act
      await detectChanges();

      // Assert
      expect(component.formGroup.controls[FormControlKeys.first_name]).toBeInstanceOf(TextFieldControl);
    });

    it('should have last_name textfield control', async () => {
      // Act
      await detectChanges();

      // Assert
      expect(component.formGroup.controls[FormControlKeys.last_name]).toBeInstanceOf(TextFieldControl);
    });

    it('should have email textfield control', async () => {
      // Act
      await detectChanges();

      // Assert
      expect(component.formGroup.controls[FormControlKeys.email]).toBeInstanceOf(TextFieldControl);
    });

    it('should have role textfield control', async () => {
      // Act
      await detectChanges();

      // Assert
      expect(component.formGroup.controls[FormControlKeys.role]).toBeInstanceOf(RadioButtonsGroupControl);
    });
  });

  describe('ngOnInit', () => {
    it('should update formGroup role field if selectedRole passed in sharedContext', async () => {
      // Act
      await detectChanges();
      switcher.sharedContext$.next({ selectedRole: RoleEnum.It });

      // Assert
      expect(component.formGroup.items.role.value).toEqual(RoleEnum.It);
    });
  });

  describe('roleDescriptionMapper', () => {
    it(`mapper for description tooltip should be created with ${RoleEnum.It.toUpperCase()} role and expected translationKey`, async () => {
      // Act
      await detectChanges();

      // Assert
      const userMapperData = component.rolesDescriptionMapper.find((x) => x.role === RoleEnum.It.toUpperCase());
      expect(userMapperData?.role).toEqual(RoleEnum.It.toUpperCase());
      expect(userMapperData?.translationKey).toEqual(component.buildTranslationKey('itRoleDescription'));
    });

    it(`mapper for description tooltip should be created with ${RoleEnum.Admin.toUpperCase()} role and expected translationKey`, async () => {
      // Act
      await detectChanges();

      // Assert
      const userMapperData = component.rolesDescriptionMapper.find((x) => x.role === RoleEnum.Admin);
      expect(userMapperData?.role).toEqual(RoleEnum.Admin);
      expect(userMapperData?.translationKey).toEqual(component.buildTranslationKey('adminRoleDescription'));
    });

    it(`mapper for description tooltip should be created with ${RoleEnum.Auditor.toUpperCase()} role and expected translationKey`, async () => {
      // Act
      await detectChanges();

      // Assert
      const userMapperData = component.rolesDescriptionMapper.find((x) => x.role === RoleEnum.Auditor);
      expect(userMapperData?.role).toEqual(RoleEnum.Auditor);
      expect(userMapperData?.translationKey).toEqual(component.buildTranslationKey('auditorRoleDescription'));
    });

    it(`mapper for description tooltip should be created with ${RoleEnum.Collaborator.toUpperCase()} role and expected translationKey`, async () => {
      // Act
      await detectChanges();

      // Assert
      const userMapperData = component.rolesDescriptionMapper.find((x) => x.role === RoleEnum.Collaborator);
      expect(userMapperData?.role).toEqual(RoleEnum.Collaborator);
      expect(userMapperData?.translationKey).toEqual(component.buildTranslationKey('collaboratorRoleDescription'));
    });
  });

  describe('send function', () => {
    let operataionStatusObservable: Observable<any>;

    beforeEach(() => {
      operationTrackerService.getOperationStatus = jasmine
        .createSpy('getOperationStatus')
        .and.callFake(() => operataionStatusObservable);
      operataionStatusObservable = of({});
    });

    it('should get operation status observable from operation tracker', async () => {
      // Arrange
      // Act
      await detectChanges();
      await component.send();

      // Assert
      expect(operationTrackerService.getOperationStatus).toHaveBeenCalledWith('user', TrackOperations.CREATE_USER);
    });

    it('should go to switcher modal InviteUserModalIds.InviteUserSuccess when operation is success', async () => {
      // Arrange
      operataionStatusObservable = of({});

      // Act
      await detectChanges();
      await component.send();

      // Assert
      expect(switcher.goById).toHaveBeenCalledWith(InviteUserModalIds.InviteUserSuccess);
    });

    it('should go to switcher modal InviteUserModalIds.InviteUserGenericFailure when operation is failed with Error', async () => {
      // Arrange
      operataionStatusObservable = of(new Error());

      // Act
      await detectChanges();
      await component.send();

      // Assert
      expect(switcher.goById).toHaveBeenCalledWith(InviteUserModalIds.InviteUserGenericFailure);
    });

    it('should go to switcher modal InviteUserModalIds.InviteUserGenericFailure when operation is failed with HttpErrorResponse', async () => {
      // Arrange
      operataionStatusObservable = of(new HttpErrorResponse({}));

      // Act
      await detectChanges();
      await component.send();

      // Assert
      expect(switcher.goById).toHaveBeenCalledWith(InviteUserModalIds.InviteUserGenericFailure);
    });

    it('should go to switcher modal InviteUserModalIds.InviteUserFailureAlreadyExisting when operation is failed with HttpErrorResponse with status 409', async () => {
      // Arrange
      operataionStatusObservable = of(new HttpErrorResponse({ status: 409 }));

      // Act
      await detectChanges();
      await component.send();

      // Assert
      expect(switcher.goById).toHaveBeenCalledWith(InviteUserModalIds.InviteUserFailureAlreadyExisting);
    });

    it('should dispatch create user action', async () => {
      // Arrange
      await detectChanges();

      spyOn(store, 'dispatch');
      component.formGroup.setValue({
        [FormControlKeys.first_name]: 'cop',
        [FormControlKeys.last_name]: 'top',
        [FormControlKeys.email]: 'cop@top',
        [FormControlKeys.role]: 'someRole',
      });

      // Act
      await component.send();

      // Assert
      expect(store.dispatch).toHaveBeenCalledWith(
        new CreateUserAction({
          user: {
            first_name: component.formGroup.value[FormControlKeys.first_name],
            last_name: component.formGroup.value[FormControlKeys.last_name],
            email: component.formGroup.value[FormControlKeys.email],
            role: component.formGroup.value[FormControlKeys.role],
          },
        })
      );
    });

    it('should dispatch create Auditor user with selected frameworks', async () => {
      // Arrange
      const testFrameworks: Framework[] = [
        { framework_id: '12345', framework_name: 'First Framework', is_applicable: true },
        { framework_id: '54321', framework_name: 'Second Framework', is_applicable: true },
      ];
      frameworkFacade.getApplicableFrameworks = jasmine
        .createSpy('getApplicableFrameworks')
        .and.returnValue(of(testFrameworks));
      await detectChanges();

      spyOn(store, 'dispatch');
      component.formGroup.setValue({
        [FormControlKeys.first_name]: 'cop',
        [FormControlKeys.last_name]: 'top',
        [FormControlKeys.email]: 'cop@top',
        [FormControlKeys.role]: 'auditor',
      });

      expect(component.formGroup.controls[FormControlKeys.frameworks]).toBeTruthy();

      component.formGroup.controls[FormControlKeys.frameworks].setValue(testFrameworks[0].framework_id);

      // Act
      await component.send();

      // Assert
      expect(store.dispatch).toHaveBeenCalledWith(
        new CreateUserAction({
          user: {
            first_name: component.formGroup.value[FormControlKeys.first_name],
            last_name: component.formGroup.value[FormControlKeys.last_name],
            email: component.formGroup.value[FormControlKeys.email],
            role: component.formGroup.value[FormControlKeys.role],
            audit_frameworks: Object.keys(component.formGroup.value[FormControlKeys.frameworks]),
          },
        })
      );
    });

    it('should call trackUserInvitation with proper parameters', async () => {
      // Arrange
      component.source = InviteUserSource.ControlOwner;
      component.plugin = {service_id : 'id'};
      
      // Act
      await detectChanges();
      await component.send();

      // Assert
      expect(inviteUserEventsService.trackUserInvitation).toHaveBeenCalledWith(
        component.formGroup.value[FormControlKeys.role],
        component.source,
        component.plugin,
        null
      );
    });
  });

  describe('creatingInProgress property', () => {
    it('should be passed to "loading" input for send button with true', async () => {
      // Arrange
      component.creatingInProgress = true;

      // Act
      await detectChanges();
      const button: ButtonComponent = getSendButton().componentInstance;

      // Assert
      expect(button.loading).toBeTrue();
    });

    it('should be passed to "loading" input for send button with false', async () => {
      // Arrange
      component.creatingInProgress = false;

      // Act
      await detectChanges();
      const button: ButtonComponent = getSendButton().componentInstance;

      // Assert
      expect(button.loading).toBeFalse();
    });
  });

  describe('send button', () => {
    it('should be created', async () => {
      await detectChanges();

      // Assert
      expect(getSendButton()).toBeTruthy();
    });

    it('should have id', async () => {
      await detectChanges();

      // Assert
      expect(getSendButton().nativeElement.id).toBe('create-user-btn');
    });

    it('should have disabled class when formGroup is invalid', async () => {
      // Arrange
      await detectChanges();

      spyOnProperty(component.formGroup, 'invalid').and.returnValue(true);
      spyOnProperty(component.formGroup, 'valid').and.returnValue(false);

      // Act
      await detectChanges();
      // Assert
      expect(getSendButton().classes['disabled']).toBeTrue();
    });

    // Has to be fixed
    // it('should not have disabled class when formGroup is valid', async () => {
    //   // Arrange
    //   await detectChanges();
    //   spyOnProperty(component.formGroup, 'invalid').and.returnValue(false);

    //   // Act
    //   await detectChanges();

    //   // Assert
    //   const classss = getSendButton().classes;
    //   expect(classss['disabled']).toBeUndefined();
    // });
  });

  describe('buildTranslationKey', () => {
    it('should return full key based on relative', () => {
      // Arrange
      const relativeKey = 'someKey';

      // Act
      const actualFullKey = component.buildTranslationKey(relativeKey);

      // Assert
      expect(actualFullKey).toBe(`userManagement.inviteUser.${relativeKey}`);
    });
  });
});
