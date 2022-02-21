import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from 'core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ApiComponent } from './components';
import { ApiHeaderComponent } from './components/api-header/api-header.component';

const routes: Route[] = [{ path: '', component: ApiComponent }];

@NgModule({
  imports: [CoreModule, RouterModule.forChild(routes), TranslateModule.forChild(), PerfectScrollbarModule],
  declarations: [ApiComponent, ApiHeaderComponent],
  exports: [],
  entryComponents: [],
  providers: [],
})
export class ApiModule {}
