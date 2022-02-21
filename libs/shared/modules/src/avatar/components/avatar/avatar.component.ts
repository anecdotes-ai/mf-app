import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnChanges {
  
  firstLettersRegExp = /\b(\w)/g;

  @Input()
  name: string;

  insideIconText: string;
  icon: string;

  ngOnChanges(changes: SimpleChanges): void {
    if ('name' in changes) {
      if(this.name) {
        this.setAvatar('user-icon-logo', this.name);
      } else {
        this.setAvatar('empty-avatar', '');
      }
    }
  }

  private setAvatar(logoName: string, name: string): void {
    this.icon = logoName;
    this.insideIconText = name.match(this.firstLettersRegExp)?.slice(0, 2)?.join('').toUpperCase();
  }
}
