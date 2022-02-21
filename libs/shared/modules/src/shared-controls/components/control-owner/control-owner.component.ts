import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InviteUserSource } from 'core/models/user-events/user-event-data.model';
import { RoleEnum, User } from 'core/modules/auth-core/models/domain';
import { UserFacadeService } from 'core/modules/auth-core/services';
import { CalculatedControl } from 'core/modules/data/models';
import { Framework } from 'core/modules/data/models/domain';
import { ControlsFacadeService } from 'core/modules/data/services';
import { GeneralEventService } from 'core/services/general-event-service/general-event.service';
import { SubscriptionDetacher } from 'core/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-control-owner',
  templateUrl: './control-owner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlOwnerComponent implements OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @HostBinding('class.not-owner')
  private isNoOwner: boolean;

  private controlInstance: CalculatedControl;

  @Input() framework: Framework;
  @Input() controlId: string;
  @Input() readonly: boolean;
  @Input() isDisabled: boolean;

  usersStream$: Observable<User[]>;
  source = InviteUserSource.ControlOwner;
  formControl: FormControl;
  currentUserEmail$: Observable<string>;
  loading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private generalEventService: GeneralEventService,
    private controlsFacade: ControlsFacadeService,
    private userFacade: UserFacadeService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.formControl = new FormControl();
    this.controlsFacade
      .getControl(this.controlId)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((control) => {
        this.controlInstance = control;
        this.isNoOwner = !control.control_owner;
        this.formControl.setValue(control.control_owner, { emitEvent: false });
        this.cd.detectChanges();
        this.cd.markForCheck();
      });

    this.formControl.valueChanges
      .pipe(this.detacher.takeUntilDetach())
      .pipe(filter((owner) => owner !== undefined && owner !== this.controlInstance.control_owner))
      .subscribe((email: string) => {
        this.selectOwnerAsync(email);
      });

    this.usersStream$ = this.userFacade.getUsers().pipe(map((users) => this.filterUsers(users)));
    this.currentUserEmail$ = this.userFacade.getCurrentUser().pipe(map((user) => user.email));
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  private filterUsers(users: User[]): User[] {
    return users.filter(
      (user) =>
        user.role !== RoleEnum.It &&
        (!user.audit_frameworks.length ||
          user.audit_frameworks.find((frameworkId) => this.framework?.framework_id === frameworkId))
    );
  }

  private async selectOwnerAsync(selectedUserEmail: string): Promise<void> {
    this.loading$.next(true);
    await this.controlsFacade.updateControlOwner(this.controlId, selectedUserEmail || '');
    this.generalEventService.trackSelectControlOwnerEvent(this.framework, this.controlInstance);
    this.loading$.next(false);
  }
}
