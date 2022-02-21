import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoaderManagerService } from 'core';
import { CalculatedControl, FrameworkStatus } from 'core/modules/data/models';
import { Service } from 'core/modules/data/models/domain';
import { DashboardFacadeService } from 'core/modules/data/services';
import { SubscriptionDetacher } from 'core/utils';
import { combineLatest, Observable } from 'rxjs';
import { map, mapTo, shareReplay, take } from 'rxjs/operators';
import { DashboardData } from 'core/models';
import { DashboardHeaderContentResolverService } from '../../../dashboard/services/dashboard-header-content-resolver/dashboard-header-content-resolver.service';
import { ExecutiveReportFooterData, SpecificSlideContent } from '../../models';
import { SpecificSlideContentResolverService } from '../../services';

@Component({
  selector: 'app-executive-report',
  templateUrl: './executive-report.component.html',
  styleUrls: ['./executive-report.component.scss'],
})
export class ExecutiveReportComponent implements OnInit, OnDestroy {
  private detacher: SubscriptionDetacher = new SubscriptionDetacher();

  isAllLoaded$: Observable<boolean>;
  allExecutiveReportData$: Observable<DashboardData>;
  footerSectionData$: Observable<ExecutiveReportFooterData>;
  slidesContentData$: Observable<SpecificSlideContent[]>;
  lastUpdateDate: Date;

  constructor(
    private headerItemsResolver: DashboardHeaderContentResolverService,
    private slidesContentResolver: SpecificSlideContentResolverService,
    private dashboardFacade: DashboardFacadeService,
    private loaderManager: LoaderManagerService
  ) {}

  ngOnInit(): void {
    this.setStreams();
  }

  ngOnDestroy(): void {
    this.detacher.detach();
  }

  private setStreams(): void {
    this.loaderManager.show();

    this.allExecutiveReportData$ = this.dashboardFacade.getDashboardData();

    this.slidesContentData$ = this.allExecutiveReportData$.pipe(
      map((data) => {
        const filteredFrameworks = data.frameworks.filter(framework => framework.is_applicable && framework.framework_status === FrameworkStatus.AVAILABLE);
        return this.slidesContentResolver.getAllSlidesContent(filteredFrameworks, data.anecdotesControls);
      })
    );

    this.footerSectionData$ = this.allExecutiveReportData$.pipe(
      map((data) =>
        this.fillFooterData(
          data.services,
          data.frameworksControls,
          data.applicableFrameworksIds,
          data.controlsFrameworksMapping
        )
      )
    );

    this.isAllLoaded$ = combineLatest([
      this.allExecutiveReportData$,
      this.slidesContentData$,
      this.footerSectionData$,
    ]).pipe(take(1), mapTo(true), shareReplay());

    this.isAllLoaded$.pipe(this.detacher.takeUntilDetach()).subscribe(() => this.loaderManager.hide());
  }

  private fillFooterData(
    services: Service[],
    frameworksControls: CalculatedControl[],
    applicableFrameworksIds: string[],
    controlFrameworkMapping: { [key: string]: string }
  ): ExecutiveReportFooterData {
    return this.headerItemsResolver.getHeaderSectionData(
      services,
      frameworksControls,
      applicableFrameworksIds,
      controlFrameworkMapping
    ) as ExecutiveReportFooterData;
  }
}
