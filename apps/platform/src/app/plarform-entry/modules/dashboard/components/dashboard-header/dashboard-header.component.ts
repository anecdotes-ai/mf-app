import { AppRoutes } from 'core/constants';
import { DashboardHeaderData } from '../../models';
import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { DashboardHeaderContentResolverService } from '../../services';
import { DashboardHeaderItem } from '../../models';
import { WindowHelperService } from 'core/services';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardHeaderComponent implements OnChanges {
  headerDisplayItems: DashboardHeaderItem[];

  @Input()
  data: DashboardHeaderData;

  constructor(
    private headerItemsResolver: DashboardHeaderContentResolverService,
    private windowHelper: WindowHelperService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes) {
      // In case if the 'data' is null, we use new header data with default values
      const transferDataToProceed = changes['data'].currentValue
        ? changes['data'].currentValue
        : new DashboardHeaderData();
      this.headerDisplayItems = this.headerItemsResolver.getHeaderItems(transferDataToProceed);
    }
  }

  buildTranslationKey(relativeKey: string): string {
    return `dashboard.header.${relativeKey}`;
  }

  navigateToExecutiveReport(): void {
    // TODO: Uncomment this when executive report is updated
    // this.windowHelper.openUrlInNewTab(AppRoutes.ExecutiveReport);
  }
}
