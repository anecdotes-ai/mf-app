import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/domain';
import { UserFacadeService } from '../../services';

@Component({
  selector: 'app-user-logo',
  templateUrl: './user-logo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserLogoComponent implements OnChanges {
  @Input()
  userId: string;

  @Input()
  fallbackUserName: string;

  user$: Observable<User>;

  constructor(private userFacadeService: UserFacadeService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('userId' in changes) {
      this.user$ = (this.userId) ? this.userFacadeService.getUser(this.userId) : undefined;
    }
  }
}
