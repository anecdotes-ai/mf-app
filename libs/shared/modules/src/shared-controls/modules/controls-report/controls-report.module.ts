import { ControlsReportComponent } from './components/controls-report/controls-report.component';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from 'core/core.module';
import { DynamicFormModule } from 'core/modules/dynamic-form/';
import { Route, RouterModule } from '@angular/router';
import { ControlsReportHeaderComponent } from './components/controls-report-header/controls-report-header.component';
import { ControlsReportItemComponent } from './components/controls-report-item/controls-report-item.component';

const routes: Route[] = [{ path: '', component: ControlsReportComponent }];

@NgModule({
  imports: [CoreModule, TranslateModule, DynamicFormModule, RouterModule.forChild(routes)],
  declarations: [
    ControlsReportComponent,
    ControlsReportHeaderComponent,
    ControlsReportItemComponent,
  ],
  exports: [ControlsReportComponent],
  providers: [],
})
export class ControlsReportModule {}
