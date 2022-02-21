import { Component, HostBinding, Input, OnChanges, ViewChild } from '@angular/core';
import { CircleProgressOptions } from 'ng-circle-progress';

@Component({
  selector: 'app-circle-progress',
  templateUrl: './circle-progress.component.html',
  styleUrls: ['./circle-progress.component.scss'],
})
export class CircleProgressComponent implements OnChanges {
  @HostBinding('class')
  private classes = 'relative flex justify-center';

  @ViewChild('circleProgress')
  circleProgress: CircleProgressComponent;

  @HostBinding('attr.progress')
  @Input()
  progress: number;

  @Input()
  tabIcon = '';

  @Input()
  progressColor: string;

  options: CircleProgressOptions;
  outerStrokeColor: string;

  ngOnChanges(): void {
    this.setOptions();
  }

  private setOptions(): void {
    if (this.progress !== undefined && this.tabIcon) {
      this.options = {
        ...new CircleProgressOptions(),
        maxPercent: 100,
        radius: 28,
        outerStrokeWidth: 3,
        innerStrokeWidth: 3,
        space: -3,
        outerStrokeColor: this.progressColor,
        innerStrokeColor: '#fff',
        titleFontSize: '8',
        unitsFontSize: '8',
        showSubtitle: false,
        animation: true,
        animationDuration: 0,
        startFromZero: false,
        responsive: false,
        clockwise: false,
        showImage: true,
        imageWidth: '50',
        imageHeight: 0,
        lazy: false,
        percent: this.progress,
      };
    } else {
      this.options = null;
    }
  }
}
