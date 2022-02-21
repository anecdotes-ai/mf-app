import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent {
  @Output()
  backToAllDataBtnClick = new EventEmitter<any>();

  @Output()
  additionalActionBtnClick = new EventEmitter<any>();

  @Input()
  mainInfoTranslationKey: string;

  @Input()
  userAdviceTranslationKey: string;

  @Input()
  backToAllDataTranslationKey: string;

  @Input()
  additionalActionTranslationKey: string;

  @Input()
  userAdviceDisabled: boolean;

  @Input()
  additionalActionEnabled = false;

  buildTranslationKey(key: string): string {
    return `controls.notFound.${key}`;
  }
}
