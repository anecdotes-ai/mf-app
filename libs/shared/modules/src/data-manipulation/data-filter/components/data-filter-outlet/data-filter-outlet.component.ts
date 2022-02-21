import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SubscriptionDetacher } from 'core/utils';
import { FilterDefinition, FilterOptionState } from '../../models';
import { FilterMessageBusMessages } from '../../constants/filter-messages.constants';
import { MessageBusService } from 'core/services';
import { DataFilterComponent } from '../data-filter/data-filter.component';

export interface FilterContext<T> {
  // used only here
  data: T[];
  filterDefinition: FilterDefinition<T>[];
}

@Component({
  selector: 'app-data-filter-outlet',
  templateUrl: './data-filter-outlet.component.html',
  styleUrls: ['./data-filter-outlet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataFilterOutletComponent implements OnInit, OnDestroy {
  @ViewChild('filterComponent')
  private filterComponent: DataFilterComponent;
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  filterContext: FilterContext<any>;

  constructor(private messageBusService: MessageBusService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.messageBusService
      .getObservable(FilterMessageBusMessages.FILTER_RESET_FIELD)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((fieldId: string) => {
        this.filterComponent?.resetField(fieldId);
      });

    this.messageBusService
      .getObservable(FilterMessageBusMessages.FILTER_REFRESH)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe(() => {
        this.filterComponent?.refreshFilter();
      });

    this.messageBusService
      .getObservable(FilterMessageBusMessages.FILTER_OPEN)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((options: any[]) => {
        this.filterComponent?.expandComponent(...options);
        this.cd.detectChanges();
      });

    this.messageBusService
      .getObservable<boolean>(FilterMessageBusMessages.FILTER_CLOSE)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((destroyDefinition) => {
        if (destroyDefinition) {
          this.filterContext = null;
          this.messageBusService.sendMessage(FilterMessageBusMessages.FILTER_CLOSED, null);
        } else {
          this.filterComponent?.collapseComponent();
        }

        this.cd.detectChanges();
      });

    this.messageBusService
      .getObservable<any[]>(FilterMessageBusMessages.FILTER_SET_DATA)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((data) => {
        this.filterContext = { ...this.filterContext, data };
        this.cd.detectChanges();
      });

    this.messageBusService
      .getObservable<FilterDefinition<any>[]>(FilterMessageBusMessages.FILTER_SET_DEFINITION)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((filterDefinition) => {
        this.filterContext = { ...this.filterContext, filterDefinition };
        this.cd.detectChanges();
      });

    this.messageBusService
      .getObservable(FilterMessageBusMessages.FILTER_RESET)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe(() => this.filterComponent.reset());

    this.messageBusService
      .getObservable(FilterMessageBusMessages.FILTER_TOGGLE_OPTIONS)
      .pipe(this.detacher.takeUntilDetach())
      .subscribe((v: any) => this.filterComponent.toggleOptions(v));
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  filterData(data: any[]): void {
    this.messageBusService.sendMessage(FilterMessageBusMessages.FILTER_DATA_FILTERED, data);
  }

  filterExpanded(): void {
    this.messageBusService.sendMessage(FilterMessageBusMessages.FILTER_OPENED, null);
  }

  filterCollapsed(): void {
    this.messageBusService.sendMessage(FilterMessageBusMessages.FILTER_CLOSED, null);
  }

  filtering(filtering: any): void {
    this.messageBusService.sendMessage(FilterMessageBusMessages.FILTER_FILTERING, filtering);
  }

  filteringOptions(options: { [key: string]: { [key: string]: FilterOptionState<any> } }): void {
    this.messageBusService.sendMessage(FilterMessageBusMessages.FILTER_FILTERING_OPTIONS, options);
  }
}
