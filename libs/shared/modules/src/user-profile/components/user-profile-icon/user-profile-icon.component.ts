import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-profile-icon',
  templateUrl: './user-profile-icon.component.html',
  styleUrls: ['./user-profile-icon.component.scss'],
})
export class UserProfileIconComponent {
  @Input() iconWidthPx = 46;
  @Input() iconHeightPx = 46;

  @Input() avatarLink: string;

  @Input() iconInstanceName = 'icon1';
}
