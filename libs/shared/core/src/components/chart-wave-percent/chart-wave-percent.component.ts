import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { ProgressCoverage } from 'core/modules/utils/types';

@Component({
  selector: 'app-chart-wave-percent',
  templateUrl: './chart-wave-percent.component.html',
  styleUrls: ['./chart-wave-percent.component.scss'],
})
export class ChartWavePercentComponent implements AfterViewInit {
  @Input() percent = 0;
  @Input() isTabletSize: boolean;

  @ViewChild('water')
  private waterRef: ElementRef;
  @ViewChild('waveFront')
  private waveFrontRef: ElementRef;
  @ViewChild('waveLine')
  private waveLineRef: ElementRef;
  @ViewChild('statusPercent')
  private statusPercentRef: ElementRef;
  @ViewChild('progressSuccess')
  private progressSuccessRef: ElementRef;

  private water: HTMLElement;
  private waveFront: HTMLElement;
  private waveLine: HTMLElement;
  private statusPercent: HTMLElement;
  private progressSuccess: HTMLElement;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // Create elements for animation
    this.water = this.waterRef?.nativeElement;
    this.waveFront = this.waveFrontRef?.nativeElement;
    this.waveLine = this.waveLineRef?.nativeElement;
    this.statusPercent = this.statusPercentRef?.nativeElement;
    this.progressSuccess = this.progressSuccessRef?.nativeElement;
    this.createChart();
  }

  createChart(): void {
    let counter = 0;
    if (this.percent > 0) {
      const interval = setInterval(() => {
        counter++;
        this.animatedPercentChart(counter);
        this.setBackgroundColor();

        if (counter === this.percent) {
          this.waveLine.style.visibility = 'visible';
          this.waveFront.style.animation = 'none';
          if (counter === 100) {
            this.progressSuccess.style.visibility = 'visible';
          }
          clearInterval(interval);
        }
      }, 50);
    }
  }

  animatedPercentChart(counter): void {
    this.water.style.transform = `translate(0, ${100 - counter}%)`;
    if (!this.isTabletSize) {
      switch (true) {
        case this.percent >= 80 && this.percent <= 95:
          this.statusPercent.style.paddingBottom = `${counter + 5}px`;
          break;
        case this.percent > 95:
          this.statusPercent.style.paddingBottom = `${counter - 10}px`;
          break;
        case this.percent < 80:
          this.statusPercent.style.paddingBottom = `${counter + 18}px`;
          break;
        default:
          break;
      }
    } else {
      switch (true) {
        case this.percent >= 80 && this.percent <= 95:
          this.statusPercent.style.paddingBottom = `${counter}%`;
          break;
        case this.percent > 95:
          this.statusPercent.style.paddingBottom = `${counter - 15}%`;
          break;
        case this.percent < 80:
          this.statusPercent.style.paddingBottom = `${counter + 10}%`;
          break;
        default:
          break;
      }
    }
  }

  setBackgroundColor(): void {
    switch (true) {
      case this.percent <= ProgressCoverage.basic.maxValue:
        this.renderer.addClass(this.water, 'bg-pink');
        break;
      case this.percent < ProgressCoverage.superstar.minValue:
        this.renderer.addClass(this.water, 'bg-orange');
        break;
      default:
        this.renderer.addClass(this.water, 'bg-blue');
        break;
    }
  }
}
