import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-metadata-view',
  templateUrl: './metadata-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataViewComponent {
  @HostBinding('class')
  private classes = 'inline-flex flex-col whitespace-nowrap font-main text-base';

  @Input()
  metadataValue: string | number;

  @Input()
  metadataDescriptionTranslationKey: string;

  @Input()
  icon: string;
}
