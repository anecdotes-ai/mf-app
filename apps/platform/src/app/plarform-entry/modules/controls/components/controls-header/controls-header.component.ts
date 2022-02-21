import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, Input,
  OnDestroy, ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutes } from 'core/constants';
import { RoleEnum } from 'core/modules/auth-core/models/domain';
import { DataFilterManagerService } from 'core/modules/data-manipulation/data-filter';
import { DataSearchComponent, SearchDefinitionModel } from 'core/modules/data-manipulation/search';
import { AnecdotesUnifiedFramework } from 'core/modules/data/constants';
import { CalculatedControl } from 'core/modules/data/models';
import { AccountFeatureEnum, Framework } from 'core/modules/data/models/domain';
import { FrameworkService } from 'core/modules/data/services';
import { ControlsCustomizationModalService } from 'core/modules/shared-controls/modules/customization/control/services';
import { SubscriptionDetacher } from 'core/utils';
import { MessageBusService, SearchMessageBusMessages } from 'core/services';

@Component({
  selector: 'app-controls-header',
  templateUrl: './controls-header.component.html',
  styleUrls: ['./controls-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlsHeaderComponent implements OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  @ViewChild('search')
  private searchComponent: DataSearchComponent;

  readonly notVisibleForAuditor = [RoleEnum.Admin, RoleEnum.Collaborator, RoleEnum.It, RoleEnum.User];

  @Input()
  controls: CalculatedControl[];

  @Input()
  controlsCollapsed = true;

  @Input()
  selectedFramework: Framework;

  @Input()
  auditView = false;

  features = AccountFeatureEnum;

  searchDefinitions: SearchDefinitionModel<CalculatedControl>[] = [
    {
      propertySelector: (c) => c.control_name,
    },
    {
      propertySelector: (c) => c.control_description,
    },
    {
      propertySelector: (c) => c.control_requirements_names,
    },
    {
      propertySelector: (c) => c.control_evidence_names,
    },
  ];

  constructor(
    private cd: ChangeDetectorRef,
    private filterManager: DataFilterManagerService,
    private messageBusService: MessageBusService,
    public controlsCustomizationModalService: ControlsCustomizationModalService,
    public frameworkService: FrameworkService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  getCurrentFrameworkIcon(): string {
    if (this.selectedFramework) {
      return this.frameworkService.getFrameworkIconLink(this.selectedFramework.framework_icon_id ?? this.selectedFramework.framework_id);
    }
  }

  ngOnDestroy(): void {
    this.filterManager.close(true);
    this.detacher.detach();
  }

  searchData(data): void {
    this.messageBusService.sendMessage(SearchMessageBusMessages.CONTROLS_SEARCH, data);
  }

  resetAllFilters(): void {
    this.searchComponent.reset();
    this.filterManager.reset();
    this.cd.detectChanges();
  }

  buildTranslationKey(key: string): string {
    return `controls.header.${key}`;
  }

  openAddCustomControlModal(): void {
    this.controlsCustomizationModalService.openAddCustomControlModal(this.selectedFramework.framework_id);
  }

  get isAnecdotesFramework(): boolean {
    return this.selectedFramework?.framework_id === AnecdotesUnifiedFramework.framework_id;
  }

  navigateToOverviewClick(): void {
    const frameworkName = this.route.snapshot.params['framework'];
    this.router.navigate([`/${AppRoutes.Frameworks}/${frameworkName}/${AppRoutes.FrameworkOverview}`]);
  }
  navigateToHistoryClick(): void {
    const frameworkName = this.route.snapshot.params['framework'];
    this.router.navigate([`/${AppRoutes.Frameworks}/${frameworkName}/${AppRoutes.FrameworkAuditHistory}`]);
  }
}
