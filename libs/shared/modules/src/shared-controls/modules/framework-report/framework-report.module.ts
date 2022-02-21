import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { FrameworkReportComponent } from './components/framework-report/framework-report.component';
import { ReportPrimaryHeaderComponent } from './components/report-primary-header/report-primary-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from 'core';
import { ReportSecondaryHeaderComponent } from './components/report-secondary-header/report-secondary-header.component';
import { ControlsSharedModule } from 'core/modules/shared-controls/shared-controls.module';
import { RenderingModule } from 'core/modules/rendering';
import { ReportControlComponent } from './components/report-control/report-control.component';
import { ReportControlsRendererComponent } from './components/report-controls-renderer/report-controls-renderer.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { SearchModule } from 'core/modules/data-manipulation/search';
import { ReportRequirementComponent } from './components/report-requirement/report-requirement.component';

const routes: Route[] = [{ path: '', component: FrameworkReportComponent }];

@NgModule({
  declarations: [
    FrameworkReportComponent,
    ReportPrimaryHeaderComponent,
    ReportSecondaryHeaderComponent,
    ReportControlComponent,
    ReportControlsRendererComponent,
    ReportRequirementComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    CoreModule,
    ControlsSharedModule,
    RenderingModule,
    MatExpansionModule,
    SearchModule,
  ],
})
export class FrameworkReportModule {}
