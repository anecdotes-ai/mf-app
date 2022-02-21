import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stepper-header',
  templateUrl: './stepper-header.component.html',
  styleUrls: ['./stepper-header.component.scss']
})
export class StepperHeaderComponent {

  @Input()
  steps: Array<string>;
  @Input()
  currentStep: number;

  trackByFn(_: number, step: string): string {
    return step;
  }
}
