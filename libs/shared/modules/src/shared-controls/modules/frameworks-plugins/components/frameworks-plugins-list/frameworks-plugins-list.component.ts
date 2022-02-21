import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Service, Framework } from 'core/modules/data/models/domain';
import { ControlsFacadeService, FrameworksFacadeService } from 'core/modules/data/services';
import { SubscriptionDetacher } from 'core/utils';

@Component({
  selector: 'app-frameworks-plugins-list-component',
  templateUrl: './frameworks-plugins-list.component.html',
  styleUrls: ['./frameworks-plugins-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FrameworksPluginsListComponent implements OnInit, OnDestroy {
  private translationKey = 'frameworksPlugins.frameworksPluginsList';
  private detacher = new SubscriptionDetacher();

  @Input() frameworkId: string;

  framework: Framework;

  constructor(
    private frameworkFacade: FrameworksFacadeService,
    private controlsFacade: ControlsFacadeService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getFrameworkByCurrentId();
  }

  ngOnDestroy(): void {
    this.detacher.detach();
    this.controlsFacade.reloadControls();
  }

  buildTranslationKey(key: string): string {
    return `${this.translationKey}.${key}`;
  }

  activateAllPlugins(): void {
    this.frameworkFacade.includeAllPlugins(this.frameworkId);
  }

  selectServiceId(plugin: Service): string {
    return plugin.service_id;
  }

  private getFrameworkByCurrentId(): void {
    this.frameworkFacade
      .getFrameworkById(this.frameworkId)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((framework: Framework) => {
        this.framework = framework;
        this.cd.detectChanges();
      });
  }

  hasExcluded(): boolean {
    return Object.keys(this.framework.framework_excluded_plugins).length > 0;
  }
}
