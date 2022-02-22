import { ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RoleEnum, User } from 'core/modules/auth-core/models/domain';
import { UserFacadeService } from 'core/modules/auth-core/services';
import { RiskFacadeService } from 'core/modules/risk/services';
import { SubscriptionDetacher } from 'core/utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-risk-owner',
  templateUrl: './risk-owner.component.html'
})
export class RiskOwnerComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @HostBinding('class.not-owner')
  private isNoOwner: boolean;

  usersStream$: Observable<User[]>;
  formControl: FormControl;
  currentUserEmail$: Observable<string>;

  @Input()
  riskId: string;

  constructor(
    private riskFacade: RiskFacadeService,
    private userFacade: UserFacadeService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.formControl = new FormControl();
    this.riskFacade
      .getRiskById(this.riskId)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((risk) => {
        this.isNoOwner = !risk.owner;
        this.formControl.setValue(risk.owner, { emitEvent: false });
        this.cd.detectChanges();
        this.cd.markForCheck();
      });

    this.formControl.valueChanges
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((email: string) => this.selectOwner(email));

    this.usersStream$ = this.userFacade.getUsers().pipe(map((users) => this.filterUsers(users)));
    this.currentUserEmail$ = this.userFacade.getCurrentUser().pipe(map((user) => user.email));
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  private filterUsers(users: User[]): User[] {
    return users.filter(u => u.role === RoleEnum.Admin || u.role === RoleEnum.Collaborator);
  }

  private selectOwner(selectedUserEmail: string): void {
    this.riskFacade.updateRiskOwnerAsync(this.riskId, selectedUserEmail);
  }
}
