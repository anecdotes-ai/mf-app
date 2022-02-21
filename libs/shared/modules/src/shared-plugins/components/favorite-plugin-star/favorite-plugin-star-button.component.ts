import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { PluginFacadeService } from 'core/modules/data/services';
import { SubscriptionDetacher } from 'core/utils';

@Component({
  selector: 'app-favorite-plugin-star-button',
  templateUrl: './favorite-plugin-star-button.component.html',
  styleUrls: ['./favorite-plugin-star-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritePluginStarButtonComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @HostBinding('attr.role')
  private role = 'button';

  @Input()
  pluginId: string;

  isPluginFavorite: boolean;

  constructor(private pluginFacade: PluginFacadeService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.pluginFacade
      .getServiceById(this.pluginId)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((plugin) => {
        this.isPluginFavorite = plugin.service_is_favorite;
        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  private togglePluginFavoriteState(): void {
    if (this.isPluginFavorite) {
      this.pluginFacade.removePluginFromFavorites(this.pluginId);
    } else {
      this.pluginFacade.addPluginToFavorites(this.pluginId);
    }
    this.cd.detectChanges();
  }

  @HostListener('click')
  private onMouseClick(): void {
    this.togglePluginFavoriteState();
  }

  @HostListener('mousedown', ['$event'])
  private onMouseDown(event: MouseEvent): void {
    event.stopPropagation();
  }
}
