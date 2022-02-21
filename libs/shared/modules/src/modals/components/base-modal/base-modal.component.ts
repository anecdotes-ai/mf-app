import { Component, Input, TemplateRef, HostBinding, Inject } from '@angular/core';

@Component({
  selector: 'app-base-modal',
  templateUrl: './base-modal.component.html',
  styleUrls: ['./base-modal.component.scss'],
})
export class BaseModalComponent {
  @HostBinding('class.base-modal')
  private modalClass = true;

  @HostBinding('class.left-corner-inverse')
  @Input()
  inverse: boolean;

  @HostBinding('class.no-padding')
  @Input()
  noPadding: boolean;

  @HostBinding('class.no-header')
  @Input()
  noHeader: boolean;

  @Input()
  footerTemplate: TemplateRef<any>;

  @Input()
  titleTranslationKey: string;

  @HostBinding('class.left-corner-content')
  @Input()
  leftCornerData: { titleText?: string; icon?: string };

  @Input()
  descriptionTemplate: TemplateRef<any>;

  @Input()
  descriptionTranslationKey: string;

  @Input()
  descriptionParams: any;

  @Input()
  iconPath: string;
}
