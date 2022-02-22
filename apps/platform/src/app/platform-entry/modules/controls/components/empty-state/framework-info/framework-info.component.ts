import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-framework-info',
  templateUrl: './framework-info.component.html',
  styleUrls: ['./framework-info.component.scss'],
})
export class FrameworkInfoComponent {
  @Input()
  frameworkId: string;

  @Input()
  frameworkName: string;

  @Input()
  frameworkControlsCount: number;

  buildTranslationKey(relativeKey: string): string {
    return `controls.emptyState.frameworkInfo.${relativeKey}`;
  }

  getFrameworkIconLink(frameworkId: string): string {
    return `frameworks/${frameworkId}`;
  }
}
