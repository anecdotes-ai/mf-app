import { Component, ElementRef, HostBinding, Input, ViewChild } from '@angular/core';
import { NavigationModel } from '../../models';
import { SubMenuPositionY } from '../../models/navigation.model';
import { NavigationBarEventsTrackingService } from 'core/modules/navigation-bar/services/navigation-bar-events-tracking.service';
import { MenuAction } from 'core/modules/dropdown-menu';

@Component({
  selector: 'app-navigation-bar-item',
  templateUrl: './navigation-bar-item.component.html',
  styleUrls: ['./navigation-bar-item.component.scss'],
})
export class NavigationBarItemComponent {
  @HostBinding('class')
  private classes = 'block relative cursor-pointer';

  @ViewChild('navigationLink')
  navigationLink: ElementRef<HTMLElement>;

  @Input()
  item: NavigationModel;

  @Input()
  insideIconText: string;

  @Input()
  listWidth: 'small' | 'medium' = 'medium';

  @Input()
  @HostBinding('class.disabled')
  isDisabled?: boolean;

  subMenuPositionYEnum = SubMenuPositionY;

  constructor(private navigationBarEventsTrackingService: NavigationBarEventsTrackingService) {
  }

  buildTranslationKey(relativeKey: string): string {
    return `navigation.${relativeKey}`;
  }

  onNavigationElementClick(item: MenuAction): void {
    const keys = item.translationKey.split('.');
    const source = `${this.item.key}/${keys.length === 1 ? keys[0] : keys[keys.length - 1]}`;
    this.navigationBarEventsTrackingService.trackNavigationElementClick({route: source});
  }
}
