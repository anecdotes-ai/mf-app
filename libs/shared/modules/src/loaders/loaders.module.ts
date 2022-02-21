import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CircleLoaderComponent, LoadingAnimationComponent, SecondaryLoadingAnimationComponent } from './components';
import { LottieModule } from 'ngx-lottie';

@NgModule({
  imports: [CommonModule, LottieModule],
  declarations: [CircleLoaderComponent, LoadingAnimationComponent, SecondaryLoadingAnimationComponent],
  exports: [CircleLoaderComponent, LoadingAnimationComponent, SecondaryLoadingAnimationComponent],
})
export class LoadersModule {}
