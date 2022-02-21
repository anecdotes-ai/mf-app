import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { getPercents } from 'core/utils';

export interface ControlsStatusBarSection {
  cssClass: string;
  controlsAmount: number;
  width: string;
}

export interface ControlsProgressBarDefinition {
  [key: string]: { count: number; cssClass: string };
}

@Component({
  selector: 'app-controls-status-bar',
  templateUrl: './controls-status-bar.component.html',
  styleUrls: ['./controls-status-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlsStatusBarComponent {
  @Input()
  displaySectionPercentage = true;

  @Input()
  maxValue: number;

  @Input()
  progressBarDefinition: ControlsProgressBarDefinition;

  getControlsStatusBarData(): ControlsStatusBarSection[] {
    if (!this.progressBarDefinition) {
      return null;
    }
    const values = Object.values(this.progressBarDefinition);
    const maxValue = this.maxValue
      ? this.maxValue
      : values.map((val) => val.count).reduce((prev, curr) => prev + curr, 0);

    if (!maxValue) {
      return null;
    }

    const resultArray: ControlsStatusBarSection[] = values.map((val) => ({
      width: getPercents(val.count, maxValue),
      controlsAmount: val.count,
      cssClass: val.cssClass,
    }));

    if (this.maxValue) {
      const allStatusesPercentsSum = resultArray.reduce(
        (prev, curr) => prev + Number(getPercents(curr.controlsAmount, maxValue)),
        0
      );
      resultArray.unshift({
        width: (100 - allStatusesPercentsSum).toFixed(0),
        controlsAmount: maxValue - allStatusesPercentsSum,
        cssClass: 'reduced-percents',
      });
    }

    return resultArray;
  }
}
