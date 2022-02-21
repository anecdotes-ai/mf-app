import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FilterTabModel } from 'core/modules/data-manipulation/data-filter/models';

@Component({
  selector: 'app-data-tabs-select',
  templateUrl: './data-tabs-select.component.html',
  styleUrls: ['./data-tabs-select.component.scss'],
})
export class DataTabsSelectComponent implements OnChanges {
  currentTab: FilterTabModel;

  @Input()
  tabs: FilterTabModel[] = [];

  @Input()
  selectedTabId: any;

  @Input()
  disableTabOnNoItems: boolean;

  @Input()
  trackQueryParams: boolean;

  @Input()
  queryParamId: string;

  @Input()
  chooseFirstTab: boolean;

  @Input()
  defaultTabId: string;

  @Output()
  select = new EventEmitter<FilterTabModel>(true);

  constructor(private router: Router, private cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('tabs' in changes) {
      if (!this.trySetTabFromQueryParams()) {
        this.setDefaultTab();
      }
    }

    if ('selectedTabId' in changes) {
      if (this.selectedTabId) {
        this.setTabById(this.selectedTabId);
      }
    }
  }

  selectTab(tabId: string | number, emitEvent = true): void {
    if (this.tabs?.length) {
      const foundTabById = this.tabs.find((x) => x.tabId === tabId);

      this.selectItem(foundTabById, emitEvent);
      this.cd.detectChanges();
    }
  }

  private selectItem(dataItem: FilterTabModel, emitEvent: boolean): void {
    if (emitEvent) {
      this.select.emit(dataItem);
    }

    this.currentTab = dataItem;
    if (
      this.isQueryParamTrackingEnabled() &&
      this.router.routerState.snapshot.root.queryParams[this.queryParamId] !== dataItem.filterDefinitionValue
    ) {
      this.router.navigate([], {
        queryParams: {
          ...this.router.routerState.snapshot.root.queryParams,
          [this.queryParamId]: dataItem.filterDefinitionValue,
        },
      });
    }
  }

  private setDefaultTab(): void {
    if (!this.currentTab && this.tabs?.length) {
      if (this.chooseFirstTab) {
        this.selectItem(this.tabs[0], true);
      } else if (this.defaultTabId) {
        const tab = this.tabs.find((x) => x.tabId === this.defaultTabId);
        this.selectItem(tab, true);
      }
    }
  }

  private setTabById(tabId: string): void {
    if (this.tabs?.length) {
      this.currentTab = this.tabs.find((x) => x.tabId === tabId);
    }
  }

  private trySetTabFromQueryParams(): boolean {
    if (this.tabs?.length && this.isQueryParamTrackingEnabled()) {
      const queryParamValue = this.router.routerState.snapshot.root.queryParams[this.queryParamId];

      if (queryParamValue) {
        const tabToSelect = this.tabs.find((x) => x.filterDefinitionValue === queryParamValue);

        if (tabToSelect) {
          this.selectItem(tabToSelect, true);
          return true;
        }
      }
    }
  }

  private isQueryParamTrackingEnabled(): boolean {
    return this.trackQueryParams && !!this.queryParamId;
  }
}
