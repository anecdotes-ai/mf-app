import { FAVORITE_FAMILY_NAME } from './../../constants/plugins.constants';
import { PluginPageQueryParams } from 'core/models';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  DataTabsSelectComponent,
  IntercomService,
  LoaderManagerService,
  PluginSelectOnMarketplaceEventData,
} from 'core';
import { FilterTabModel } from 'core/modules/data-manipulation/data-filter';
import { Service, ServiceAvailabilityStatusEnum, ServiceStatusEnum } from 'core/modules/data/models/domain';
import { InitServicesStateAction } from 'core/modules/data/store/actions';
import { ServiceSelectors } from 'core/modules/data/store';
import { groupBy, sortCallback, SubscriptionDetacher } from 'core/utils';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, map, shareReplay, take, distinctUntilChanged } from 'rxjs/operators';
import {
  DataSearchComponent,
  SearchInstancesManagerService,
  SearchScopeDirective,
} from 'core/modules/data-manipulation/search';
import { Router } from '@angular/router';

export interface PluginFamily {
  familyName: string;
  plugins: Service[];
}

interface PluginFilterObject {
  familyName: string;
  plugin: Service;
}

export const allPluginsTabId = 'all';

@Component({
  selector: 'app-plugins',
  templateUrl: './plugins.component.html',
  styleUrls: ['./plugins.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PluginsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tabsComponent')
  private tabsComponent: DataTabsSelectComponent;
  @ViewChildren('pluginComponent')
  private pluginComponentQueryList: QueryList<PluginsComponent>;
  @ViewChild(SearchScopeDirective, { static: true })
  private searchScopeDirective: SearchScopeDirective;

  private detacher: SubscriptionDetacher = new SubscriptionDetacher();
  private modifyDataSubject = new Subject<Service[]>();
  private pluginFilterObjects: PluginFilterObject[];
  private allOrderedPluginsByCategory: Service[];
  private currentTab: FilterTabModel;
  private dataToDisplay: { [key: string]: boolean };
  private familiesToDisplay: { [key: string]: boolean } = {};
  private currentSearchScopeKey: string;
  private dataSearch: DataSearchComponent;

  pluginsSelectTabFamilyQueryparam = PluginPageQueryParams.family;
  filteredPlugins: Service[];
  tabs: FilterTabModel[];
  dafaultTab = allPluginsTabId;

  isNotFoundState$: Observable<any>;
  isFavoriteTabDisplayed: boolean;
  groupedPluginsByCategory: PluginFamily[];
  isNoFavoritePluginsState$: Observable<boolean>;

  constructor(
    private store: Store,
    private cd: ChangeDetectorRef,
    private loaderManager: LoaderManagerService,
    private intercom: IntercomService,
    private searchInstancesManagerService: SearchInstancesManagerService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.loaderManager.show();
    const pluginsStream$ = this.store
      .select(ServiceSelectors.SelectServiceState)
      .pipe(
        filter((state) => state.initialized),
        map((t) => Object.values(t.entities).map((storeEntity) => storeEntity.service)),
        shareReplay()
      );

    this.isNotFoundState$ = this.modifyDataSubject.pipe(map((plugins) => !plugins.length));
    this.isNoFavoritePluginsState$ = pluginsStream$.pipe(map((plugins) => !plugins.some((x) => x.service_is_favorite)));
    pluginsStream$
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((plugins) => this.setPluginsRelatedVariables(plugins));
    this.handleFavoritesPluginsSection(pluginsStream$);
    this.modifyDataSubject.pipe(this.detacher.takeUntilDetach()).subscribe((plugins) => this.setDataToDisplay(plugins));
    this.store.dispatch(new InitServicesStateAction());
  }

  async ngAfterViewInit(): Promise<any> {
    this.executeDataSearch((dataSearch) => {
      dataSearch.search
        .pipe(this.detacher.takeUntilDetach())
        .subscribe((foundData) => this.modifyDataSubject.next(foundData));
    });
    const hideLoaderStream = combineLatest([this.pluginComponentQueryList.changes, this.isNotFoundState$]).pipe(
      take(1)
    );

    hideLoaderStream.pipe(this.detacher.takeUntilDetach()).subscribe(() => {
      this.loaderManager.hide();
    });

    this.pluginComponentQueryList.notifyOnChanges();
  }

  clearSearch(): void {
    this.dataSearch.reset();
  }

  buildTranslationKey(relativeKey: string): string {
    return `plugins.${relativeKey}`;
  }

  ngOnDestroy(): void {
    this.detacher.detach();
    this.loaderManager.hide();
  }

  suggestPlugin(): void {
    this.intercom.showNewMessage();
  }

  toggleTab(chosenTab: FilterTabModel): void {
    this.isFavoriteTabDisplayed = false;
    this.currentTab = chosenTab;
    if (chosenTab.tabId === allPluginsTabId) {
      this.filteredPlugins = this.allOrderedPluginsByCategory;
    } else if (chosenTab.tabId === FAVORITE_FAMILY_NAME) {
      this.filteredPlugins = this.pluginFilterObjects
        .filter((filterObject) => filterObject.plugin.service_is_favorite)
        .map((x) => x.plugin);
      this.isFavoriteTabDisplayed = true;
    } else {
      this.filteredPlugins = this.pluginFilterObjects
        .filter((plugin) => plugin.familyName === chosenTab.filterDefinitionValue)
        .map((x) => x.plugin);
    }
    this.executeDataSearch((dataSearch) => {
      dataSearch.data = this.filteredPlugins;
    });
    this.cd.detectChanges();
  }

  searchInput(): void {
    if (this.currentTab.tabId !== allPluginsTabId) {
      this.selectAllPluginsTab();
    }
  }

  selectAllPluginsTab(): void {
    this.tabsComponent.selectTab(allPluginsTabId);
    this.cd.detectChanges();
  }

  isFamilyHidden(item: PluginFamily): boolean {
    if (
      this.router.routerState.snapshot.root.queryParams.searchQuery &&
      item.familyName === FAVORITE_FAMILY_NAME &&
      this.router.routerState.snapshot.root.queryParams.family !== FAVORITE_FAMILY_NAME
    ) {
      return true;
    }
    return !this.familiesToDisplay || !this.familiesToDisplay[this.familyTrackBy(item)];
  }

  isPluginHidden(plugin: Service): boolean {
    return !this.dataToDisplay || !this.dataToDisplay[this.pluginTrackBy(plugin)];
  }

  pluginTrackByWithIndex(_: number, plugin: Service): string {
    return plugin?.service_id;
  }

  familyTrackByWithIndex(_: number, family: PluginFamily): string {
    return family?.familyName;
  }

  getSelectPluginDataObject(plugin: Service): PluginSelectOnMarketplaceEventData {
    return {
      'plugin connected': plugin.service_status === ServiceStatusEnum.INSTALLED,
      'plugin category': plugin.service_families,
      'plugin name': plugin.service_id,
      'plugin number of evidences': plugin.service_evidence_list?.length,
    };
  }

  private handleFavoritesPluginsSection(pluginsStream$: Observable<Service[]>): void {
    pluginsStream$
      .pipe(
        map((services) => services.filter((s) => s.service_is_favorite)),
        distinctUntilChanged(
          (prev, curr) =>
            // This expression means that we listen only for whether we have any favorites frameworks seted or not, so then subscribe executes.
            !((prev.length === 0 || curr.length === 0) && curr.length !== prev.length)
        ),
        this.detacher.takeUntilDetach()
      )
      .subscribe((favoritesServices) => {
        // This if statement is needed to fix twinkle artifact when Favorite family display seted as true but then as false;
        if (this.currentTab?.tabId === allPluginsTabId) {
          this.familiesToDisplay[FAVORITE_FAMILY_NAME] = !!favoritesServices.length;
        }
      });
  }

  private setPluginsRelatedVariables(allPlugins: Service[]): void {
    this.groupedPluginsByCategory = [
      this.calculateFavouritesAsFamily(allPlugins),
      ...this.groupPluginsByCategory(allPlugins),
    ];

    this.allOrderedPluginsByCategory = this.groupPluginsByCategory(allPlugins)
      .map((x) => x.plugins)
      .reduce((prev, curr) => [...prev, ...curr], []); // Because order matters for search highlighting
    this.pluginFilterObjects = this.buildPluginFilterObjects(this.allOrderedPluginsByCategory);
    this.tabs = this.buildTabs(this.groupedPluginsByCategory);
    this.cd.detectChanges();
  }

  private buildPluginFilterObjects(plugins: Service[]): PluginFilterObject[] {
    return plugins.reduce(
      (prev, curr) => [
        ...prev,
        ...curr.service_families.map((family) => ({ familyName: family, plugin: curr } as PluginFilterObject)),
      ],
      []
    );
  }

  private calculateFavouritesAsFamily(plugins: Service[]): PluginFamily {
    const favoritePlugins = plugins
      .filter((plugin) => plugin.service_is_favorite)
      .reduce((prev, curr) => [...prev, curr], []);
    const groupedFavorites = this.groupPluginsByCategory(favoritePlugins)
      .map((x) => x.plugins)
      .reduce((prev, curr) => [...prev, ...curr], []);
    return { familyName: FAVORITE_FAMILY_NAME, plugins: groupedFavorites };
  }

  private groupPluginsByCategory(allPlugins: Service[]): PluginFamily[] {
    return groupBy(this.buildPluginFilterObjects(allPlugins), (x) => x.familyName)
      .map((x) => ({
        familyName: x.key,
        plugins: this.sortPluginsAccordingToStatus(x.values.map((filterObject) => filterObject.plugin)),
      }))
      .sort((fst, scnd) => sortCallback(fst, scnd, (x) => (x.familyName === 'Other' ? 'Z' : x.familyName)));
  }

  private sortPluginsAccordingToStatus(plugins: Service[]): Service[] {
    const installedOrWithErrors: Service[] = [];
    const notConnected: Service[] = [];
    const comingSoon: Service[] = [];

    while (plugins.length) {
      const plugin = plugins.pop();

      if (plugin.service_availability_status === ServiceAvailabilityStatusEnum.COMINGSOON) {
        comingSoon.push(plugin);
      } else {
        switch (plugin.service_status) {
          case ServiceStatusEnum.CONNECTIVITYFAILED:
          case ServiceStatusEnum.INSTALLATIONFAILED:
          case ServiceStatusEnum.INSTALLED:
            installedOrWithErrors.push(plugin);
            break;
          default:
            notConnected.push(plugin);
        }
      }
    }

    return [
      ...installedOrWithErrors.sort((fst, scnd) => sortCallback(fst, scnd, (x) => x.service_display_name)),
      ...notConnected.sort((fst, scnd) => sortCallback(fst, scnd, (x) => x.service_display_name)),
      ...comingSoon.sort((fst, scnd) => sortCallback(fst, scnd, (x) => x.service_display_name)),
    ];
  }

  private familyTrackBy(family: PluginFamily): string {
    return this.familyTrackByWithIndex(0, family);
  }

  private pluginTrackBy(plugin: Service): string {
    return this.pluginTrackByWithIndex(0, plugin);
  }

  private setDataToDisplay(plugins: Service[]): void {
    this.dataToDisplay = null;
    // This field contains a dictionary with controls identificators.
    // It's changed during filtering.
    // It allows to avoid lots of dom manipulation during data filtering.
    // And it improves the performance.
    plugins.forEach((plugin) => {
      if (!this.dataToDisplay) {
        this.dataToDisplay = {};
      }

      this.dataToDisplay[this.pluginTrackBy(plugin)] = true;
    });

    if (this.dataToDisplay) {
      this.groupedPluginsByCategory.forEach(
        (group) => (this.familiesToDisplay[group.familyName] = this.isPluginFamilyShouldBeDisplayed(group))
      );
    }

    this.cd.detectChanges();
  }

  private isPluginFamilyShouldBeDisplayed(pluginFamily: PluginFamily): boolean {
    return pluginFamily.plugins.some((plugin) => {
      return this.currentTab?.filterDefinitionValue === FAVORITE_FAMILY_NAME
        ? pluginFamily.familyName === FAVORITE_FAMILY_NAME
        : this.dataToDisplay[this.pluginTrackBy(plugin)] && pluginFamily.familyName !== FAVORITE_FAMILY_NAME;
    });
  }

  private buildTabs(categories: PluginFamily[]): FilterTabModel[] {
    const tabsByCategories: FilterTabModel[] = categories.map((x) => ({
      translationKey: x.familyName,
      tabId: x.familyName,
      count: x.plugins.length,
      filterDefinitionValue: x.familyName,
    }));

    const favoritesTabs = tabsByCategories.shift();
    favoritesTabs.translationKey = this.buildTranslationKey('favTab');
    favoritesTabs.icon = 'star';
    return [
      favoritesTabs,
      {
        translationKey: this.buildTranslationKey('allTab'),
        tabId: allPluginsTabId,
        count: categories.reduce((prev, curr) => {
          if (curr.familyName === FAVORITE_FAMILY_NAME) {
            return prev;
          } else {
            return [...prev, ...curr.plugins];
          }
        }, []).length,
        filterDefinitionValue: undefined,
      },
      ...tabsByCategories,
    ];
  }

  private executeDataSearch(callback: (dataSearch: DataSearchComponent) => void): void {
    if (!this.dataSearch) {
      if (!this.currentSearchScopeKey) {
        this.currentSearchScopeKey = this.searchScopeDirective.initializedSearchScope;
      }

      this.searchInstancesManagerService
        .getDataSearch(this.currentSearchScopeKey)
        .pipe(
          filter((x) => !!x),
          take(1),
          this.detacher.takeUntilDetach()
        )
        .subscribe((dataSearch) => {
          this.dataSearch = dataSearch;
          callback(dataSearch);
        });
    } else {
      callback(this.dataSearch);
    }
  }
}
