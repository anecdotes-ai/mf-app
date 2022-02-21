import { Component, OnDestroy, OnInit } from '@angular/core';
import { PluginFacadeService, PluginService } from 'core/modules/data/services';
import { filter, take } from 'rxjs/operators';
import { MultiselectingItem } from 'core/models/multiselecting-item.model';
import { ComponentSwitcherDirective } from 'core/modules/component-switcher/directives/component-switcher/component-switcher.directive';
import { OnboardingPluginsFamilies } from 'core/modules/data/constants';
import { Service } from 'core/modules/data/models/domain';
import { SubscriptionDetacher } from 'core/utils/subscription-detacher.class';
import { OnboardingComponentIds } from './../../constants/onboarding.constants';
import { OnboardingSharedContext } from './../../models';
import { OnboardingUserEventService } from './../../services/onboarding-user-event.service';

@Component({
  selector: 'app-onboarding-plugins',
  templateUrl: './onboarding-plugins.component.html',
  styleUrls: ['./onboarding-plugins.component.scss'],
})
export class OnboardingPluginsComponent implements OnInit, OnDestroy {
  constructor(
    private switcher: ComponentSwitcherDirective,
    private pluginsFacade: PluginFacadeService,
    private pluginService: PluginService,
    private onboardingUserEventService: OnboardingUserEventService
  ) {}

  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private contextData: OnboardingSharedContext;
  private selectedPluginsDict: { [pluginId: string]: Service } = {};

  allMultiselectItems: MultiselectingItem<Service>[] = [];

  groupedMultiselectItems: MultiselectingItem<Service>[][];

  ngOnInit(): void {
    if (this.switcher?.sharedContext$) {
      this.getSwitcherContextData();
    }

    this.pluginsFacade
      .getPluginsForOnboardingPlugins()
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((plugins) => {
        const awsPlugin = this.combynePluginsByPrefix(plugins, 'aws');
        awsPlugin.text = 'AWS';
        const gcpPlugin = this.combynePluginsByPrefix(plugins, 'gcp');
        gcpPlugin.text = 'GCP';
        const azurePlugin = this.combynePluginsByPrefix(plugins, 'azure');
        azurePlugin.text = 'Azure';
        azurePlugin.data.service_families[0] = awsPlugin.data.service_families[0]; //to make correct grouping to display by desighn

        const filteredplugins = plugins.filter(
          (plugin) =>
            !plugin.service_id.startsWith('aws') &&
            !plugin.service_id.startsWith('gcp') &&
            !plugin.service_id.startsWith('azure')
        );

        this.allMultiselectItems = filteredplugins.map(
          (plugin) =>
            ({
              text: plugin.service_display_name,
              icon: this.pluginService.getServiceIconLinkSync(plugin.service_id),
              data: plugin,
              arrayData: [plugin],
            } as MultiselectingItem)
        );
        this.allMultiselectItems.push(...[awsPlugin, gcpPlugin, azurePlugin]);
        this.groupedMultiselectItems = this.groupByBasicsCategories(this.allMultiselectItems);
      });
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  buildTranslationKey(relativeKey: string): string {
    return `onboardingWizard.plugins.${relativeKey}`;
  }

  onNextClick(): void {
    this.contextData.selectedPlugins = Object.values(this.selectedPluginsDict);
    const choosenPluginsNames = this.allMultiselectItems
      .filter((selectItem) => selectItem.selected)
      .map((item) => item.data.service_display_name);

    this.onboardingUserEventService.trackPluginsChoosingEvent(choosenPluginsNames);

    this.switcher.goById(OnboardingComponentIds.Policy);
  }

  onBackClick(): void {
    this.switcher.goById(OnboardingComponentIds.Frameworks);
  }

  pluginSelected(item: MultiselectingItem): void {
    if (item.arrayData) {
      item.arrayData.forEach((i) =>
        item.selected ? (this.selectedPluginsDict[i.service_id] = i) : delete this.selectedPluginsDict[i.service_id]
      );
    } else {
      item.selected
        ? (this.selectedPluginsDict[item.data.service_id] = item.data)
        : delete this.selectedPluginsDict[item.data.service_id];
    }
  }

  isAnyPluginSelected(): boolean {
    return this.allMultiselectItems.some((item) => item.selected);
  }

  private groupByBasicsCategories(items: MultiselectingItem<Service>[]): MultiselectingItem<Service>[][] {
    const itemsToDisplay = [];

    OnboardingPluginsFamilies.forEach((family) => {
      const filteredItems = this.allMultiselectItems.filter((item) => {
        if (item.data) {
          return item.data.service_families.includes(family);
        } else if (item.arrayData.length) {
          return item.arrayData[0].service_families.includes(family); //because all items in arrayData have same category in our case
        }
      });
      if (filteredItems.length) {
        itemsToDisplay.push(filteredItems);
      }
    });

    return itemsToDisplay;
  }

  private async getSwitcherContextData(): Promise<void> {
    this.contextData = await this.switcher.sharedContext$
      .pipe(
        filter((c) => !!c),
        take(1),
        this.detacher.takeUntilDetach()
      )
      .toPromise();
  }

  private combynePluginsByPrefix(plugins: Service[], prefix: string): MultiselectingItem<Service> {
    const pluginsRelated = plugins.filter((plugin) => plugin.service_id.startsWith(prefix));
    return {
      icon: this.pluginService.getServiceIconLinkSync(prefix),
      data: pluginsRelated[0],
      arrayData: pluginsRelated,
    };
  }
}
