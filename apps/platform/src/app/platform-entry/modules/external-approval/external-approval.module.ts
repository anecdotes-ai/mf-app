import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonsModule } from 'core/modules/buttons';
import { CoreModule } from 'core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ExternalApprovalComponent } from './components';
import { TipsModule } from 'core/modules/tips/tips.module';
// import { FileViewerComponent } from './components/file-viewer/file-viewer.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { UtilsModule } from 'core/modules/utils';
import { FileViewerModule } from 'core/modules/file-viewer';
import { LoadersModule } from 'core/modules/loaders';

const routes: Route[] = [{ path: '', component: ExternalApprovalComponent }];

@NgModule({
  declarations: [ExternalApprovalComponent],
  imports: [
    CoreModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    PerfectScrollbarModule,
    ButtonsModule,
    TipsModule,
    NgbPaginationModule,
    UtilsModule,
    FileViewerModule,
    LoadersModule
  ],
})
export class ExternalApprovalModule {}
