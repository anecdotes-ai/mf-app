import { LocalDatePipe } from './local-date/local-date.pipe';
import { LinkifyPipe } from './linkify/linkify.pipe';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    LocalDatePipe,
    LinkifyPipe,
  ],
  imports: [],
  exports: [
    LocalDatePipe,
    LinkifyPipe,
  ],
})
export class PipesModule {
}
