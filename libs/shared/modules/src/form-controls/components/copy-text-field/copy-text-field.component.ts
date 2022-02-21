import { TextFieldComponent } from './../text-field/text-field.component';
import {
  Component,
  Injector,
  Input,
  ViewChild,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { AbstractValueAccessor, MakeProvider } from '../abstract-value-accessor';

@Component({
  selector: 'app-copy-text-field',
  templateUrl: './copy-text-field.component.html',
  styleUrls: ['./copy-text-field.component.scss'],
  providers: [MakeProvider(CopyTextFieldComponent)],
})
export class CopyTextFieldComponent extends AbstractValueAccessor implements OnChanges, AfterViewInit {
  @ViewChild('textField')
  private textFieldComponent: TextFieldComponent;

  @Input()
  errorTexts: { [key: string]: string | (() => string) };

  @Input()
  required: boolean;

  @Input()
  index: number;

  @Input()
  validateOnDirty: boolean;

  @Input()
  readonly: boolean;

  @Input()
  label: string;

  @Input()
  valueToPass: string;

  @Input()
  showHideText = false;

  @Input()
  inputType = 'text';

  constructor(injector: Injector, private cd: ChangeDetectorRef) {
    super(injector);
  }

  ngAfterViewInit(): void {
    this.setValue(this.valueToPass);
    this.cd.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);

    if ('valueToPass' in changes && this.textFieldComponent) {
      this.setValue(this.valueToPass);
      if (this.textFieldComponent.textfieldElement.nativeElement.type === 'text') {
        this.textFieldComponent.toggleShowHide();
      }
    }
  }

  inputValue(inputValue: string): void {
    this.setValue(inputValue);
  }

  private setValue(value: string): void {
    this.value = value;
    this.textFieldComponent.value = value;
  }

  copyText(): void {
    navigator.clipboard.writeText(this.valueToPass);
  }

  buildTranslationKey(partital: string): string {
    return `core.formControls.copyTextField.${partital}`;
  }
}
