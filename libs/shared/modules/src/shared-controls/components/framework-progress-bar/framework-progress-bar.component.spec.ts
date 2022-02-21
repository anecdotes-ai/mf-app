/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ControlsFacadeService } from 'core/modules/data/services';
import { FrameworkProgressBarComponent } from './framework-progress-bar.component';
import { AuthService, UserFacadeService } from 'core/modules/auth-core/services';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { UserClaims } from 'core/modules/auth-core/models';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { CalculatedControl } from 'core/modules/data/models';
import { ControlStatusEnum } from 'core/modules/data/models/domain';

describe('FrameworkProgressBarComponent', () => {
  let component: FrameworkProgressBarComponent;
  let fixture: ComponentFixture<FrameworkProgressBarComponent>;

  let controlsFacadeServiceMock: ControlsFacadeService;
  let userFacadeServiceMock: UserFacadeService;
  let authServiceMock: AuthService;
  let fakeFrameworkId: string;
  let fakeControls = [
    {
      control_is_applicable: true,
      control_status: {
        status: ControlStatusEnum.APPROVED_BY_AUDITOR,
      },
    },
    {
      control_is_applicable: true,
      control_status: {
        status: ControlStatusEnum.APPROVED_BY_AUDITOR,
      },
    },
    {
      control_is_applicable: true,
      control_status: {
        status: ControlStatusEnum.APPROVED_BY_AUDITOR,
      },
    },
    {
      control_is_applicable: false,
      control_status: {
        status: ControlStatusEnum.APPROVED_BY_AUDITOR,
      },
    },
    {
      control_is_applicable: false,
      control_status: {
        status: ControlStatusEnum.READY_FOR_AUDIT,
      },
    },
    {
      control_is_applicable: false,
      control_status: {
        status: ControlStatusEnum.READY_FOR_AUDIT,
      },
    },
    {
      control_is_applicable: true,
      control_status: {
        status: ControlStatusEnum.READY_FOR_AUDIT,
      },
    },
  ] as CalculatedControl[];

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [FrameworkProgressBarComponent],
        providers: [
          { provide: ControlsFacadeService, useValue: {} },
          { provide: UserFacadeService, useValue: {} },
          { provide: AuthService, useValue: {} },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameworkProgressBarComponent);
    component = fixture.componentInstance;
    controlsFacadeServiceMock = TestBed.inject(ControlsFacadeService);
    userFacadeServiceMock = TestBed.inject(UserFacadeService);
    authServiceMock = TestBed.inject(AuthService);

    fakeFrameworkId = 'fake-framework-id';
    component.frameworkId = fakeFrameworkId;
    controlsFacadeServiceMock.getControlsByFrameworkId = jasmine
      .createSpy('getControlsByFrameworkId')
      .and.callFake(() => of([]));
    userFacadeServiceMock.auditorsExist = jasmine.createSpy('auditorsExist').and.callFake(() => of(false));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit', () => {
    it('applicable controls should be displayed normally for any control status', async () => {
      // Arrange
      authServiceMock.getUserAsync = jasmine
        .createSpy('getUserAsync')
        .and.returnValue(of({ role: RoleEnum.Admin } as UserClaims));

      controlsFacadeServiceMock.getControlsByFrameworkId = jasmine
        .createSpy('getControlsByFrameworkId')
        .and.returnValue(of(fakeControls));

      // Act
      fixture.detectChanges();
      await fixture.whenStable();
      const actualValue = await component.controls$.pipe(take(1)).toPromise();

      // Assert
      expect(actualValue.some((control) => control.control_is_applicable === false)).toBeFalse();
    });
  });
});
