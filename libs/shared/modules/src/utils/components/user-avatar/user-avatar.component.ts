import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAvatarComponent {
  private _logoId: string;

  @HostBinding('class')
  private classes = 'inline-block relative font-main text-base';

  @Input()
  firstName: string;

  @Input()
  lastName: string;

  @Input()
  fullName: string;

  @Input()
  avatarUrl: string;
  
  get logoId(): string {
    if(!this._logoId) {
      this._logoId = uuidv4();
    }

    return this._logoId;
  }

  getFullName(): string {
    if (this.fullName) {
      return this.fullName;
    }

    return [this.firstName, this.lastName].filter(s => !!s).map(s => s.trim()).join(' ');
  }

  getInitials(): string {
    const fullName = this.getFullName();

    if (!fullName) {
      return '';
    }

    const splitted = fullName.split(' ');
    let result: string;

    if (splitted.length === 2) {
      result = splitted[0].substring(0, 1) + splitted[1].substring(0, 1);
    } else {
      result = splitted[0].substring(0, 1);
    }

    return result.toLocaleUpperCase();
  }
}
