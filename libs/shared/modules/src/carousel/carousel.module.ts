import { CarouselItemDirective } from './directives/carousel-item.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from './components/carousel/carousel.component';
import { SvgIconsModule } from 'core/modules/svg-icons';

@NgModule({
  declarations: [CarouselComponent, CarouselItemDirective],
  imports: [CommonModule, SvgIconsModule],
  exports: [CarouselComponent, CarouselItemDirective]
})
export class CarouselModule {}
