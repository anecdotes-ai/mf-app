import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from 'core';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { ViewEvidenceComponent } from './components';

const routes: Route[] = [{ path: '', component: ViewEvidenceComponent }];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), NgxJsonViewerModule, CoreModule, TranslateModule.forChild()],
  declarations: [ViewEvidenceComponent],
  exports: [],
  entryComponents: [],
  providers: [],
})
export class ViewEvidenceModule {}
