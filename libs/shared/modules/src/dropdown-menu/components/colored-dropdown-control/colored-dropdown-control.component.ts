import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MakeProvider } from 'core/modules/form-controls';
import { DropdownControlComponent } from '../dropdown-control/dropdown-control.component';

@Component({
  selector: 'app-colored-dropdown-control',
  templateUrl: './colored-dropdown-control.component.html',
  providers: [MakeProvider(ColoredDropdownControlComponent)],
})
export class ColoredDropdownControlComponent extends DropdownControlComponent {
  constructor(
    injector: Injector,
    translate: TranslateService,
    hostElementRef: ElementRef<HTMLElement>,
    cd: ChangeDetectorRef
  ) {
    super(injector, translate, hostElementRef, cd);
  }

  @Input()
  buttonBackgroundClass: string;

  @Input()
  tooltip: string | TemplateRef<any>;

  @Input()
  tooltipPlacement = 'top';

  @Input()
  radius: 'small' | 'large' = 'small';

  @Input()
  isReadOnly = false;

  @Input()
  addingEnabled = false;

  @Input()
  entityNameText: string;

  @Input()
  noValueTextTranslationKey: string;

  @Input()
  verticalSize: 'small' | 'medium' = 'medium';

  @Input()
  arrowEnabled: boolean;

  @Input()
  displayEmptyState = true;
  
  @Input()
  shouldDisableAddOptionHandler: (value: string) => boolean;

  @Input()
  clearEnabled: boolean;

  @Output()
  clearSelection = new EventEmitter<string>();

  @Output()
  addNew = new EventEmitter<string>();

  @Input()
  valueTemplate: any;

  addClick(): void {
    this.addNew.emit(this.searchField.value);
    this.close();
  }

  clearClick(): void {
    this.clearSelection.emit();
    this.close();
  }
}
