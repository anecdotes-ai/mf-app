import { SpecificInformationContent } from 'core/models/specific-information-content.model';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ExecutiveReportFooterData } from '../../models';
import { DashboardHeaderContentResolverService } from '../../../dashboard/services';

@Component({
  selector: 'app-executive-report-footer',
  templateUrl: './executive-report-footer.component.html',
  styleUrls: ['./executive-report-footer.component.scss'],
})
export class ExecutiveReportFooterComponent implements OnChanges {
  footerDisplayItems: SpecificInformationContent[];

  @Input()
  data: ExecutiveReportFooterData;

  constructor(private headerItemsResolver: DashboardHeaderContentResolverService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes) {
      // In case if the 'data' is null, we use new footer data with default values
      const transferDataToProceed = changes['data'].currentValue
        ? changes['data'].currentValue
        : new ExecutiveReportFooterData();
      this.footerDisplayItems = this.headerItemsResolver.getHeaderItems(transferDataToProceed);
    }
  }

  buildTranslationKey(relativeKey: string): string {
    return `executiveReport.footer.${relativeKey}`;
  }
}
