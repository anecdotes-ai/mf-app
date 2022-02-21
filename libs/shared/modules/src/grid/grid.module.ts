import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './components';
import { GridViewBuilderService } from './services';
import { SearchModule } from 'core/modules/data-manipulation/search';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';

@NgModule({
  imports: [CommonModule, SearchModule, PerfectScrollbarModule, VirtualScrollerModule],
  declarations: [GridComponent],
  providers: [GridViewBuilderService],
  exports: [GridComponent]
})
export class GridModule {}
