import { SpecificSlideContentResolverService } from './services/specific-slide-content-resolver.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import {
  ExecutiveReportComponent,
  ExecutiveReportHeaderComponent,
  ExecutiveReportFooterComponent,
  ExecutiveReportSlideComponent,
} from './components';
import { CoreModule } from 'core';
import {
  DashboardHeaderContentResolverService,
  DashboardFrameworksResolverService,
  DashboardCategoriesResolverService,
} from '../dashboard/services';
import { FrameworksStatusSlideContentComponent } from './components/specific-slides/frameworks-status-slide-content/frameworks-status-slide-content.component';
import { InfoSecSlideContentComponent } from './components/specific-slides/information-security-slide-content/information-security-slide-content.component';

const routes: Route[] = [{ path: '', component: ExecutiveReportComponent }];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), NgxJsonViewerModule, CoreModule, TranslateModule.forChild()],
  declarations: [
    ExecutiveReportComponent,
    ExecutiveReportHeaderComponent,
    ExecutiveReportFooterComponent,
    ExecutiveReportSlideComponent,
    FrameworksStatusSlideContentComponent,
    InfoSecSlideContentComponent,
  ],
  exports: [],
  entryComponents: [FrameworksStatusSlideContentComponent, InfoSecSlideContentComponent],
  providers: [
    DashboardHeaderContentResolverService,
    DashboardFrameworksResolverService,
    DashboardCategoriesResolverService,
    SpecificSlideContentResolverService,
  ],
})
export class ExecutiveReportModule {}
