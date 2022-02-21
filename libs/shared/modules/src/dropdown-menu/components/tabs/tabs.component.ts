import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
  Input,
  HostBinding,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';
import { TabModel, TabSize } from '../../types';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent implements OnChanges {
  @HostBinding('class.multiple-tabs')
  private multipleTabs: boolean;

  @Input()
  tabProgressDisplay = false;

  @Input()
  allowTabTemplates = true;

  @Input()
  selectTabById: number;

  @Input()
  disableTabsOnNoItems: boolean;

  @Input()
  tabs: TabModel[] = [];

  @Input()
  tabSize: TabSize = 'medium';

  @Input()
  borderBottom = true;

  @Input()
  renderAllTabs = true;

  @Input()
  useCarousel = false;

  @Input()
  carouselMaxWidthInPercents: number;

  @Output()
  tabChange = new EventEmitter<number | string | any>(); // Gets called when a tab is changed and returns an index of the tab.

  tabsToDisplay = [];

  selectedTabIndex = 0;

  get isShowBottomBorder(): boolean {
    return this.tabsToDisplay.length > 1 && this.borderBottom;
  }

  constructor(private cd: ChangeDetectorRef, private router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('tabs' in changes) {
      if (this.tabs) {
        this.tabsToDisplay = [...this.tabs];
        this.multipleTabs = this.tabs.length > 1;
        this.syncTabsWithRouter();
      }
    }
    if ('selectTabById' in changes) {
      if (this.tabs) {
        const index = this.tabs.indexOf(this.tabs.find((tab) => tab.tabId === this.selectTabById));
        this.selectedTabIndex = index;
      }
    }
  }

  tabTrackBy(_: number, tab: TabModel): any {
    return tab.tabId;
  }

  selectTab(index: number): void {
    if (this.selectedTabIndex !== index) {
      this.tabChange.emit(this.tabs[index].tabId);
    }
    this.selectedTabIndex = index;
    this.cd.detectChanges();
  }

  private syncTabsWithRouter(): void {
    const activeTabIndex = this.tabs.findIndex((t) => t.routerLink && this.router.isActive(t.routerLink, { paths: 'exact', queryParams: 'exact', matrixParams: 'exact', fragment: 'exact' }));

    if (activeTabIndex >= 0) {
      this.selectTab(activeTabIndex);
    }
  }
}
