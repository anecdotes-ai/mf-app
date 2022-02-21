import { InviteUserEventsService } from './../../services/invite-user-events-service/invite-user-events.service';
import { InviteUserWindowInputKeys } from './constants/invite-user-modal-window.constants';
import { Service, Framework } from './../../../data/models/domain';
import { SubscriptionDetacher } from 'core/utils';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  Input,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { StatusType } from 'core/modules/modals';
import { InviteUserSource, RadioButtonModel } from 'core/models';
import { CheckBoxGroupControl, CheckBoxGroupItem, RadioButtonsGroupControl, TextFieldControl } from 'core/models/form';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher/directives';
import { RoleEnum, User } from 'core/modules/auth-core/models/domain';
import { OperationsTrackerService, TrackOperations, FrameworksFacadeService } from 'core/modules/data/services';
import { CreateUserAction } from 'core/modules/auth-core/store';
import { State } from 'core/modules/data/store';
import { CustomValidators, DynamicFormGroup } from 'core/modules/dynamic-form';
import { take } from 'rxjs/operators';
import { FormControlKeys, InviteUserModalIds } from '../../models';

@Component({
  selector: 'app-invite-user-modal',
  templateUrl: './invite-user-modal.component.html',
  styleUrls: ['./invite-user-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InviteUserModalComponent implements OnInit {
  @Input(InviteUserWindowInputKeys.plugin)
  plugin: Service;

  @Input(InviteUserWindowInputKeys.source)
  source: InviteUserSource;

  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  private checkBoxesForApplicableFrameworks: CheckBoxGroupItem[];

  @ViewChild('rolesDescription', { static: true })
  private rolesDescriptionsRef: TemplateRef<any>;

  readonly statusModalTypes = StatusType;

  readonly rolesDescriptionMapper: { role: string; translationKey: string }[] = [
    {
      role: RoleEnum.Admin,
      translationKey: this.buildTranslationKey('adminRoleDescription'),
    },
    {
      role: RoleEnum.Collaborator,
      translationKey: this.buildTranslationKey('collaboratorRoleDescription'),
    },
    {
      role: RoleEnum.It.toUpperCase(),
      translationKey: this.buildTranslationKey('itRoleDescription'),
    },
    {
      role: RoleEnum.Auditor,
      translationKey: this.buildTranslationKey('auditorRoleDescription'),
    },
  ];

  creatingInProgress: boolean;
  isInviteAuditor: boolean;

  formGroup: DynamicFormGroup<any>;

  get isFormGroupValid(): boolean {
    return this.formGroup.valid;
  }

  constructor(
    private store: Store<State>,
    private cd: ChangeDetectorRef,
    private operationTrackingService: OperationsTrackerService,
    private switcher: ComponentSwitcherDirective,
    private frameworksFacadeService: FrameworksFacadeService,
    private inviteUserEventsService: InviteUserEventsService
  ) {}

  ngOnInit(): void {
    this.createForm();

    if (this.switcher.sharedContext$) {
      this.switcher.sharedContext$
        .pipe(this.detacher.takeUntilDetach())
        .subscribe(({ selectedRole, selectedFramework }: { selectedRole: RoleEnum, selectedFramework: Framework }) => {
          if (selectedRole === RoleEnum.Admin || selectedRole === RoleEnum.It || selectedRole === RoleEnum.Auditor) {
            this.formGroup.items.role.setValue(selectedRole);
          }

          if (selectedFramework && selectedRole === RoleEnum.Auditor) {
            this.isInviteAuditor = true;
            this.formGroup.patchValue({
              [FormControlKeys.frameworks]: {
                [selectedFramework.framework_id]: true
              }
            });

            this.formGroup.items.frameworks.displayed = false;
            this.formGroup.items.role.displayed = false;
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  getTitle(): string {
   return this.buildTranslationKey(this.isInviteAuditor ? 'titleAuditor' :'title');
  }

  private resolveNoteTranslationKey(role: RoleEnum): string {
    switch (role) {
      case RoleEnum.Collaborator:
        return this.buildTranslationKey('collaboratorUsersNote');
      case RoleEnum.Admin:
        return this.buildTranslationKey('adminUsersNote');
      case RoleEnum.It:
        return this.buildTranslationKey('itUsersNote');
      default:
        break;
    }
  }

  private createForm(): void {
    this.formGroup = new DynamicFormGroup({
      [FormControlKeys.first_name]: new TextFieldControl({
        initialInputs: {
          label: this.buildTranslationKey('firstName'),
          validateOnDirty: true,
          required: true,
          errorTexts: {
            required: this.buildTranslationKey('fieldIsRequired'),
          },
        },
        validators: [Validators.required],
      }),
      [FormControlKeys.last_name]: new TextFieldControl({
        initialInputs: {
          label: this.buildTranslationKey('lastName'),
          validateOnDirty: true,
          required: true,
          errorTexts: {
            required: this.buildTranslationKey('fieldIsRequired'),
          },
        },
        validators: [Validators.required],
      }),
      [FormControlKeys.email]: new TextFieldControl({
        initialInputs: {
          label: this.buildTranslationKey('email'),
          validateOnDirty: true,
          required: true,
          errorTexts: {
            email: this.buildTranslationKey('emailIsInvalid'),
            required: this.buildTranslationKey('fieldIsRequired'),
          },
        },
        validators: [Validators.required, CustomValidators.emailCustomValidator],
      }),
      [FormControlKeys.role]: new RadioButtonsGroupControl({
        initialInputs: {
          label: this.buildTranslationKey('selectUserType'),
          infoTooltip: this.rolesDescriptionsRef,
          infoTooltipClass: 'invite-users-tooltip',
          infoTooltipPlacement: 'right-top',
          noteTranslationKey: () => this.resolveNoteTranslationKey(this.formGroup.controls[FormControlKeys.role].value),
          buttons: [
            {
              id: RoleEnum.Admin,
              value: RoleEnum.Admin,
              label: this.buildTranslationKey('adminOption'),
              icon: 'admin-user',
            } as RadioButtonModel,
            {
              id: RoleEnum.Collaborator,
              value: RoleEnum.Collaborator,
              label: this.buildTranslationKey('collaboratorOption'),
              icon: 'collaborator-user',
            } as RadioButtonModel,
            {
              id: RoleEnum.It,
              value: RoleEnum.It,
              label: this.buildTranslationKey('itOption'),
              icon: 'it-user',
            } as RadioButtonModel,
            {
              id: RoleEnum.Auditor,
              value: RoleEnum.Auditor,
              label: this.buildTranslationKey('auditorOption'),
              icon: 'user-types/auditor',
            } as RadioButtonModel,
          ],
        },
        validators: [Validators.required],
      }),
    });

    this.subscribeForFormValueChanges();
  }

  private subscribeForFormValueChanges(): void {
    this.formGroup.items.role.valueChanges.pipe(this.detacher.takeUntilDetach()).subscribe((valueChanged: string) => {
      if (valueChanged === RoleEnum.Auditor) {
        // If the checkboxes variable is undefined we execute dynamicSetFrameworkCheckboxes so then checkboxes variable is initialized (means we subscribe to pull frameworks once)
        if (!this.checkBoxesForApplicableFrameworks) {
          this.dynamicSetFrameworkCheckboxes();
        } else {
          this.setFrameworksCheckboxesGroupControl();
        }
      } else {
        this.removeFrameworksCheckboxesGroupControl();
      }
    });
  }

  private dynamicSetFrameworkCheckboxes(): void {
    this.frameworksFacadeService
      .getApplicableFrameworks()
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((frameworks) => {
        this.checkBoxesForApplicableFrameworks = [];
        frameworks.forEach((framework) => {
          this.checkBoxesForApplicableFrameworks.push({
            valueLabel: framework.framework_name,
            fieldName: framework.framework_id,
            value: false,
          });
        });

        if (this.formGroup.controls[FormControlKeys.frameworks]) {
          this.removeFrameworksCheckboxesGroupControl();
        }

        this.setFrameworksCheckboxesGroupControl();
      });
  }

  private setFrameworksCheckboxesGroupControl(): void {
    const checkboxGroup = this.getFrameworksFormControlGroupDefinition();
    this.formGroup.addControl(FormControlKeys.frameworks, checkboxGroup);
    this.cd.detectChanges();
  }

  private removeFrameworksCheckboxesGroupControl(): void {
    this.formGroup.removeControl(FormControlKeys.frameworks);
    this.cd.detectChanges();
  }

  private getFrameworksFormControlGroupDefinition(): CheckBoxGroupControl {
    return new CheckBoxGroupControl({
      initialInputs: {
        label: this.buildTranslationKey('selectFrameworks'),
        required: true,
        validateOnDirty: true,
        errorTexts: {
          required: this.buildTranslationKey('fieldIsRequired'),
        },
        checkboxes: this.checkBoxesForApplicableFrameworks,
      },
      validators: [Validators.required],
    });
  }

  async send(): Promise<void> {
    const delayedOperationCheckPromise = this.operationTrackingService
      .getOperationStatus('user', TrackOperations.CREATE_USER)
      .pipe(take(1))
      .toPromise();

    const newUserToCreate: User = {
      first_name: this.formGroup.value[FormControlKeys.first_name],
      last_name: this.formGroup.value[FormControlKeys.last_name],
      email: this.formGroup.value[FormControlKeys.email],
      role: this.formGroup.value[FormControlKeys.role],
    };
    if (this.formGroup.value[FormControlKeys.frameworks]) {
      newUserToCreate.audit_frameworks = Object.keys(this.formGroup.value[FormControlKeys.frameworks]);
    }

    this.store.dispatch(
      new CreateUserAction({
        user: newUserToCreate,
      })
    );
    this.creatingInProgress = true;
    this.cd.detectChanges();
    const response = await delayedOperationCheckPromise;
    this.creatingInProgress = false;
    this.cd.detectChanges();

    if (response instanceof HttpErrorResponse) {
      if (response.status === 409) {
        this.switcher.goById(InviteUserModalIds.InviteUserFailureAlreadyExisting);
      } else {
        this.switcher.goById(InviteUserModalIds.InviteUserGenericFailure);
      }
    } else if (response instanceof Error) {
      this.switcher.goById(InviteUserModalIds.InviteUserGenericFailure);
    } else {
      this.inviteUserEventsService.trackUserInvitation(
        this.formGroup.value[FormControlKeys.role],
        this.source,
        this.plugin,
        this.formGroup.value[FormControlKeys.frameworks]
          ? Object.keys(this.formGroup.value[FormControlKeys.frameworks])
          : null
      );
      this.switcher.goById(InviteUserModalIds.InviteUserSuccess);

    }
  }

  buildTranslationKey(relativeKey: string): string {
    return `userManagement.inviteUser.${relativeKey}`;
  }
}
