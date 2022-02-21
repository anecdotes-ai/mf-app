import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UserClaims } from 'core/modules/auth-core/models';
import { AuthService, RoleService } from 'core/modules/auth-core/services';
import { CalculatedControl } from 'core/modules/data/models';
import { ControlStatusEnum, Framework } from 'core/modules/data/models/domain';
import { ModalWindowService } from 'core/modules/modals';
import { ControlsFacadeService } from 'core/modules/data/services';
import { GeneralEventService } from 'core/services/general-event-service/general-event.service';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';
import { ControlStatusComponent } from './control-status.component';
import { IntercomService } from 'core/services';

describe('ControlStatusComponent', () => {
  configureTestSuite();

  let component: ControlStatusComponent;
  let fixture: ComponentFixture<ControlStatusComponent>;
  let roleService: RoleService;
  let authService: AuthService;
  let controlsFacade: ControlsFacadeService;
  let modalWindowService: ModalWindowService;
  let generalEventService: GeneralEventService;

  const fakeControl = {
    control_status: {
      status: ControlStatusEnum.GAP,
      updated_by: 'fake@fake.test',
    },
  } as CalculatedControl;

  let framework: Framework = {
    framework_name: 'some-name',
  };

  const fakeRole = {
    role: 'fake-role',
  };
  const fakeUser: UserClaims = {
    email: 'fake@fake.test',
  };
  const fakeControlId = 'fake-control-id';

  beforeAll(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [TranslateModule.forRoot()],
        providers: [
          { provide: ControlsFacadeService, useValue: {} },
          { provide: ModalWindowService, useValue: {} },
          { provide: GeneralEventService, useValue: {} },
          { provide: IntercomService, useValue: {} },
          {
            provide: RoleService,
            useValue: {
              getCurrentUserRole: () => of(fakeRole),
            },
          },
          {
            provide: AuthService,
            useValue: {
              getUserAsync: () => {
                return of(fakeUser).toPromise();
              },
            },
          },
          {
            provide: ControlsFacadeService,
            useValue: {
              getSingleControl: () => {
                return of(fakeControl);
              },
            },
          },
          {
            provide: ControlsFacadeService,
            useValue: {
              getControl: () => {
                return of(fakeControl);
              },
            },
          },
        ],
        declarations: [ControlStatusComponent],
      })
        .overrideComponent(ControlStatusComponent, {
          set: { changeDetection: ChangeDetectionStrategy.Default },
        })
        .compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlStatusComponent);
    component = fixture.componentInstance;
    component.calculatedControl = fakeControl;
    component.framework = framework;
    controlsFacade = TestBed.inject(ControlsFacadeService);
    authService = TestBed.inject(AuthService);
    roleService = TestBed.inject(RoleService);
    component.getButtonText = jasmine.createSpy('getButtonText');
    controlsFacade.getSingleControl = jasmine.createSpy('getSingleControl').and.callFake(() => of(fakeControl));
    controlsFacade.updateControlStatus = jasmine
      .createSpy('editCustomControl')
      .and.callFake(() => of(fakeControl).toPromise());
    authService.getUserAsync = jasmine.createSpy('getUserAsync').and.callFake(() => of(fakeUser).toPromise());
    roleService.getCurrentUserRole = jasmine.createSpy('getCurrentUserRole').and.callFake(() => of(fakeRole));

    modalWindowService = TestBed.inject(ModalWindowService);
    modalWindowService.openInSwitcher = jasmine.createSpy('openInSwitcher');
    generalEventService = TestBed.inject(GeneralEventService);
    generalEventService.trackControlStatusChangeEvent = jasmine.createSpy('trackControlStatusChange');
  });

  async function detectChanges(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('should create', async () => {
    // Arrange
    // Act
    await detectChanges();

    // Assert
    expect(component).toBeTruthy();
  });

  describe('#initialization process check for service methods', () => {
    it('should call getSingleControlMethod', async () => {
      // Arrange
      component.controlId = fakeControlId;

      // Act
      await detectChanges();

      // Assert
      expect(controlsFacade.getSingleControl).toHaveBeenCalled();
    });

    it('should call getCurrentUserRole method', async () => {
      // Arrange
      // Act
      await detectChanges();

      // Assert
      expect(roleService.getCurrentUserRole).toHaveBeenCalled();
    });

    it('should call getUserAsync method', async () => {
      // Arrange
      // Act
      await detectChanges();

      // Assert
      expect(authService.getUserAsync).toHaveBeenCalled();
    });

    it('should call getButtonText method for appColoredDropDownMenus buttonText input', async () => {
      // Arrange
      // Act
      await detectChanges();

      // Assert
      expect(component.getButtonText).toHaveBeenCalled();
    });
  });

  describe('#initialization process for component fields', () => {
    it('should set calculatedControl with value', async () => {
      // Arrange
      // Act
      await detectChanges();

      // Assert
      expect(component.calculatedControl).toBeDefined();
    });

    it('should set buttonBGClass', async () => {
      // Arrange

      // Act
      await detectChanges();

      // Assert
      expect(component.buttonBGClass).toBeDefined();
    });
  });

  describe('setNewStatus()', () => {
    const menuActionIndex = 3;

    it('should call controlsFacade.editCustomControl and trackControlStatusChangeEvent after menu action was called', async () => {
      // Arrange
      // Act
      await detectChanges();
      await component.menuActions[menuActionIndex].action();

      // Assert
      expect(controlsFacade.updateControlStatus).toHaveBeenCalled();
      expect(generalEventService.trackControlStatusChangeEvent).toHaveBeenCalledWith(
        framework,
        fakeControl,
        ControlStatusEnum.GAP,
        ControlStatusEnum.INPROGRESS
      );
    });

    it('should call setMenuButtonBGClass() after menu action was called', async () => {
      // Arrange
      component.setMenuButtonBGClass = jasmine.createSpy('setMenuButtonBGClass');

      // Act
      await detectChanges();
      await component.menuActions[menuActionIndex].action();

      // Assert
      expect(component.setMenuButtonBGClass).toHaveBeenCalled();
    });
  });

  describe('Dropdown Menu', () => {
    it(`shoud have only gap if not started`, async () => {
      fakeControl.control_status = { status: ControlStatusEnum.NOTSTARTED };
      fakeControl.control_has_all_evidence_collected = false;
      await detectChanges();
      expect((<any>component).controlHasEvidenceCollected).toBeFalsy();
    });
  });
});
