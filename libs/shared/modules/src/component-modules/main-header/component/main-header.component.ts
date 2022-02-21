import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MainHeaderInput } from '../models';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainHeaderComponent {
  @Output() search = new EventEmitter<any[]>();
  @Output() btnPressed = new EventEmitter();

  @Input() inputModel: MainHeaderInput;

  buildTranslationKey(relativeKey: string): string {
    return `${this.inputModel.translationRootKey}.header.${relativeKey}`;
  }
}
