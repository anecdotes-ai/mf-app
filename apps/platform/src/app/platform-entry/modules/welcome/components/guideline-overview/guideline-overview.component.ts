import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-guideline-overview',
  templateUrl: './guideline-overview.component.html',
  styleUrls: ['./guideline-overview.component.scss'],
})
export class GuidelineOverviewComponent {
  @ContentChild('title')
  titleTemplate: TemplateRef<any>;
  @ContentChild('description')
  descriptionTemplate: TemplateRef<any>;

  @Input()
  index?: number;

  @Input()
  iconPath: string;

  @Input()
  title: [{ displayTranslationKey: string; action(): void }];

  @Input()
  description: [{ displayTranslationKey: string; action(): void }];

  @Input()
  comingSoon: boolean;
}
