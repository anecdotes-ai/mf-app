import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ItemsRendererComponent, VirtualScrollRendererComponent } from './components';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';

@NgModule({
  imports: [CommonModule, VirtualScrollerModule],
  declarations: [VirtualScrollRendererComponent, ItemsRendererComponent],
  exports: [VirtualScrollRendererComponent, ItemsRendererComponent],
})
export class RenderingModule {}
