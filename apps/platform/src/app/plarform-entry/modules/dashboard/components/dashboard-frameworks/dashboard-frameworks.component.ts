import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { DashboardFrameworksResolverService } from '../../services';
import { TabModel } from 'core/modules/dropdown-menu';
import { DatePipe } from '@angular/common';
import { DashboardFrameworksSectionData } from '../../models';
import { CategoriesDefaultState } from '../../models/category';
import { Service } from 'core/modules/data/models/domain';

@Component({
  selector: 'app-dashboard-frameworks',
  templateUrl: './dashboard-frameworks.component.html',
  styleUrls: ['./dashboard-frameworks.component.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardFrameworksComponent implements OnChanges {
  frameworksData: TabModel[];
  frameworkId: string;

  categoriesDefaultState = CategoriesDefaultState;
  lastUpdatedDate = new Date();

  @Input()
  data: DashboardFrameworksSectionData;
  @ViewChild('tabContent', { static: true })
  private tabContent: TemplateRef<any>;

  @Input()
  connectedServicesData: Service[];

  constructor(private frameworksResolver: DashboardFrameworksResolverService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('data' in changes) {
      const inputData: DashboardFrameworksSectionData = changes['data'].currentValue;
      if (inputData && inputData.frameworksSectionItems && inputData.frameworksSectionItems.length) {
        this.frameworksData = this.frameworksResolver.getFrameworkTabs(inputData);
        if (this.frameworksData && this.frameworksData.length > 0) {
          this.frameworksData.forEach((value) => {
            value.tabTemplate = this.tabContent;
          });
        }
      }
    }
  }

  buildTranslationKey(relativeKey: string): string {
    return `dashboard.frameworks.${relativeKey}`;
  }
}
