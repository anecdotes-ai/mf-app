import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-control-no-adopted-frameworks',
  templateUrl: './control-no-adopted-frameworks.component.html',
  styleUrls: ['./control-no-adopted-frameworks.component.scss'],
})
export class ControlNoAdoptedFrameworksComponent {
  constructor(private router: Router) {}

  navigateToFrameworks(): void {
    this.router.navigate(['frameworks']);
  }

  buildTranslationKey(key: string): string {
    return `controls.noAdoptedFrameworks.${key}`;
  }
}
