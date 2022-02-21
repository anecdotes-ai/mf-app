import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Service, Framework} from 'core/modules/data/models/domain';
import { FrameworksFacadeService } from 'core/modules/data/services';
import { SubscriptionDetacher } from 'core/utils';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-frameworks-plugins-list-item',
  templateUrl: './frameworks-plugins-list-item.component.html',
  styleUrls: ['./frameworks-plugins-list-item.component.scss'],
})
export class FrameworksPluginsListItemComponent implements OnInit, OnDestroy {
  private detacher = new SubscriptionDetacher();
  private translationKey = 'frameworksPlugins.frameworksPluginsList.pluginsListItem';
  private _framework: Framework;

  @Input() plugin: Service;
  @Input() frameworkId: string;

  toggleControl: FormControl;

  constructor(private frameworkFacade: FrameworksFacadeService) {}

  ngOnInit(): void {
    this.toggleControl = new FormControl();
    this.frameworkFacade
      .getFrameworkById(this.frameworkId)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((framework) => {
        this._framework = framework;
        const valueForControl = this.isPluginIncluded();

        if (this.toggleControl.value !== valueForControl) {
          this.toggleControl.setValue(valueForControl, { emitEvent: false });
        }
      });
    this.toggleControl.valueChanges.pipe(this.detacher.takeUntilDetach()).subscribe((value) => {
      if (value && !this.isPluginIncluded()) {
        this.frameworkFacade.includePluginAsync(this._framework.framework_id, this.plugin.service_id);
      } else {
        this.frameworkFacade.excludePluginAsync(this._framework.framework_id, this.plugin.service_id);
      }
    });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(key: string): string {
    return `${this.translationKey}.${key}`;
  }

  private isPluginIncluded(): boolean {
    return !(this.plugin.service_id in this._framework.framework_excluded_plugins);
  }
}
