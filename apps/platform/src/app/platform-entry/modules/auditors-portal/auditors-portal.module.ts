import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditorsPortalComponent } from './components';
import { Route, RouterModule } from '@angular/router';
import { CoreModule } from 'core';
import { TranslateModule } from '@ngx-translate/core';
import { AuditorsPortalService } from './services';

const routes: Route[] = [{ path: '', component: AuditorsPortalComponent }];

@NgModule({
  declarations: [
    AuditorsPortalComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
  ],
  providers: [AuditorsPortalService]
})
export class AuditorsPortalModule { }
