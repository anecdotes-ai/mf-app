import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardData } from 'core/models';
import { CalculatedControl } from 'core/modules/data/models';
import { Service, ServiceStatusEnum, Framework } from 'core/modules/data/models/domain';
import { DashboardFacadeService } from 'core/modules/data/services';
import { Observable } from 'rxjs';
import { DashboardFrameworksSectionData, DashboardHeaderData, FrameworkSectionItem } from '../../models';
import { DashboardHeaderContentResolverService } from '../../services';
import { map, take, distinctUntilChanged } from 'rxjs/operators';
import { LoaderManagerService } from 'core/services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  constructor(
    private headerItemsResolver: DashboardHeaderContentResolverService,
    private dashboardFacade: DashboardFacadeService,
    private loaderManager: LoaderManagerService
  ) {}

  headerData$: Observable<DashboardHeaderData>;
  frameworksSectionData$: Observable<DashboardFrameworksSectionData>;
  connectedServicesData$: Observable<Service[]>;

  allDashboardData$: Observable<DashboardData>;

  async ngOnInit(): Promise<any> {
    this.loaderManager.show();
    await this.loadDashboardData();
    this.loaderManager.hide();
  }

  ngOnDestroy(): void {
    this.loaderManager.hide();
  }

  buildTranslationKey(relativeKey: string): string {
    return `dashboard.${relativeKey}`;
  }

  private async loadDashboardData(): Promise<void> {
    this.allDashboardData$ = this.dashboardFacade.getDashboardData();

    this.headerData$ = this.allDashboardData$.pipe(
      map((data: DashboardData) =>
        this.fillHeaderData(
          data.services,
          data.frameworksControls,
          data.applicableFrameworksIds,
          data.controlsFrameworksMapping
        )
      ),
      take(1)
    );

    this.frameworksSectionData$ = this.allDashboardData$.pipe(
      map((data: DashboardData) => this.filterFrameworkSectionData(data.frameworks, data.frameworksControls)),
      distinctUntilChanged()
    );

    this.connectedServicesData$ = this.allDashboardData$.pipe(
      map((data: DashboardData) => this.filterConnectedServices(data.services)),
      take(1)
    );

    await this.allDashboardData$.pipe(take(1)).toPromise();
  }

  fillHeaderData(
    services: Service[],
    frameworksControls: CalculatedControl[],
    applicableFrameworksIds: string[],
    controlFrameworkMapping: { [key: string]: string }
  ): DashboardHeaderData {
    return this.headerItemsResolver.getHeaderSectionData(
      services,
      frameworksControls,
      applicableFrameworksIds,
      controlFrameworkMapping
    );
  }

  filterFrameworkSectionData(
    frameworks: Framework[],
    controls: CalculatedControl[]
  ): DashboardFrameworksSectionData {
    const frameworksSectionData: FrameworkSectionItem[] = frameworks.map<FrameworkSectionItem>((framework) => ({
      framework,
      relatedControls: controls.filter((control) =>
        control.control_related_frameworks_names.hasOwnProperty(framework.framework_name)
      ),
    }));

    return {
      frameworksSectionItems: frameworksSectionData,
    };
  }

  filterConnectedServices(services: Service[]): Service[] {
    return (
      services
        .filter(
          (s) => s.service_status === ServiceStatusEnum.INSTALLED && s.service_availability_status === 'AVAILABLE'
        )
        /* eslint-disable-next-line */
        // @ts-ignore
        .sort((a, b) => new Date(a.service_last_update) - new Date(b.service_last_update))
        .reverse()
        // show only first 4 connected plugins
        .slice(0, 4)
    );
  }
}
